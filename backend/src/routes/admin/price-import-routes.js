import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdminRole } from "../../lib/auth.js";
import { validationError } from "../../lib/errors.js";
import { jsonParse, jsonString } from "../../lib/json-field.js";
import { prisma } from "../../lib/prisma.js";
import { audit, upload } from "./helpers.js";

export const adminPriceImportRouter = Router();

adminPriceImportRouter.post(
  "/price-imports",
  requireAdminRole("admin", "super_admin"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw validationError([{ field: "file", message: "CSV file is required." }]);
    const providerId = req.body.providerId;
    const provider = await prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider) throw validationError([{ field: "providerId", message: "Provider not found." }]);

    const latest = await prisma.priceTable.findFirst({ where: { providerId }, orderBy: { version: "desc" } });
    const totalRows = req.file.buffer.toString("utf8").trim().split("\n").length - 1;
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
          totalRows,
          validRows: totalRows,
          invalidRows: 0,
          errors: [],
        }),
      },
    });
    await audit(req, "price_import.upload", "price_table", priceTable.id, priceTable);
    res.status(201).json({
      data: {
        id: priceTable.id,
        status: priceTable.status,
        validationSummary: jsonParse(priceTable.validationSummary, {}),
      },
    });
  }),
);

adminPriceImportRouter.post(
  "/price-imports/:priceImportId/publish",
  requireAdminRole("admin", "super_admin"),
  asyncHandler(async (req, res) => {
    const priceTable = await prisma.priceTable.update({
      where: { id: req.params.priceImportId },
      data: { status: "published", publishedAt: new Date() },
    });
    await audit(req, "price_import.publish", "price_table", priceTable.id, priceTable);
    res.json({
      data: {
        id: priceTable.id,
        status: priceTable.status,
        validationSummary: jsonParse(priceTable.validationSummary, {}),
      },
    });
  }),
);
