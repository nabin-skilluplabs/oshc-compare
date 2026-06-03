import multer from "multer";
import { requireAuth } from "../../lib/auth.js";
import { jsonParse, jsonString } from "../../lib/json-field.js";
import { prisma } from "../../lib/prisma.js";
import { mapMoney } from "../public/mappers.js";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export function requireAdmin(req, res, next) {
  return requireAuth("admin")(req, res, next);
}

export function mapProvider(provider) {
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

export function mapProduct(product) {
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

export function mapAdminOrderSummary(order) {
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

export async function audit(req, action, entityType, entityId, afterData = undefined) {
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
