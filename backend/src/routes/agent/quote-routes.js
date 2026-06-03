import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { jsonParse } from "../../lib/json-field.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { createQuote } from "../../services/quote-service.js";
import { mapQuote } from "../public/mappers.js";
import { quoteSchema } from "./schemas.js";

export const agentQuoteRouter = Router();

agentQuoteRouter.get(
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

agentQuoteRouter.post(
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
