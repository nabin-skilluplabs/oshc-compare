import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { notFound } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { createOrderFromApplication } from "../../services/order-service.js";
import { mapOrder } from "./mappers.js";
import { createOrderSchema } from "./schemas.js";

export const orderRouter = Router();

orderRouter.post(
  "/orders",
  asyncHandler(async (req, res) => {
    const input = validate(createOrderSchema, req.body);
    const order = await createOrderFromApplication(input.applicationId);
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { quoteResult: true },
    });
    res.status(201).json({ data: mapOrder(fullOrder, fullOrder.quoteResult) });
  }),
);

orderRouter.get(
  "/orders/:orderId",
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { quoteResult: true },
    });
    if (!order) throw notFound("Order not found.");
    res.json({ data: mapOrder(order, order.quoteResult) });
  }),
);
