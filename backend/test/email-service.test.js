import assert from "node:assert/strict";
import { describe, it } from "node:test";
import esmock from "esmock";

function createPrismaMock(overrides = {}) {
  return {
    emailLog: {
      create: async () => ({ id: "email-1" }),
      update: async () => null,
      ...overrides.emailLog,
    },
  };
}

async function loadEmailService(prisma) {
  const previousKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "";
  const module = await esmock("../src/services/email-service.js", {
    "../src/lib/prisma.js": { prisma },
  });
  process.env.RESEND_API_KEY = previousKey;
  return module;
}

describe("email service unit functions", () => {
  it("logs and marks email as sent when Resend is not configured", async () => {
    const originalLog = console.log;
    console.log = () => {};
    const calls = {};
    try {
      const service = await loadEmailService(
        createPrismaMock({
          emailLog: {
            create: async (input) => {
              calls.create = input;
              return { id: "email-1" };
            },
            update: async (input) => {
              calls.update = input;
              return { id: "email-1", ...input.data };
            },
          },
        }),
      );

      const sent = await service.sendOrderEmail({
        orderId: "order-1",
        to: "student@example.com",
        subject: "Payment received",
        templateKey: "payment_confirmation",
        html: "<p>Paid</p>",
        metadata: { source: "unit-test" },
      });

      assert.equal(calls.create.data.orderId, "order-1");
      assert.equal(calls.create.data.recipientEmail, "student@example.com");
      assert.equal(calls.create.data.status, "queued");
      assert.equal(calls.create.data.provider, "development_log");
      assert.equal(calls.create.data.metadata, '{"source":"unit-test"}');
      assert.equal(calls.update.where.id, "email-1");
      assert.equal(calls.update.data.status, "sent");
      assert.ok(calls.update.data.sentAt instanceof Date);
      assert.equal(sent.providerMessageId, "dev-email-1");
    } finally {
      console.log = originalLog;
    }
  });
});
