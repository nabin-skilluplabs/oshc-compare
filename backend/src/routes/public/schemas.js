import { z } from "zod";
import { dateStringSchema, uuidSchema } from "../../lib/validation.js";

export const quoteSchema = z.object({
  adults: z.number().int().refine((value) => [1, 2].includes(value), "Adults must be 1 or 2."),
  children: z.number().int().min(0).max(10),
  policyStartDate: dateStringSchema,
  policyEndDate: dateStringSchema,
  sessionId: z.string().optional(),
});

export const createApplicationSchema = z.object({
  quoteId: uuidSchema,
  selectedQuoteResultId: uuidSchema,
});

export const updateApplicationSchema = z.object({
  applicant: z
    .object({
      firstName: z.string().min(1).optional(),
      familyName: z.string().min(1).optional(),
      dateOfBirth: dateStringSchema.optional(),
      gender: z.string().optional(),
      nationality: z.string().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      stateRegion: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  visaStudy: z
    .object({
      visaType: z.string().optional(),
      courseName: z.string().optional(),
      institutionName: z.string().optional(),
      studentId: z.string().optional(),
      courseStartDate: dateStringSchema.optional(),
      courseEndDate: dateStringSchema.optional(),
    })
    .optional(),
  dependants: z
    .array(
      z.object({
        dependantType: z.enum(["adult", "child"]).default("child"),
        firstName: z.string().min(1),
        familyName: z.string().min(1),
        dateOfBirth: dateStringSchema,
        gender: z.string().optional(),
        nationality: z.string().optional(),
        relationshipToApplicant: z.string().optional(),
      }),
    )
    .optional(),
  consents: z
    .array(
      z.object({
        documentType: z.string(),
        version: z.string(),
        accepted: z.boolean(),
      }),
    )
    .optional(),
});

export const createOrderSchema = z.object({
  applicationId: uuidSchema,
});

export const createPaymentSessionSchema = z.object({
  orderId: uuidSchema,
});
