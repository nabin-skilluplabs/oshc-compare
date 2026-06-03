import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdminRole } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { audit, mapProduct, mapProvider } from "./helpers.js";
import { productSchema, providerSchema } from "./schemas.js";

export const adminCatalogRouter = Router();

adminCatalogRouter.get(
  "/providers",
  asyncHandler(async (_req, res) => {
    const providers = await prisma.provider.findMany({ orderBy: { name: "asc" } });
    res.json({ data: providers.map(mapProvider) });
  }),
);

adminCatalogRouter.post(
  "/providers",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const input = validate(providerSchema, req.body);
    const provider = await prisma.provider.create({ data: input });
    await audit(req, "provider.create", "provider", provider.id, provider);
    res.status(201).json({ data: mapProvider(provider) });
  }),
);

adminCatalogRouter.patch(
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

adminCatalogRouter.get(
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

adminCatalogRouter.post(
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

adminCatalogRouter.patch(
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
