import assert from "node:assert/strict";
import { describe, it } from "node:test";
import esmock from "esmock";

function createPrismaMock(overrides = {}) {
  return {
    quote: {
      findUnique: async () => null,
      ...overrides.quote,
    },
    quoteResult: {
      findMany: async () => [],
      create: async () => null,
      ...overrides.quoteResult,
    },
    priceRow: {
      findMany: async () => [],
      ...overrides.priceRow,
    },
  };
}

async function loadPricingService(prisma) {
  return esmock("../src/services/pricing-service.js", {
    "../src/lib/prisma.js": { prisma },
  });
}

describe("pricing service unit functions", () => {
  it("throws not found when quote does not exist", async () => {
    const service = await loadPricingService(createPrismaMock());
    await assert.rejects(() => service.getOrCreateQuoteResults("missing"), { code: "not_found" });
  });

  it("returns existing quote results without creating new rows", async () => {
    let createCalled = false;
    const quote = { id: "quote-1" };
    const existing = [{ id: "result-1", totalMinorUnits: 100 }];
    const service = await loadPricingService(
      createPrismaMock({
        quote: { findUnique: async () => quote },
        quoteResult: {
          findMany: async (input) => {
            assert.deepEqual(input, {
              where: { quoteId: "quote-1" },
              orderBy: { totalMinorUnits: "asc" },
            });
            return existing;
          },
          create: async () => {
            createCalled = true;
          },
        },
      }),
    );

    const output = await service.getOrCreateQuoteResults("quote-1");
    assert.deepEqual(output, { quote, results: existing });
    assert.equal(createCalled, false);
  });

  it("builds quote result snapshots from matching price rows", async () => {
    const quote = {
      id: "quote-1",
      coverType: "single",
      calculatedDurationDays: 365,
      policyStartDate: new Date("2026-07-01T00:00:00.000Z"),
      expiresAt: new Date("2026-06-04T00:00:00.000Z"),
    };
    const createdInputs = [];
    const service = await loadPricingService(
      createPrismaMock({
        quote: { findUnique: async () => quote },
        quoteResult: {
          findMany: async () => [],
          create: async (input) => {
            createdInputs.push(input);
            return { id: input.data.productId, totalMinorUnits: input.data.totalMinorUnits };
          },
        },
        priceRow: {
          findMany: async (input) => {
            assert.equal(input.where.coverType, "single");
            assert.deepEqual(input.where.durationDaysMin, { lte: 365 });
            assert.deepEqual(input.where.durationDaysMax, { gte: 365 });
            return [
              {
                productId: "product-expensive",
                premiumMinorUnits: 200,
                feeMinorUnits: 20,
                currency: "AUD",
                product: {
                  id: "product-expensive",
                  code: "EXP",
                  name: "Expensive Cover",
                  keyInclusions: '["Hospital"]',
                  disclosureUrl: "https://example.com/disclosure",
                  policyDocumentUrl: "https://example.com/policy",
                  provider: {
                    id: "provider-1",
                    code: "P1",
                    name: "Provider One",
                    logoFileRef: "logo.png",
                    supportMetadata: '{"certificateDeliveryNote":"Instant certificate"}',
                    disclosureUrl: "https://example.com/provider",
                    productDisclosureUrl: "https://example.com/provider-product",
                  },
                },
              },
              {
                productId: "product-cheap",
                premiumMinorUnits: 100,
                feeMinorUnits: 10,
                currency: "AUD",
                product: {
                  id: "product-cheap",
                  code: "CHP",
                  name: "Cheap Cover",
                  keyInclusions: "",
                  disclosureUrl: null,
                  policyDocumentUrl: null,
                  provider: {
                    id: "provider-2",
                    code: "P2",
                    name: "Provider Two",
                    logoFileRef: null,
                    supportMetadata: "",
                    disclosureUrl: null,
                    productDisclosureUrl: null,
                  },
                },
              },
            ];
          },
        },
      }),
    );

    const output = await service.getOrCreateQuoteResults("quote-1");
    assert.deepEqual(
      output.results.map((result) => result.id),
      ["product-cheap", "product-expensive"],
    );
    assert.equal(createdInputs[0].data.totalMinorUnits, 220);
    assert.equal(JSON.parse(createdInputs[0].data.providerSnapshot).certificateDeliveryNote, "Instant certificate");
    assert.deepEqual(JSON.parse(createdInputs[1].data.productSnapshot).keyInclusions, []);
    assert.equal(JSON.parse(createdInputs[1].data.providerSnapshot).certificateDeliveryNote, "Certificate issued after payment confirmation.");
  });
});
