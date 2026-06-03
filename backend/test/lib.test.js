import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { z } from "zod";
import { asyncHandler } from "../src/lib/async-handler.js";
import {
  ApiError,
  errorHandler,
  forbidden,
  notFound,
  unauthorized,
  validationError,
} from "../src/lib/errors.js";
import { issueDemoToken, readDemoToken, requireAdminRole, requireAuth } from "../src/lib/auth.js";
import { jsonArrayString, jsonParse, jsonString } from "../src/lib/json-field.js";
import { parseDateOnly, toDateOnly, validate } from "../src/lib/validation.js";

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe("errors", () => {
  it("creates typed API errors", () => {
    assert.deepEqual(notFound("Missing."), new ApiError(404, "not_found", "Missing."));
    assert.deepEqual(unauthorized(), new ApiError(401, "unauthorized", "Unauthorized."));
    assert.deepEqual(forbidden(), new ApiError(403, "forbidden", "Forbidden."));
    assert.deepEqual(
      validationError([{ field: "email", message: "Invalid" }]),
      new ApiError(422, "validation_error", "One or more fields are invalid.", [
        { field: "email", message: "Invalid" },
      ]),
    );
  });

  it("serializes API errors and internal errors", () => {
    const originalError = console.error;
    console.error = () => {};
    const apiResponse = createResponse();
    try {
      errorHandler(validationError([{ field: "x", message: "Required" }]), {}, apiResponse, () => {});
      assert.equal(apiResponse.statusCode, 422);
      assert.deepEqual(apiResponse.body.error.fields, [{ field: "x", message: "Required" }]);

      const internalResponse = createResponse();
      errorHandler(new Error("boom"), {}, internalResponse, () => {});
      assert.equal(internalResponse.statusCode, 500);
      assert.equal(internalResponse.body.error.code, "internal_error");
    } finally {
      console.error = originalError;
    }
  });
});

describe("validation", () => {
  it("returns parsed values and maps validation issues to ApiError fields", () => {
    const schema = z.object({ count: z.number().int().min(1) });
    assert.deepEqual(validate(schema, { count: 2 }), { count: 2 });

    assert.throws(
      () => validate(schema, { count: 0 }),
      (error) => {
        assert.equal(error.status, 422);
        assert.equal(error.fields[0].field, "count");
        return true;
      },
    );
  });

  it("parses and formats date-only values as UTC dates", () => {
    const date = parseDateOnly("2026-07-01");
    assert.equal(date.toISOString(), "2026-07-01T00:00:00.000Z");
    assert.equal(toDateOnly(date), "2026-07-01");
  });
});

describe("json field helpers", () => {
  it("stringifies default object and array values", () => {
    assert.equal(jsonString(null), "{}");
    assert.equal(jsonString({ a: 1 }), '{"a":1}');
    assert.equal(jsonArrayString(null), "[]");
    assert.equal(jsonArrayString(["a"]), '["a"]');
  });

  it("parses JSON strings and falls back on empty or invalid values", () => {
    assert.deepEqual(jsonParse('{"a":1}'), { a: 1 });
    assert.deepEqual(jsonParse({ a: 1 }), { a: 1 });
    assert.deepEqual(jsonParse("", { fallback: true }), { fallback: true });
    assert.deepEqual(jsonParse("not json", []), []);
  });
});

describe("auth helpers", () => {
  it("issues and reads demo tokens", () => {
    const token = issueDemoToken("admin", { id: "admin-1", role: "admin" });
    const payload = readDemoToken(token);
    assert.equal(payload.kind, "admin");
    assert.deepEqual(payload.subject, { id: "admin-1", role: "admin" });
    assert.equal(readDemoToken("bad-token"), null);
  });

  it("accepts matching bearer auth and rejects missing or wrong tokens", () => {
    const token = issueDemoToken("agent", { id: "agent-1" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    let nextError;
    requireAuth("agent")(req, {}, (error) => {
      nextError = error;
    });
    assert.equal(nextError, undefined);
    assert.equal(req.auth.subject.id, "agent-1");

    requireAuth("admin")({ headers: {} }, {}, (error) => {
      nextError = error;
    });
    assert.equal(nextError.code, "unauthorized");

    requireAuth("admin")({ headers: { authorization: `Bearer ${token}` } }, {}, (error) => {
      nextError = error;
    });
    assert.equal(nextError.code, "unauthorized");
  });

  it("enforces allowed admin roles", () => {
    let nextError;
    requireAdminRole("admin")({ auth: { subject: { role: "operations" } } }, {}, (error) => {
      nextError = error;
    });
    assert.equal(nextError.code, "forbidden");

    requireAdminRole("admin")({ auth: { subject: { role: "admin" } } }, {}, (error) => {
      nextError = error;
    });
    assert.equal(nextError, undefined);
  });
});

describe("async handler", () => {
  it("forwards rejected async handlers to next", async () => {
    const expected = new Error("failed");
    let actual;
    const wrapped = asyncHandler(async () => {
      throw expected;
    });

    wrapped({}, {}, (error) => {
      actual = error;
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(actual, expected);
  });
});
