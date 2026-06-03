import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp } from "../../src/app.js";

describe("app factory unit functions", () => {
  it("creates an Express application instance", () => {
    const app = createApp();
    assert.equal(typeof app, "function");
    assert.equal(typeof app.use, "function");
    assert.equal(typeof app.listen, "function");
  });
});
