import assert from "node:assert/strict";
import { describe, it } from "node:test";
import esmock from "esmock";

function createPrismaMock(overrides = {}) {
  return {
    quote: {
      create: async () => null,
      findUnique: async () => null,
      ...overrides.quote,
    },
  };
}

async function loadQuoteService(prisma) {
  return esmock("../src/services/quote-service.js", {
    "../src/lib/prisma.js": { prisma },
  });
}

describe("quote service unit functions", () => {
  it("calculates cover type for each supported household composition", async () => {
    const service = await loadQuoteService(createPrismaMock());
    assert.equal(service.calculateCoverType(1, 0), "single");
    assert.equal(service.calculateCoverType(2, 0), "couple");
    assert.equal(service.calculateCoverType(1, 2), "single_parent_family");
    assert.equal(service.calculateCoverType(2, 2), "family");
  });

  it("rejects unsupported adult counts", async () => {
    const service = await loadQuoteService(createPrismaMock());
    assert.throws(
      () => service.calculateCoverType(3, 0),
      (error) => {
        assert.equal(error.code, "validation_error");
        assert.equal(error.fields[0].field, "adults");
        return true;
      },
    );
  });

  it("calculates policy duration in whole days", async () => {
    const service = await loadQuoteService(createPrismaMock());
    assert.equal(
      service.calculateDurationDays(
        new Date("2026-07-01T00:00:00.000Z"),
        new Date("2027-07-01T00:00:00.000Z"),
      ),
      365,
    );
  });

  it("creates a direct quote using parsed dates and calculated cover metadata", async () => {
    let createInput;
    const createdQuote = { id: "quote-1" };
    const service = await loadQuoteService(
      createPrismaMock({
        quote: {
          create: async (input) => {
            createInput = input;
            return createdQuote;
          },
        },
      }),
    );

    const quote = await service.createQuote({
      adults: 2,
      children: 0,
      policyStartDate: "2026-07-01",
      policyEndDate: "2027-07-01",
      sessionId: "session-1",
    });

    assert.equal(quote, createdQuote);
    assert.equal(createInput.data.channel, "direct");
    assert.equal(createInput.data.sessionId, "session-1");
    assert.equal(createInput.data.coverType, "couple");
    assert.equal(createInput.data.calculatedDurationDays, 365);
    assert.equal(createInput.data.policyStartDate.toISOString(), "2026-07-01T00:00:00.000Z");
    assert.equal(createInput.data.policyEndDate.toISOString(), "2027-07-01T00:00:00.000Z");
  });

  it("creates an agent quote when agent context is provided", async () => {
    let createInput;
    const service = await loadQuoteService(
      createPrismaMock({
        quote: {
          create: async (input) => {
            createInput = input;
            return { id: "quote-1" };
          },
        },
      }),
    );

    await service.createQuote(
      {
        adults: 1,
        children: 1,
        policyStartDate: "2026-07-01",
        policyEndDate: "2027-07-01",
      },
      { agentId: "agent-1" },
    );

    assert.equal(createInput.data.channel, "agent");
    assert.equal(createInput.data.agentId, "agent-1");
    assert.equal(createInput.data.coverType, "single_parent_family");
    assert.ok(createInput.data.sessionId);
  });

  it("rejects quote creation when policy end date is not after start date", async () => {
    const service = await loadQuoteService(createPrismaMock());
    await assert.rejects(
      () =>
        service.createQuote({
          adults: 1,
          children: 0,
          policyStartDate: "2027-07-01",
          policyEndDate: "2026-07-01",
        }),
      (error) => {
        assert.equal(error.code, "validation_error");
        assert.equal(error.fields[0].field, "policyEndDate");
        return true;
      },
    );
  });

  it("returns quotes by id or throws not found", async () => {
    const expected = { id: "quote-1" };
    let findInput;
    const service = await loadQuoteService(
      createPrismaMock({
        quote: {
          findUnique: async (input) => {
            findInput = input;
            return expected;
          },
        },
      }),
    );

    assert.equal(await service.getQuoteOrThrow("quote-1"), expected);
    assert.deepEqual(findInput, { where: { id: "quote-1" } });

    const missingService = await loadQuoteService(createPrismaMock());
    await assert.rejects(() => missingService.getQuoteOrThrow("missing"), { code: "not_found" });
  });
});
