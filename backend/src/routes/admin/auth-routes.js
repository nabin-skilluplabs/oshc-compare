import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { issueDemoToken } from "../../lib/auth.js";
import { unauthorized } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { loginSchema } from "./schemas.js";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const input = validate(loginSchema, req.body);
    const admin = await prisma.adminUser.findUnique({ where: { email: input.email } });
    if (!admin) throw unauthorized("Invalid email or password.");

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      data: {
        accessToken: issueDemoToken("admin", { id: admin.id, email: admin.email, role: admin.role }),
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    });
  }),
);
