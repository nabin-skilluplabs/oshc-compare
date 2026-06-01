import { prisma } from "../lib/prisma.js";
import { notFound } from "../lib/errors.js";
import { jsonParse, jsonString } from "../lib/json-field.js";

export async function getOrCreateQuoteResults(quoteId) {
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) throw notFound("Quote not found.");

  const existing = await prisma.quoteResult.findMany({
    where: { quoteId },
    orderBy: { totalMinorUnits: "asc" },
  });
  if (existing.length > 0) {
    return { quote, results: existing };
  }

  const rows = await prisma.priceRow.findMany({
    where: {
      coverType: quote.coverType,
      durationDaysMin: { lte: quote.calculatedDurationDays },
      durationDaysMax: { gte: quote.calculatedDurationDays },
      priceTable: {
        status: "published",
        effectiveFrom: { lte: quote.policyStartDate },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: quote.policyStartDate } }],
      },
      product: {
        status: "active",
        provider: { status: "active" },
        coverTypes: { some: { coverType: quote.coverType } },
      },
    },
    include: {
      product: {
        include: {
          provider: true,
        },
      },
    },
  });

  const created = await Promise.all(
    rows.map((row) => {
      const supportMetadata = jsonParse(row.product.provider.supportMetadata, {});
      const keyInclusions = jsonParse(row.product.keyInclusions, []);
      return prisma.quoteResult.create({
        data: {
          quoteId,
          productId: row.productId,
          providerSnapshot: jsonString({
            id: row.product.provider.id,
            code: row.product.provider.code,
            name: row.product.provider.name,
            logoUrl: row.product.provider.logoFileRef,
            certificateDeliveryNote:
              supportMetadata.certificateDeliveryNote || "Certificate issued after payment confirmation.",
          }),
          productSnapshot: jsonString({
            id: row.product.id,
            code: row.product.code,
            name: row.product.name,
            keyInclusions,
            disclosureUrl: row.product.disclosureUrl,
            policyDocumentUrl: row.product.policyDocumentUrl,
          }),
          coverType: quote.coverType,
          premiumMinorUnits: row.premiumMinorUnits,
          feeMinorUnits: row.feeMinorUnits,
          totalMinorUnits: row.premiumMinorUnits + row.feeMinorUnits,
          currency: row.currency,
          disclosureSnapshot: jsonString({
            providerDisclosureUrl: row.product.provider.disclosureUrl,
            productDisclosureUrl: row.product.provider.productDisclosureUrl,
          }),
          expiresAt: quote.expiresAt,
        },
      });
    }),
  );

  return {
    quote,
    results: created.sort((a, b) => a.totalMinorUnits - b.totalMinorUnits),
  };
}
