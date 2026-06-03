import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import esmock from "esmock";

const originalRandom = Math.random;

afterEach(() => {
  Math.random = originalRandom;
});

function createPrismaMock(overrides = {}) {
  return {
    order: {
      findUnique: async () => null,
      update: async () => null,
      create: async () => null,
      ...overrides.order,
    },
    orderStateTransition: {
      create: async () => null,
      ...overrides.orderStateTransition,
    },
    application: {
      findUnique: async () => null,
      ...overrides.application,
    },
  };
}

async function loadOrderService(prisma) {
  return esmock("../../src/services/order-service.js", {
    "../../src/lib/prisma.js": { prisma },
  });
}

describe("order service unit functions", () => {
  it("generates a dated OSHC order reference with six random digits", async () => {
    Math.random = () => 0.000042;
    const service = await loadOrderService(createPrismaMock());
    assert.match(service.generateOrderReference(), /^OSHC-\d{8}-000042$/);
  });

  it("transitions an order and records state metadata", async () => {
    const calls = {};
    const service = await loadOrderService(
      createPrismaMock({
        order: {
          findUnique: async (input) => {
            calls.findUnique = input;
            return { id: "order-1", status: "payment_pending", paidAt: null, fulfilledAt: null };
          },
          update: async (input) => {
            calls.update = input;
            return { id: "order-1", status: input.data.status };
          },
        },
        orderStateTransition: {
          create: async (input) => {
            calls.transition = input;
            return { id: "transition-1" };
          },
        },
      }),
    );

    const updated = await service.transitionOrder("order-1", "paid", {
      actorType: "payment_webhook",
      metadata: { processorEventId: "evt-1" },
    });

    assert.deepEqual(calls.findUnique, { where: { id: "order-1" } });
    assert.equal(updated.status, "paid");
    assert.equal(calls.update.data.status, "paid");
    assert.ok(calls.update.data.paidAt instanceof Date);
    assert.equal(calls.transition.data.fromStatus, "payment_pending");
    assert.equal(calls.transition.data.toStatus, "paid");
    assert.equal(calls.transition.data.actorType, "payment_webhook");
    assert.equal(calls.transition.data.metadata, '{"processorEventId":"evt-1"}');
  });

  it("allows same-status transitions without failing", async () => {
    let updateInput;
    const service = await loadOrderService(
      createPrismaMock({
        order: {
          findUnique: async () => ({ id: "order-1", status: "paid", paidAt: new Date("2026-01-01"), fulfilledAt: null }),
          update: async (input) => {
            updateInput = input;
            return { id: "order-1", status: "paid" };
          },
        },
      }),
    );

    await service.transitionOrder("order-1", "paid");
    assert.equal(updateInput.data.status, "paid");
  });

  it("rejects invalid transitions and missing orders", async () => {
    const service = await loadOrderService(
      createPrismaMock({
        order: {
          findUnique: async () => ({ id: "order-1", status: "quote_created" }),
        },
      }),
    );

    await assert.rejects(() => service.transitionOrder("order-1", "paid"), { code: "validation_error" });

    const missingService = await loadOrderService(createPrismaMock());
    await assert.rejects(() => missingService.transitionOrder("missing", "paid"), { code: "not_found" });
  });

  it("creates an order from a valid application snapshot", async () => {
    let createInput;
    const application = {
      id: "application-1",
      email: "student@example.com",
      applicantFirstName: "Demo",
      applicantFamilyName: "Student",
      selectedQuoteResultId: "result-1",
      quote: { agentId: "agent-1", channel: "agent" },
      selectedQuoteResult: {
        expiresAt: new Date("2099-01-01T00:00:00.000Z"),
        totalMinorUnits: 123456,
        currency: "AUD",
      },
      dependants: [],
    };
    const service = await loadOrderService(
      createPrismaMock({
        application: {
          findUnique: async (input) => {
            assert.deepEqual(input.where, { id: "application-1" });
            return application;
          },
        },
        order: {
          create: async (input) => {
            createInput = input;
            return { id: "order-1", ...input.data };
          },
        },
      }),
    );

    const order = await service.createOrderFromApplication("application-1");
    assert.equal(order.applicationId, "application-1");
    assert.equal(createInput.data.status, "application_completed");
    assert.equal(createInput.data.customerEmail, "student@example.com");
    assert.equal(createInput.data.customerFullName, "Demo Student");
    assert.equal(createInput.data.totalMinorUnits, 123456);
    assert.deepEqual(createInput.data.stateTransitions.create, {
      fromStatus: null,
      toStatus: "application_completed",
      actorType: "system",
    });
  });

  it("rejects order creation for missing, expired, or incomplete applications", async () => {
    const missingService = await loadOrderService(createPrismaMock());
    await assert.rejects(() => missingService.createOrderFromApplication("missing"), { code: "not_found" });

    const expiredService = await loadOrderService(
      createPrismaMock({
        application: {
          findUnique: async () => ({
            selectedQuoteResult: { expiresAt: new Date("2000-01-01T00:00:00.000Z") },
          }),
        },
      }),
    );
    await assert.rejects(() => expiredService.createOrderFromApplication("application-1"), {
      code: "validation_error",
    });

    const noEmailService = await loadOrderService(
      createPrismaMock({
        application: {
          findUnique: async () => ({
            email: null,
            selectedQuoteResult: { expiresAt: new Date("2099-01-01T00:00:00.000Z") },
          }),
        },
      }),
    );
    await assert.rejects(() => noEmailService.createOrderFromApplication("application-1"), {
      code: "validation_error",
    });
  });
});
