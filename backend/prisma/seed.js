import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function json(value) {
  return JSON.stringify(value);
}

const coverTypes = ["single", "couple", "single_parent_family", "family"];

async function upsertProviderWithProduct({ provider, product, prices }) {
  const savedProvider = await prisma.provider.upsert({
    where: { code: provider.code },
    update: provider,
    create: provider,
  });

  const savedProduct = await prisma.product.upsert({
    where: {
      providerId_code: {
        providerId: savedProvider.id,
        code: product.code,
      },
    },
    update: {
      ...product,
      providerId: savedProvider.id,
    },
    create: {
      ...product,
      providerId: savedProvider.id,
      coverTypes: {
        create: coverTypes.map((coverType) => ({ coverType })),
      },
    },
  });

  for (const coverType of coverTypes) {
    await prisma.productCoverType.upsert({
      where: {
        productId_coverType: {
          productId: savedProduct.id,
          coverType,
        },
      },
      update: {},
      create: {
        productId: savedProduct.id,
        coverType,
      },
    });
  }

  const latestVersion = await prisma.priceTable.findFirst({
    where: { providerId: savedProvider.id },
    orderBy: { version: "desc" },
  });

  const priceTable = await prisma.priceTable.create({
    data: {
      providerId: savedProvider.id,
      version: latestVersion ? latestVersion.version + 1 : 1,
      status: "published",
      effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
      validationSummary: json({ seeded: true, rows: prices.length }),
      publishedAt: new Date(),
    },
  });

  await prisma.priceRow.createMany({
    data: prices.map((price) => ({
      priceTableId: priceTable.id,
      productId: savedProduct.id,
      coverType: price.coverType,
      durationDaysMin: 1,
      durationDaysMax: 730,
      premiumMinorUnits: price.premiumMinorUnits,
      feeMinorUnits: 0,
      currency: "AUD",
      channel: null,
    })),
  });

  return { provider: savedProvider, product: savedProduct };
}

async function main() {
  await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      fullName: "Demo Admin",
      role: "super_admin",
      passwordHash: "demo-password-not-for-production",
    },
  });

  await prisma.agent.upsert({
    where: { email: "agent@example.com" },
    update: { status: "approved", approvedAt: new Date() },
    create: {
      agencyName: "Demo Education Agency",
      fullName: "Demo Agent",
      email: "agent@example.com",
      phone: "+61 400 000 000",
      status: "approved",
      approvedAt: new Date(),
    },
  });

  await upsertProviderWithProduct({
    provider: {
      code: "BUPA",
      name: "Bupa OSHC",
      status: "active",
      websiteUrl: "https://www.bupa.com.au",
      disclosureUrl: "https://example.com/bupa-disclosure",
      productDisclosureUrl: "https://example.com/bupa-pds",
      supportMetadata: json({ certificateDeliveryNote: "Usually issued within 15 minutes." }),
    },
    product: {
      code: "BUPA-STANDARD",
      name: "Bupa Standard OSHC",
      status: "active",
      fulfilmentMode: "manual",
      disclosureUrl: "https://example.com/bupa-disclosure",
      policyDocumentUrl: "https://example.com/bupa-pds",
      keyInclusions: json(["Hospital cover", "Medical services", "Prescription benefits"]),
      metadata: json({}),
    },
    prices: [
      { coverType: "single", premiumMinorUnits: 43800 },
      { coverType: "couple", premiumMinorUnits: 159000 },
      { coverType: "single_parent_family", premiumMinorUnits: 118000 },
      { coverType: "family", premiumMinorUnits: 222000 },
    ],
  });

  await upsertProviderWithProduct({
    provider: {
      code: "MEDIBANK",
      name: "Medibank OSHC",
      status: "active",
      websiteUrl: "https://www.medibank.com.au",
      disclosureUrl: "https://example.com/medibank-disclosure",
      productDisclosureUrl: "https://example.com/medibank-pds",
      supportMetadata: json({ certificateDeliveryNote: "Certificate issued after payment confirmation." }),
    },
    product: {
      code: "MEDIBANK-COMPLETE",
      name: "Medibank Complete OSHC",
      status: "active",
      fulfilmentMode: "manual",
      disclosureUrl: "https://example.com/medibank-disclosure",
      policyDocumentUrl: "https://example.com/medibank-pds",
      keyInclusions: json(["Doctor visits", "Hospital treatment", "Emergency ambulance"]),
      metadata: json({}),
    },
    prices: [
      { coverType: "single", premiumMinorUnits: 46200 },
      { coverType: "couple", premiumMinorUnits: 162500 },
      { coverType: "single_parent_family", premiumMinorUnits: 121500 },
      { coverType: "family", premiumMinorUnits: 228000 },
    ],
  });

  await upsertProviderWithProduct({
    provider: {
      code: "AHM",
      name: "ahm OSHC",
      status: "active",
      websiteUrl: "https://ahmoshc.com.au",
      disclosureUrl: "https://example.com/ahm-disclosure",
      productDisclosureUrl: "https://example.com/ahm-pds",
      supportMetadata: json({ certificateDeliveryNote: "Usually issued same day." }),
    },
    product: {
      code: "AHM-BASIC",
      name: "ahm Basic OSHC",
      status: "active",
      fulfilmentMode: "manual",
      disclosureUrl: "https://example.com/ahm-disclosure",
      policyDocumentUrl: "https://example.com/ahm-pds",
      keyInclusions: json(["Medical cover", "Hospital cover", "Emergency ambulance"]),
      metadata: json({}),
    },
    prices: [
      { coverType: "single", premiumMinorUnits: 42100 },
      { coverType: "couple", premiumMinorUnits: 155000 },
      { coverType: "single_parent_family", premiumMinorUnits: 115000 },
      { coverType: "family", premiumMinorUnits: 214000 },
    ],
  });

  for (const document of [
    ["privacy_policy", "Privacy Policy", "https://example.com/privacy"],
    ["terms", "Terms and Conditions", "https://example.com/terms"],
    ["refund_policy", "Refund Policy", "https://example.com/refund"],
    ["provider_disclosure", "Provider Disclosure", "https://example.com/disclosure"],
  ]) {
    await prisma.consentDocument.upsert({
      where: {
        documentType_version: {
          documentType: document[0],
          version: "2026-06-01",
        },
      },
      update: { isActive: true },
      create: {
        documentType: document[0],
        title: document[1],
        version: "2026-06-01",
        url: document[2],
        isActive: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed data created.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
