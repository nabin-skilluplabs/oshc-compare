import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { notFound, validationError } from "../lib/errors.js";
import { parseDateOnly } from "../lib/validation.js";

export function calculateCoverType(adults, children) {
  if (adults === 1 && children === 0) return "single";
  if (adults === 2 && children === 0) return "couple";
  if (adults === 1 && children > 0) return "single_parent_family";
  if (adults === 2 && children > 0) return "family";
  throw validationError([{ field: "adults", message: "Adults must be 1 or 2." }]);
}

export function calculateDurationDays(startDate, endDate) {
  const milliseconds = endDate.getTime() - startDate.getTime();
  return Math.ceil(milliseconds / 86_400_000);
}

export async function createQuote(input, context = {}) {
  const startDate = parseDateOnly(input.policyStartDate);
  const endDate = parseDateOnly(input.policyEndDate);
  const durationDays = calculateDurationDays(startDate, endDate);

  if (durationDays <= 0) {
    throw validationError([
      { field: "policyEndDate", message: "Policy end date must be after policy start date." },
    ]);
  }

  const coverType = calculateCoverType(input.adults, input.children);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  return prisma.quote.create({
    data: {
      sessionId: input.sessionId || randomUUID(),
      agentId: context.agentId,
      channel: context.agentId ? "agent" : "direct",
      adults: input.adults,
      children: input.children,
      policyStartDate: startDate,
      policyEndDate: endDate,
      calculatedDurationDays: durationDays,
      coverType,
      expiresAt,
    },
  });
}

export async function getQuoteOrThrow(id) {
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) throw notFound("Quote not found.");
  return quote;
}
