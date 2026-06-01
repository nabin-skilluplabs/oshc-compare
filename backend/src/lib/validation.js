import { z } from "zod";
import { validationError } from "./errors.js";

export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }

  throw validationError(
    result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  );
}

export const uuidSchema = z.string().uuid();
export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD.");

export function parseDateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function toDateOnly(value) {
  return value.toISOString().slice(0, 10);
}
