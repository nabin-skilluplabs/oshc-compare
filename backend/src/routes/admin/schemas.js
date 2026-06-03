import { z } from "zod";
import { uuidSchema } from "../../lib/validation.js";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const providerSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["active", "inactive"]),
  logoFileRef: z.string().optional(),
  disclosureUrl: z.string().url().optional(),
  productDisclosureUrl: z.string().url().optional(),
});

export const productSchema = z.object({
  providerId: uuidSchema,
  code: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["active", "inactive"]),
  coverTypes: z.array(z.enum(["single", "couple", "single_parent_family", "family"])).min(1),
  disclosureUrl: z.string().url().optional(),
  policyDocumentUrl: z.string().url().optional(),
});
