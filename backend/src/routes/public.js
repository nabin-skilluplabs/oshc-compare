import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async-handler.js";
import { validate, uuidSchema, dateStringSchema, toDateOnly } from "../lib/validation.js";
import { prisma } from "../lib/prisma.js";
import { createQuote, getQuoteOrThrow } from "../services/quote-service.js";
import { getOrCreateQuoteResults } from "../services/pricing-service.js";
import { createOrderFromApplication, transitionOrder } from "../services/order-service.js";
import { sendOrderEmail } from "../services/email-service.js";
import { notFound, validationError } from "../lib/errors.js";
import { jsonParse, jsonString } from "../lib/json-field.js";

export const publicRouter = Router();

const quoteSchema = z.object({
  adults: z.number().int().refine((value) => [1, 2].includes(value), "Adults must be 1 or 2."),
  children: z.number().int().min(0).max(10),
  policyStartDate: dateStringSchema,
  policyEndDate: dateStringSchema,
  sessionId: z.string().optional(),
});

const createApplicationSchema = z.object({
  quoteId: uuidSchema,
  selectedQuoteResultId: uuidSchema,
});

const updateApplicationSchema = z.object({
  applicant: z
    .object({
      firstName: z.string().min(1).optional(),
      familyName: z.string().min(1).optional(),
      dateOfBirth: dateStringSchema.optional(),
      gender: z.string().optional(),
      nationality: z.string().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      stateRegion: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  visaStudy: z
    .object({
      visaType: z.string().optional(),
      courseName: z.string().optional(),
      institutionName: z.string().optional(),
      studentId: z.string().optional(),
      courseStartDate: dateStringSchema.optional(),
      courseEndDate: dateStringSchema.optional(),
    })
    .optional(),
  dependants: z
    .array(
      z.object({
        dependantType: z.enum(["adult", "child"]).default("child"),
        firstName: z.string().min(1),
        familyName: z.string().min(1),
        dateOfBirth: dateStringSchema,
        gender: z.string().optional(),
        nationality: z.string().optional(),
        relationshipToApplicant: z.string().optional(),
      }),
    )
    .optional(),
  consents: z
    .array(
      z.object({
        documentType: z.string(),
        version: z.string(),
        accepted: z.boolean(),
      }),
    )
    .optional(),
});

const createOrderSchema = z.object({
  applicationId: uuidSchema,
});

const createPaymentSessionSchema = z.object({
  orderId: uuidSchema,
});

function mapQuote(quote) {
  return {
    id: quote.id,
    adults: quote.adults,
    children: quote.children,
    policyStartDate: toDateOnly(quote.policyStartDate),
    policyEndDate: toDateOnly(quote.policyEndDate),
    calculatedDurationDays: quote.calculatedDurationDays,
    coverType: quote.coverType,
    channel: quote.channel,
    agentId: quote.agentId,
    expiresAt: quote.expiresAt.toISOString(),
  };
}

function mapMoney(amountMinorUnits, currency = "AUD") {
  return { amountMinorUnits, currency };
}

function mapQuoteResult(result) {
  const provider = jsonParse(result.providerSnapshot, {});
  const product = jsonParse(result.productSnapshot, {});
  return {
    id: result.id,
    quoteId: result.quoteId,
    provider,
    product,
    coverType: result.coverType,
    premium: mapMoney(result.premiumMinorUnits, result.currency),
    fees: mapMoney(result.feeMinorUnits, result.currency),
    total: mapMoney(result.totalMinorUnits, result.currency),
    certificateDeliveryNote:
      provider.certificateDeliveryNote || "Certificate issued after payment confirmation.",
    expiresAt: result.expiresAt.toISOString(),
  };
}

function mapApplication(application) {
  return {
    id: application.id,
    quoteId: application.quoteId,
    selectedQuoteResultId: application.selectedQuoteResultId,
    status: application.status,
    applicant: {
      firstName: application.applicantFirstName,
      familyName: application.applicantFamilyName,
      dateOfBirth: application.applicantDateOfBirth ? toDateOnly(application.applicantDateOfBirth) : null,
      gender: application.applicantGender,
      nationality: application.applicantNationality,
    },
    contact: {
      email: application.email,
      phone: application.phone,
      addressLine1: application.addressLine1,
      addressLine2: application.addressLine2,
      city: application.city,
      stateRegion: application.stateRegion,
      postalCode: application.postalCode,
      country: application.country,
    },
    visaStudy: {
      visaType: application.visaType,
      courseName: application.courseName,
      institutionName: application.institutionName,
      studentId: application.studentId,
      courseStartDate: application.courseStartDate ? toDateOnly(application.courseStartDate) : null,
      courseEndDate: application.courseEndDate ? toDateOnly(application.courseEndDate) : null,
    },
    dependants: (application.dependants || []).map((dependant) => ({
      id: dependant.id,
      dependantType: dependant.dependantType,
      firstName: dependant.firstName,
      familyName: dependant.familyName,
      dateOfBirth: toDateOnly(dependant.dateOfBirth),
      gender: dependant.gender,
      nationality: dependant.nationality,
      relationshipToApplicant: dependant.relationshipToApplicant,
    })),
  };
}

function mapOrder(order, quoteResult) {
  return {
    id: order.id,
    orderReference: order.orderReference,
    status: order.status,
    total: mapMoney(order.totalMinorUnits, order.currency),
    customerEmail: order.customerEmail,
    providerName: quoteResult ? jsonParse(quoteResult.providerSnapshot, {}).name : undefined,
    productName: quoteResult ? jsonParse(quoteResult.productSnapshot, {}).name : undefined,
    paidAt: order.paidAt?.toISOString() || null,
  };
}

publicRouter.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    const input = validate(quoteSchema, req.body);
    const quote = await createQuote(input);
    res.status(201).json({ data: mapQuote(quote) });
  }),
);

publicRouter.get(
  "/quotes/:quoteId",
  asyncHandler(async (req, res) => {
    const quote = await getQuoteOrThrow(req.params.quoteId);
    res.json({ data: mapQuote(quote) });
  }),
);

publicRouter.get(
  "/quotes/:quoteId/results",
  asyncHandler(async (req, res) => {
    const { quote, results } = await getOrCreateQuoteResults(req.params.quoteId);
    const mapped = results.map(mapQuoteResult);
    if (req.query.sort === "provider_name_asc") {
      mapped.sort((a, b) => a.provider.name.localeCompare(b.provider.name));
    } else {
      mapped.sort((a, b) => a.total.amountMinorUnits - b.total.amountMinorUnits);
    }
    res.json({ quote: mapQuote(quote), data: mapped });
  }),
);

publicRouter.post(
  "/applications",
  asyncHandler(async (req, res) => {
    const input = validate(createApplicationSchema, req.body);
    const quoteResult = await prisma.quoteResult.findUnique({
      where: { id: input.selectedQuoteResultId },
      include: { quote: true },
    });
    if (!quoteResult || quoteResult.quoteId !== input.quoteId) {
      throw validationError([{ field: "selectedQuoteResultId", message: "Selected quote result is invalid." }]);
    }

    const application = await prisma.application.create({
      data: {
        quoteId: input.quoteId,
        selectedQuoteResultId: input.selectedQuoteResultId,
        status: "draft",
      },
      include: { dependants: true },
    });

    res.status(201).json({ data: mapApplication(application) });
  }),
);

publicRouter.get(
  "/applications/:applicationId",
  asyncHandler(async (req, res) => {
    const application = await prisma.application.findUnique({
      where: { id: req.params.applicationId },
      include: { dependants: true },
    });
    if (!application) throw notFound("Application not found.");
    res.json({ data: mapApplication(application) });
  }),
);

publicRouter.patch(
  "/applications/:applicationId",
  asyncHandler(async (req, res) => {
    const input = validate(updateApplicationSchema, req.body);
    const existing = await prisma.application.findUnique({
      where: { id: req.params.applicationId },
      include: { quote: true },
    });
    if (!existing) throw notFound("Application not found.");

    await prisma.applicationDependant.deleteMany({ where: { applicationId: existing.id } });

    const application = await prisma.application.update({
      where: { id: existing.id },
      data: {
        status: "valid",
        applicantFirstName: input.applicant?.firstName,
        applicantFamilyName: input.applicant?.familyName,
        applicantDateOfBirth: input.applicant?.dateOfBirth ? new Date(`${input.applicant.dateOfBirth}T00:00:00.000Z`) : undefined,
        applicantGender: input.applicant?.gender,
        applicantNationality: input.applicant?.nationality,
        email: input.contact?.email,
        phone: input.contact?.phone,
        addressLine1: input.contact?.addressLine1,
        addressLine2: input.contact?.addressLine2,
        city: input.contact?.city,
        stateRegion: input.contact?.stateRegion,
        postalCode: input.contact?.postalCode,
        country: input.contact?.country,
        visaType: input.visaStudy?.visaType,
        courseName: input.visaStudy?.courseName,
        institutionName: input.visaStudy?.institutionName,
        studentId: input.visaStudy?.studentId,
        courseStartDate: input.visaStudy?.courseStartDate ? new Date(`${input.visaStudy.courseStartDate}T00:00:00.000Z`) : undefined,
        courseEndDate: input.visaStudy?.courseEndDate ? new Date(`${input.visaStudy.courseEndDate}T00:00:00.000Z`) : undefined,
        dependants: input.dependants
          ? {
              create: input.dependants.map((dependant) => ({
                ...dependant,
                dateOfBirth: new Date(`${dependant.dateOfBirth}T00:00:00.000Z`),
              })),
            }
          : undefined,
      },
      include: { dependants: true },
    });

    if (input.consents) {
      for (const consent of input.consents.filter((item) => item.accepted)) {
        const document = await prisma.consentDocument.findUnique({
          where: {
            documentType_version: {
              documentType: consent.documentType,
              version: consent.version,
            },
          },
        });
        if (document) {
          await prisma.consentRecord.create({
            data: {
              applicationId: application.id,
              consentDocumentId: document.id,
              acceptedByEmail: application.email,
              ipAddress: req.ip,
              userAgent: req.headers["user-agent"],
            },
          });
        }
      }
    }

    res.json({ data: mapApplication(application) });
  }),
);

publicRouter.post(
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

publicRouter.get(
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

publicRouter.post(
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

publicRouter.post(
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

export { mapQuote, mapQuoteResult, mapApplication, mapOrder, mapMoney };
