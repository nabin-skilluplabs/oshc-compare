import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdminRole } from "../../lib/auth.js";
import { notFound, validationError } from "../../lib/errors.js";
import { jsonParse } from "../../lib/json-field.js";
import { prisma } from "../../lib/prisma.js";
import { sendOrderEmail } from "../../services/email-service.js";
import { transitionOrder } from "../../services/order-service.js";
import { mapApplication, mapQuote } from "../public/mappers.js";
import { audit, mapAdminOrderSummary, upload } from "./helpers.js";

export const adminOrderRouter = Router();

adminOrderRouter.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 25);
    const where = {
      ...(req.query.status ? { status: String(req.query.status) } : {}),
      ...(req.query.query
        ? {
            OR: [
              { orderReference: { contains: String(req.query.query) } },
              { customerEmail: { contains: String(req.query.query) } },
              { customerFullName: { contains: String(req.query.query) } },
            ],
          }
        : {}),
    };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { quoteResult: true, payments: true, certificates: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ data: orders.map(mapAdminOrderSummary), pagination: { page, pageSize, total } });
  }),
);

adminOrderRouter.get(
  "/orders/:orderId",
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: {
        quoteResult: true,
        application: { include: { dependants: true, quote: true } },
        payments: true,
        consentRecords: { include: { consentDocument: true } },
        stateTransitions: true,
        certificates: true,
        emailLogs: true,
      },
    });
    if (!order) throw notFound("Order not found.");
    res.json({
      data: {
        order: mapAdminOrderSummary(order),
        quote: mapQuote(order.application.quote),
        application: mapApplication(order.application),
        payments: order.payments,
        consents: order.consentRecords,
        stateTransitions: order.stateTransitions,
        certificates: order.certificates,
        emailLogs: order.emailLogs,
      },
    });
  }),
);

adminOrderRouter.post(
  "/orders/:orderId/certificates",
  requireAdminRole("operations", "admin", "super_admin"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw validationError([{ field: "file", message: "Certificate PDF is required." }]);
    if (!req.body.policyNumber) throw validationError([{ field: "policyNumber", message: "Policy number is required." }]);
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { quoteResult: true },
    });
    if (!order) throw notFound("Order not found.");
    if (!["paid", "certificate_pending", "certificate_issued"].includes(order.status)) {
      throw validationError([{ field: "orderId", message: "Certificate can only be uploaded to a paid order." }]);
    }

    const providerId = jsonParse(order.quoteResult.providerSnapshot, {}).id;
    const certificate = await prisma.certificate.create({
      data: {
        orderId: order.id,
        providerId,
        policyNumber: req.body.policyNumber,
        status: "issued",
        fileRef: `memory://${req.file.originalname}`,
        fileName: req.file.originalname,
        fileSizeBytes: req.file.size,
        issuedAt: new Date(),
        uploadedByAdminUserId: req.auth.subject.id,
      },
    });
    await transitionOrder(order.id, order.status === "paid" ? "certificate_pending" : order.status, { actorType: "admin" }).catch(() => order);
    await transitionOrder(order.id, "certificate_issued", { actorType: "admin", actorAdminUserId: req.auth.subject.id }).catch(() => order);
    await sendOrderEmail({
      orderId: order.id,
      to: order.customerEmail,
      subject: `Your OSHC certificate for ${order.orderReference}`,
      templateKey: "certificate_issued",
      html: `<p>Your OSHC certificate for ${order.orderReference} has been issued.</p>`,
    });
    await prisma.certificate.update({ where: { id: certificate.id }, data: { status: "sent", sentAt: new Date() } });
    await transitionOrder(order.id, "fulfilled", { actorType: "admin", actorAdminUserId: req.auth.subject.id }).catch(() => order);
    await audit(req, "certificate.upload", "certificate", certificate.id, certificate);
    res.status(201).json({
      data: {
        id: certificate.id,
        orderId: certificate.orderId,
        policyNumber: certificate.policyNumber,
        status: "sent",
        downloadUrl: `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/v1/admin/orders/${order.id}/certificates/${certificate.id}`,
        issuedAt: certificate.issuedAt.toISOString(),
        sentAt: new Date().toISOString(),
      },
    });
  }),
);

adminOrderRouter.get(
  "/fulfilment-queue",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 25);
    const orders = await prisma.order.findMany({
      where: { status: { in: ["paid", "provider_submission_pending", "certificate_pending"] } },
      include: { quoteResult: true, payments: true, certificates: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { paidAt: "asc" },
    });
    res.json({
      data: orders.map((order) => {
        const ageHours = order.paidAt ? (Date.now() - order.paidAt.getTime()) / 3_600_000 : 0;
        return { order: mapAdminOrderSummary(order), ageHours, breached: ageHours > 24 };
      }),
      pagination: { page, pageSize, total: orders.length },
    });
  }),
);
