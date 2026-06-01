import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async-handler.js";
import { issueDemoToken, requireAuth } from "../lib/auth.js";
import { validate, dateStringSchema } from "../lib/validation.js";
import { prisma } from "../lib/prisma.js";
import { unauthorized } from "../lib/errors.js";
import { createQuote } from "../services/quote-service.js";
import { mapQuote } from "./public.js";
import { jsonParse } from "../lib/json-field.js";

export const agentRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const quoteSchema = z.object({
  adults: z.number().int().refine((value) => [1, 2].includes(value), "Adults must be 1 or 2."),
  children: z.number().int().min(0).max(10),
  policyStartDate: dateStringSchema,
  policyEndDate: dateStringSchema,
  sessionId: z.string().optional(),
});

agentRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const input = validate(loginSchema, req.body);
    const agent = await prisma.agent.findUnique({ where: { email: input.email } });
    if (!agent || agent.status !== "approved") {
      throw unauthorized("Invalid agent account.");
    }

    res.json({
      data: {
        accessToken: issueDemoToken("agent", { id: agent.id, email: agent.email, status: agent.status }),
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    });
  }),
);

agentRouter.use(requireAuth("agent"));

agentRouter.get(
  "/quotes",
  asyncHandler(async (req, res) => {
    const quotes = await prisma.quote.findMany({
      where: { agentId: req.auth.subject.id },
      include: {
        applications: {
          include: {
            orders: {
              include: { certificates: true, quoteResult: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: quotes.map((quote) => {
        const order = quote.applications[0]?.orders[0];
        return {
          quote: mapQuote(quote),
          orderStatus: order?.status || null,
          selectedProvider: order ? jsonParse(order.quoteResult.providerSnapshot, {}).name : null,
          certificateStatus: order?.certificates[0]?.status || null,
        };
      }),
    });
  }),
);

agentRouter.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    const input = validate(quoteSchema, req.body);
    const quote = await createQuote(input, { agentId: req.auth.subject.id });
    res.status(201).json({
      data: {
        quote: mapQuote(quote),
        shareUrl: `${process.env.APP_BASE_URL || "http://localhost:3000"}/quote/${quote.id}`,
      },
    });
  }),
);
