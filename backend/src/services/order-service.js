import { prisma } from "../lib/prisma.js";
import { notFound, validationError } from "../lib/errors.js";
import { jsonString } from "../lib/json-field.js";

const validTransitions = new Map([
  ["quote_created", ["application_started"]],
  ["application_started", ["application_completed"]],
  ["application_completed", ["payment_pending"]],
  ["payment_pending", ["payment_failed", "paid"]],
  ["payment_failed", ["payment_pending"]],
  ["paid", ["provider_submission_pending", "certificate_pending", "refund_requested", "cancelled"]],
  ["provider_submission_pending", ["provider_submission_failed", "certificate_pending"]],
  ["provider_submission_failed", ["provider_submission_pending"]],
  ["certificate_pending", ["certificate_issued"]],
  ["certificate_issued", ["fulfilled"]],
  ["fulfilled", ["refund_requested"]],
  ["refund_requested", ["refunded"]],
]);

export function generateOrderReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `OSHC-${date}-${random}`;
}

export async function transitionOrder(orderId, toStatus, options = {}) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw notFound("Order not found.");

  const allowed = validTransitions.get(order.status) || [];
  if (order.status !== toStatus && !allowed.includes(toStatus)) {
    throw validationError([
      { field: "status", message: `Cannot transition order from ${order.status} to ${toStatus}.` },
    ]);
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: toStatus,
      paidAt: toStatus === "paid" ? new Date() : order.paidAt,
      fulfilledAt: toStatus === "fulfilled" ? new Date() : order.fulfilledAt,
    },
  });

  await prisma.orderStateTransition.create({
    data: {
      orderId,
      fromStatus: order.status,
      toStatus,
      actorType: options.actorType || "system",
      actorAdminUserId: options.actorAdminUserId,
      reason: options.reason,
      metadata: jsonString(options.metadata || {}),
    },
  });

  return updated;
}

export async function createOrderFromApplication(applicationId) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      quote: true,
      selectedQuoteResult: true,
      dependants: true,
    },
  });

  if (!application) throw notFound("Application not found.");
  if (application.selectedQuoteResult.expiresAt <= new Date()) {
    throw validationError([{ field: "selectedQuoteResultId", message: "Selected quote result has expired." }]);
  }
  if (!application.email) {
    throw validationError([{ field: "contact.email", message: "Email is required before creating an order." }]);
  }

  const customerFullName = [application.applicantFirstName, application.applicantFamilyName]
    .filter(Boolean)
    .join(" ");

  const order = await prisma.order.create({
    data: {
      orderReference: generateOrderReference(),
      applicationId: application.id,
      quoteResultId: application.selectedQuoteResultId,
      agentId: application.quote.agentId,
      channel: application.quote.channel,
      status: "application_completed",
      totalMinorUnits: application.selectedQuoteResult.totalMinorUnits,
      currency: application.selectedQuoteResult.currency,
      customerEmail: application.email,
      customerFullName,
      stateTransitions: {
        create: {
          fromStatus: null,
          toStatus: "application_completed",
          actorType: "system",
        },
      },
    },
  });

  return order;
}
