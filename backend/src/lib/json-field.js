export function jsonString(value) {
  return JSON.stringify(value ?? {});
}

export function jsonArrayString(value) {
  return JSON.stringify(value ?? []);
}

export function jsonParse(value, fallback = {}) {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
