import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { notFound, validationError } from "../../lib/errors.js";
import { jsonString } from "../../lib/json-field.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { sendOrderEmail } from "../../services/email-service.js";
import { transitionOrder } from "../../services/order-service.js";
import { mapMoney } from "./mappers.js";
import { createPaymentSessionSchema } from "./schemas.js";

export const paymentRouter = Router();

paymentRouter.post(
  "/payments/sessions",
  asyncHandler(async (req, res) => {
    const input = validate(createPaymentSessionSchema, req.body);
    const order = await prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order) throw notFound("Order not found.");
    if (order.status === "paid") {
      throw validationError([{ field: "orderId", message: "Order has already been paid." }]);
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        processor: "demo",
        processorPaymentReference: `demo_${order.id}`,
        status: "pending",
        amountMinorUnits: order.totalMinorUnits,
        currency: order.currency,
      },
    });

    if (order.status !== "payment_pending") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "payment_pending" } });
      await prisma.orderStateTransition.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: "payment_pending",
          actorType: "system",
        },
      });
    }

    res.status(201).json({
      data: {
        paymentId: payment.id,
        clientSecret: `demo_client_secret_${payment.id}`,
        amount: mapMoney(payment.amountMinorUnits, payment.currency),
      },
    });
  }),
);

paymentRouter.post(
  "/webhooks/payments/:processor",
  asyncHandler(async (req, res) => {
    const processorEventId = req.body.id || `evt_${Date.now()}`;
    const existing = await prisma.paymentEvent.findUnique({
      where: {
        processor_processorEventId: {
          processor: req.params.processor,
          processorEventId,
        },
      },
    });
    if (existing) return res.json({ received: true });

    const paymentId = req.body.paymentId;
    const payment = paymentId ? await prisma.payment.findUnique({ where: { id: paymentId } }) : null;
    const event = await prisma.paymentEvent.create({
      data: {
        paymentId: payment?.id,
        processor: req.params.processor,
        processorEventId,
        eventType: req.body.type || "payment.succeeded",
        payload: jsonString(req.body),
      },
    });

    if (payment && (req.body.type || "payment.succeeded") === "payment.succeeded") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "succeeded", succeededAt: new Date() },
      });
      const order = await transitionOrder(payment.orderId, "paid", {
        actorType: "payment_webhook",
        metadata: { processorEventId },
      });
      await sendOrderEmail({
        orderId: order.id,
        to: order.customerEmail,
        subject: `Payment received for ${order.orderReference}`,
        templateKey: "payment_confirmation",
        html: `<p>Payment received for order ${order.orderReference}.</p>`,
      });
    }

    await prisma.paymentEvent.update({
      where: { id: event.id },
      data: { processedAt: new Date() },
    });

    res.json({ received: true });
  }),
);
