import { unauthorized, forbidden } from "./errors.js";

export function issueDemoToken(kind, subject) {
  return Buffer.from(JSON.stringify({ kind, subject, issuedAt: Date.now() })).toString("base64url");
}

export function readDemoToken(token) {
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function requireAuth(kind) {
  return (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(unauthorized());
    }

    const token = readDemoToken(header.slice("Bearer ".length));
    if (!token || token.kind !== kind) {
      return next(unauthorized());
    }

    req.auth = token;
    next();
  };
}

export function requireAdminRole(...roles) {
  return (req, _res, next) => {
    const role = req.auth?.subject?.role;
    if (!roles.includes(role)) {
      return next(forbidden());
    }
    next();
  };
}
