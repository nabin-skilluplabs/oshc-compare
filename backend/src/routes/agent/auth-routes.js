import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { issueDemoToken } from "../../lib/auth.js";
import { unauthorized } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { loginSchema } from "./schemas.js";

export const agentAuthRouter = Router();

agentAuthRouter.post(
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
