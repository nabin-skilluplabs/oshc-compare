import { z } from "zod";
import { dateStringSchema } from "../../lib/validation.js";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const quoteSchema = z.object({
  adults: z.number().int().refine((value) => [1, 2].includes(value), "Adults must be 1 or 2."),
  children: z.number().int().min(0).max(10),
  policyStartDate: dateStringSchema,
  policyEndDate: dateStringSchema,
  sessionId: z.string().optional(),
});
