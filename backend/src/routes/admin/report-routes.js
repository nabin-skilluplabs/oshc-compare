import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { prisma } from "../../lib/prisma.js";

export const adminReportRouter = Router();

adminReportRouter.get(
  "/reports/quote-funnel",
  asyncHandler(async (_req, res) => {
    const quoteSubmitted = await prisma.quote.count();
    const quoteResultsViewed = await prisma.quoteResult.groupBy({ by: ["quoteId"] }).then((rows) => rows.length);
    res.json({ data: { quoteStarted: quoteSubmitted, quoteSubmitted, quoteResultsViewed } });
  }),
);

adminReportRouter.get(
  "/reports/conversion",
  asyncHandler(async (_req, res) => {
    const paymentSucceeded = await prisma.payment.count({ where: { status: "succeeded" } });
    const paymentFailed = await prisma.payment.count({ where: { status: "failed" } });
    const applicationSubmitted = await prisma.application.count({ where: { status: "valid" } });
    res.json({
      data: {
        policySelected: applicationSubmitted,
        applicationSubmitted,
        paymentStarted: await prisma.payment.count(),
        paymentSucceeded,
        paymentFailed,
        quoteToPurchaseRate: applicationSubmitted ? paymentSucceeded / applicationSubmitted : 0,
      },
    });
  }),
);
