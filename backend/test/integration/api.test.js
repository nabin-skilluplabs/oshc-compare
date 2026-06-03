import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";

const testDbPath = resolve("prisma/test-integration.db");
process.env.DATABASE_URL = `file:${testDbPath}`;
process.env.APP_BASE_URL = "http://localhost:3000";
process.env.RESEND_API_KEY = "";

let api;
let prisma;

async function authorizedAdminHeaders() {
  const response = await api
    .post("/api/v1/admin/auth/login")
    .send({ email: "admin@example.com", password: "password" });

  assert.equal(response.statusCode, 200);
  return { authorization: `Bearer ${response.body.data.accessToken}` };
}

async function authorizedAgentHeaders() {
  const response = await api
    .post("/api/v1/agent/auth/login")
    .send({ email: "agent@example.com", password: "password" });

  assert.equal(response.statusCode, 200);
  return { authorization: `Bearer ${response.body.data.accessToken}` };
}

before(async () => {
  if (existsSync(testDbPath)) unlinkSync(testDbPath);
  execFileSync("sqlite3", [testDbPath, ".read prisma/init.sql"], { stdio: "inherit" });
  execFileSync("node", ["prisma/seed.js"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
  });

  const { createApp } = await import("../../src/app.js");
  ({ prisma } = await import("../../src/lib/prisma.js"));
  api = supertest(createApp());
});

after(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (existsSync(testDbPath)) unlinkSync(testDbPath);
});

describe("public quote and results API integration", () => {
  it("rejects quote requests where end date is before start date", async () => {
    const response = await api.post("/api/v1/quotes").send({
      adults: 1,
      children: 0,
      policyStartDate: "2027-07-01",
      policyEndDate: "2026-07-01",
    });

    assert.equal(response.statusCode, 422);
    assert.equal(response.body.error.code, "validation_error");
  });

  it("creates a quote and returns seeded quote results", async () => {
    const quote = await api.post("/api/v1/quotes").send({
      adults: 1,
      children: 0,
      policyStartDate: "2026-07-01",
      policyEndDate: "2027-07-01",
    });

    assert.equal(quote.statusCode, 201);
    assert.equal(quote.body.data.coverType, "single");
    assert.equal(quote.body.data.calculatedDurationDays, 365);

    const results = await api.get(`/api/v1/quotes/${quote.body.data.id}/results`);
    assert.equal(results.statusCode, 200);
    assert.equal(results.body.data.length, 3);
    assert.equal(results.body.data[0].total.currency, "AUD");
  });
});

describe("checkout and payment API integration", () => {
  it("creates application, order, payment session, and processes webhook idempotently", async () => {
    const quote = await api.post("/api/v1/quotes").send({
      adults: 1,
      children: 0,
      policyStartDate: "2026-07-01",
      policyEndDate: "2027-07-01",
    });
    const results = await api.get(`/api/v1/quotes/${quote.body.data.id}/results`);

    const application = await api.post("/api/v1/applications").send({
      quoteId: quote.body.data.id,
      selectedQuoteResultId: results.body.data[0].id,
    });
    assert.equal(application.statusCode, 201);

    const updatedApplication = await api
      .patch(`/api/v1/applications/${application.body.data.id}`)
      .send({
        applicant: {
          firstName: "Demo",
          familyName: "Student",
          dateOfBirth: "2000-01-01",
          nationality: "India",
        },
        contact: {
          email: "student@example.com",
          phone: "+61400000001",
          country: "Australia",
        },
        visaStudy: {
          visaType: "Student 500",
          courseName: "Master of IT",
          institutionName: "Demo University",
        },
        consents: [{ documentType: "privacy_policy", version: "2026-06-01", accepted: true }],
      });
    assert.equal(updatedApplication.statusCode, 200);

    const order = await api.post("/api/v1/orders").send({ applicationId: application.body.data.id });
    assert.equal(order.statusCode, 201);
    assert.equal(order.body.data.status, "application_completed");

    const paymentSession = await api
      .post("/api/v1/payments/sessions")
      .send({ orderId: order.body.data.id });
    assert.equal(paymentSession.statusCode, 201);

    const webhookPayload = {
      id: "evt_test_payment_success",
      type: "payment.succeeded",
      paymentId: paymentSession.body.data.paymentId,
    };

    const webhook = await api.post("/api/v1/webhooks/payments/demo").send(webhookPayload);
    assert.equal(webhook.statusCode, 200);

    const duplicateWebhook = await api.post("/api/v1/webhooks/payments/demo").send(webhookPayload);
    assert.equal(duplicateWebhook.statusCode, 200);

    const paidOrder = await prisma.order.findUnique({
      where: { id: order.body.data.id },
      include: { payments: true, emailLogs: true },
    });
    assert.equal(paidOrder.status, "paid");
    assert.equal(paidOrder.payments[0].status, "succeeded");
    assert.equal(paidOrder.emailLogs.length, 1);
  });
});

describe("admin API integration", () => {
  it("logs in and lists providers with a bearer token", async () => {
    const headers = await authorizedAdminHeaders();
    const response = await api.get("/api/v1/admin/providers").set(headers);

    assert.equal(response.statusCode, 200);
    assert.ok(response.body.data.length >= 3);
  });

  it("blocks admin provider list without authorization", async () => {
    const response = await api.get("/api/v1/admin/providers");

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.error.code, "unauthorized");
  });
});

describe("agent API integration", () => {
  it("creates a tracked agent quote", async () => {
    const headers = await authorizedAgentHeaders();
    const response = await api.post("/api/v1/agent/quotes").set(headers).send({
      adults: 1,
      children: 0,
      policyStartDate: "2026-07-01",
      policyEndDate: "2027-07-01",
    });

    assert.equal(response.statusCode, 201);
    assert.equal(response.body.data.quote.channel, "agent");
    assert.ok(response.body.data.shareUrl.includes(response.body.data.quote.id));
  });
});
