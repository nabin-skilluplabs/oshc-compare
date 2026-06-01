import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { asyncHandler } from "../lib/async-handler.js";
import { issueDemoToken, requireAuth, requireAdminRole } from "../lib/auth.js";
import { validate, uuidSchema } from "../lib/validation.js";
import { prisma } from "../lib/prisma.js";
import { notFound, unauthorized, validationError } from "../lib/errors.js";
import { mapApplication, mapMoney, mapOrder, mapQuote } from "./public.js";
import { sendOrderEmail } from "../services/email-service.js";
import { transitionOrder } from "../services/order-service.js";
import { jsonParse, jsonString } from "../lib/json-field.js";

export const adminRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providerSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["active", "inactive"]),
  logoFileRef: z.string().optional(),
  disclosureUrl: z.string().url().optional(),
  productDisclosureUrl: z.string().url().optional(),
});

const productSchema = z.object({
  providerId: uuidSchema,
  code: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["active", "inactive"]),
  coverTypes: z.array(z.enum(["single", "couple", "single_parent_family", "family"])).min(1),
  disclosureUrl: z.string().url().optional(),
  policyDocumentUrl: z.string().url().optional(),
});

function requireAdmin(req, res, next) {
  return requireAuth("admin")(req, res, next);
}

function mapProvider(provider) {
  return {
    id: provider.id,
    code: provider.code,
    name: provider.name,
    status: provider.status,
    logoUrl: provider.logoFileRef,
    disclosureUrl: provider.disclosureUrl,
    productDisclosureUrl: provider.productDisclosureUrl,
  };
}

function mapProduct(product) {
  return {
    id: product.id,
    providerId: product.providerId,
    code: product.code,
    name: product.name,
    status: product.status,
    coverTypes: product.coverTypes?.map((item) => item.coverType) || [],
    disclosureUrl: product.disclosureUrl,
    policyDocumentUrl: product.policyDocumentUrl,
  };
}

function mapAdminOrderSummary(order) {
  const quoteResult = order.quoteResult;
  const certificate = order.certificates?.[0];
  const payment = order.payments?.[0];
  return {
    id: order.id,
    orderReference: order.orderReference,
    status: order.status,
    customerEmail: order.customerEmail,
    customerName: order.customerFullName,
    providerName: quoteResult ? jsonParse(quoteResult.providerSnapshot, {}).name : undefined,
    productName: quoteResult ? jsonParse(quoteResult.productSnapshot, {}).name : undefined,
    paymentStatus: payment?.status || "created",
    certificateStatus: certificate?.status || "pending",
    total: mapMoney(order.totalMinorUnits, order.currency),
  };
}

async function audit(req, action, entityType, entityId, afterData = undefined) {
  await prisma.auditLog.create({
    data: {
      actorAdminUserId: req.auth?.subject?.id,
      actorType: "admin",
      action,
      entityType,
      entityId,
      afterData: afterData ? jsonString(afterData) : undefined,
    },
  });
}

adminRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const input = validate(loginSchema, req.body);
    const admin = await prisma.adminUser.findUnique({ where: { email: input.email } });
    if (!admin) throw unauthorized("Invalid email or password.");

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      data: {
        accessToken: issueDemoToken("admin", { id: admin.id, email: admin.email, role: admin.role }),
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    });
  }),
);

adminRouter.use(requireAdmin);

adminRouter.get(
  "/providers",
  asyncHandler(async (_req, res) => {
    const providers = await prisma.provider.findMany({ orderBy: { name: "asc" } });
    res.json({ data: providers.map(mapProvider) });
  }),
);

adminRouter.post(
  "/providers",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const input = validate(providerSchema, req.body);
    const provider = await prisma.provider.create({ data: input });
    await audit(req, "provider.create", "provider", provider.id, provider);
    res.status(201).json({ data: mapProvider(provider) });
  }),
);

adminRouter.patch(
  "/providers/:providerId",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const input = validate(providerSchema.partial(), req.body);
    const provider = await prisma.provider.update({
      where: { id: req.params.providerId },
      data: input,
    });
    await audit(req, "provider.update", "provider", provider.id, provider);
    res.json({ data: mapProvider(provider) });
  }),
);

adminRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
      where: req.query.providerId ? { providerId: String(req.query.providerId) } : {},
      include: { coverTypes: true },
      orderBy: { name: "asc" },
    });
    res.json({ data: products.map(mapProduct) });
  }),
);

adminRouter.post(
  "/products",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const input = validate(productSchema, req.body);
    const product = await prisma.product.create({
      data: {
        providerId: input.providerId,
        code: input.code,
        name: input.name,
        status: input.status,
        disclosureUrl: input.disclosureUrl,
        policyDocumentUrl: input.policyDocumentUrl,
        coverTypes: { create: input.coverTypes.map((coverType) => ({ coverType })) },
      },
      include: { coverTypes: true },
    });
    await audit(req, "product.create", "product", product.id, product);
    res.status(201).json({ data: mapProduct(product) });
  }),
);

adminRouter.patch(
  "/products/:productId",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const input = validate(productSchema.partial(), req.body);
    const product = await prisma.product.update({
      where: { id: req.params.productId },
      data: {
        providerId: input.providerId,
        code: input.code,
        name: input.name,
        status: input.status,
        disclosureUrl: input.disclosureUrl,
        policyDocumentUrl: input.policyDocumentUrl,
        ...(input.coverTypes
          ? {
              coverTypes: {
                deleteMany: {},
                create: input.coverTypes.map((coverType) => ({ coverType })),
              },
            }
          : {}),
      },
      include: { coverTypes: true },
    });
    await audit(req, "product.update", "product", product.id, product);
    res.json({ data: mapProduct(product) });
  }),
);

adminRouter.post(
  "/price-imports",
  requireAdminRole("admin", "super_admin"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw validationError([{ field: "file", message: "CSV file is required." }]);
    const providerId = req.body.providerId;
    const provider = await prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider) throw validationError([{ field: "providerId", message: "Provider not found." }]);

    const latest = await prisma.priceTable.findFirst({ where: { providerId }, orderBy: { version: "desc" } });
    const priceTable = await prisma.priceTable.create({
      data: {
        providerId,
        version: latest ? latest.version + 1 : 1,
        status: "validated",
        effectiveFrom: new Date(),
        sourceFileRef: `memory://${req.file.originalname}`,
        importedByAdminUserId: req.auth.subject.id,
        validationSummary: jsonString({
          fileName: req.file.originalname,
          totalRows: req.file.buffer.toString("utf8").trim().split("\n").length - 1,
          validRows: req.file.buffer.toString("utf8").trim().split("\n").length - 1,
          invalidRows: 0,
          errors: [],
        }),
      },
    });
    await audit(req, "price_import.upload", "price_table", priceTable.id, priceTable);
    res.status(201).json({ data: { id: priceTable.id, status: priceTable.status, validationSummary: jsonParse(priceTable.validationSummary, {}) } });
  }),
);

adminRouter.post(
  "/price-imports/:priceImportId/publish",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const priceTable = await prisma.priceTable.update({
      where: { id: req.params.priceImportId },
      data: { status: "published", publishedAt: new Date() },
    });
    await audit(req, "price_import.publish", "price_table", priceTable.id, priceTable);
    res.json({ data: { id: priceTable.id, status: priceTable.status, validationSummary: jsonParse(priceTable.validationSummary, {}) } });
  }),
);

adminRouter.get(
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

adminRouter.get(
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

adminRouter.post(
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

adminRouter.get(
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

adminRouter.get(
  "/reports/quote-funnel",
  asyncHandler(async (_req, res) => {
    const quoteSubmitted = await prisma.quote.count();
    const quoteResultsViewed = await prisma.quoteResult.groupBy({ by: ["quoteId"] }).then((rows) => rows.length);
    res.json({ data: { quoteStarted: quoteSubmitted, quoteSubmitted, quoteResultsViewed } });
  }),
);

adminRouter.get(
  "/reports/conversion",
  asyncHandler(async (_req, res) => {
    const paymentSucceeded = await prisma.payment.count({ where: { status: "succeeded" } });
    const paymentFailed = await prisma.payment.count({ where: { status: "failed" } });
    const applicationSubmitted = await prisma.application.count({ where: { status: "valid" } });
    res.json({
      data: {
        policySelected: applicationSubmitted,
        applicationSubmitted,
        paymentStarted: await prisma.payment.count(),
        paymentSucceeded,
        paymentFailed,
        quoteToPurchaseRate: applicationSubmitted ? paymentSucceeded / applicationSubmitted : 0,
      },
    });
  }),
);
