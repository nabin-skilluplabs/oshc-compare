import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapAdminOrderSummary, mapProduct, mapProvider } from "../../src/routes/admin.js";
import { mapApplication, mapMoney, mapOrder, mapQuote, mapQuoteResult } from "../../src/routes/public.js";

describe("public route mapper unit functions", () => {
  it("maps money values", () => {
    assert.deepEqual(mapMoney(12345), { amountMinorUnits: 12345, currency: "AUD" });
    assert.deepEqual(mapMoney(12345, "NZD"), { amountMinorUnits: 12345, currency: "NZD" });
  });

  it("maps quotes to API response shape", () => {
    assert.deepEqual(
      mapQuote({
        id: "quote-1",
        adults: 1,
        children: 0,
        policyStartDate: new Date("2026-07-01T00:00:00.000Z"),
        policyEndDate: new Date("2027-07-01T00:00:00.000Z"),
        calculatedDurationDays: 365,
        coverType: "single",
        channel: "direct",
        agentId: null,
        expiresAt: new Date("2026-06-04T00:00:00.000Z"),
      }),
      {
        id: "quote-1",
        adults: 1,
        children: 0,
        policyStartDate: "2026-07-01",
        policyEndDate: "2027-07-01",
        calculatedDurationDays: 365,
        coverType: "single",
        channel: "direct",
        agentId: null,
        expiresAt: "2026-06-04T00:00:00.000Z",
      },
    );
  });

  it("maps quote results with parsed snapshots", () => {
    const mapped = mapQuoteResult({
      id: "result-1",
      quoteId: "quote-1",
      providerSnapshot: '{"name":"Provider One","certificateDeliveryNote":"Instant"}',
      productSnapshot: '{"name":"Product One"}',
      coverType: "single",
      premiumMinorUnits: 10000,
      feeMinorUnits: 500,
      totalMinorUnits: 10500,
      currency: "AUD",
      expiresAt: new Date("2026-06-04T00:00:00.000Z"),
    });

    assert.equal(mapped.provider.name, "Provider One");
    assert.equal(mapped.product.name, "Product One");
    assert.deepEqual(mapped.total, { amountMinorUnits: 10500, currency: "AUD" });
    assert.equal(mapped.certificateDeliveryNote, "Instant");
  });

  it("maps applications including nullable applicant fields and dependants", () => {
    const mapped = mapApplication({
      id: "application-1",
      quoteId: "quote-1",
      selectedQuoteResultId: "result-1",
      status: "valid",
      applicantFirstName: "Demo",
      applicantFamilyName: "Student",
      applicantDateOfBirth: new Date("2000-01-01T00:00:00.000Z"),
      applicantGender: null,
      applicantNationality: "India",
      email: "student@example.com",
      phone: "+61400000000",
      addressLine1: "1 Test St",
      addressLine2: null,
      city: "Sydney",
      stateRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
      visaType: "Student 500",
      courseName: "MIT",
      institutionName: "Demo University",
      studentId: "S123",
      courseStartDate: new Date("2026-07-01T00:00:00.000Z"),
      courseEndDate: null,
      dependants: [
        {
          id: "dep-1",
          dependantType: "child",
          firstName: "Child",
          familyName: "Student",
          dateOfBirth: new Date("2020-01-01T00:00:00.000Z"),
          gender: null,
          nationality: "India",
          relationshipToApplicant: "child",
        },
      ],
    });

    assert.equal(mapped.applicant.dateOfBirth, "2000-01-01");
    assert.equal(mapped.visaStudy.courseStartDate, "2026-07-01");
    assert.equal(mapped.visaStudy.courseEndDate, null);
    assert.equal(mapped.dependants[0].dateOfBirth, "2020-01-01");
  });

  it("maps orders with optional quote result snapshots", () => {
    const mapped = mapOrder(
      {
        id: "order-1",
        orderReference: "OSHC-20260603-000001",
        status: "paid",
        totalMinorUnits: 10000,
        currency: "AUD",
        customerEmail: "student@example.com",
        paidAt: new Date("2026-06-03T00:00:00.000Z"),
      },
      {
        providerSnapshot: '{"name":"Provider One"}',
        productSnapshot: '{"name":"Product One"}',
      },
    );

    assert.equal(mapped.providerName, "Provider One");
    assert.equal(mapped.productName, "Product One");
    assert.equal(mapped.paidAt, "2026-06-03T00:00:00.000Z");
  });
});

describe("admin route mapper unit functions", () => {
  it("maps providers and products", () => {
    assert.deepEqual(
      mapProvider({
        id: "provider-1",
        code: "P1",
        name: "Provider One",
        status: "active",
        logoFileRef: "logo.png",
        disclosureUrl: "https://example.com/disclosure",
        productDisclosureUrl: "https://example.com/product",
      }),
      {
        id: "provider-1",
        code: "P1",
        name: "Provider One",
        status: "active",
        logoUrl: "logo.png",
        disclosureUrl: "https://example.com/disclosure",
        productDisclosureUrl: "https://example.com/product",
      },
    );

    assert.deepEqual(
      mapProduct({
        id: "product-1",
        providerId: "provider-1",
        code: "PRD",
        name: "Product",
        status: "active",
        coverTypes: [{ coverType: "single" }, { coverType: "family" }],
        disclosureUrl: "https://example.com/disclosure",
        policyDocumentUrl: "https://example.com/policy",
      }),
      {
        id: "product-1",
        providerId: "provider-1",
        code: "PRD",
        name: "Product",
        status: "active",
        coverTypes: ["single", "family"],
        disclosureUrl: "https://example.com/disclosure",
        policyDocumentUrl: "https://example.com/policy",
      },
    );
  });

  it("maps admin order summaries with fallback statuses", () => {
    const mapped = mapAdminOrderSummary({
      id: "order-1",
      orderReference: "OSHC-20260603-000001",
      status: "paid",
      customerEmail: "student@example.com",
      customerFullName: "Demo Student",
      totalMinorUnits: 10000,
      currency: "AUD",
      quoteResult: {
        providerSnapshot: '{"name":"Provider One"}',
        productSnapshot: '{"name":"Product One"}',
      },
      payments: [],
      certificates: [],
    });

    assert.equal(mapped.providerName, "Provider One");
    assert.equal(mapped.productName, "Product One");
    assert.equal(mapped.paymentStatus, "created");
    assert.equal(mapped.certificateStatus, "pending");
  });
});
