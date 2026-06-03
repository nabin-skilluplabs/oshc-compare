import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { notFound, validationError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { mapApplication } from "./mappers.js";
import { createApplicationSchema, updateApplicationSchema } from "./schemas.js";

export const applicationRouter = Router();

applicationRouter.post(
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

applicationRouter.get(
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

applicationRouter.patch(
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
        applicantDateOfBirth: input.applicant?.dateOfBirth
          ? new Date(`${input.applicant.dateOfBirth}T00:00:00.000Z`)
          : undefined,
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
        courseStartDate: input.visaStudy?.courseStartDate
          ? new Date(`${input.visaStudy.courseStartDate}T00:00:00.000Z`)
          : undefined,
        courseEndDate: input.visaStudy?.courseEndDate
          ? new Date(`${input.visaStudy.courseEndDate}T00:00:00.000Z`)
          : undefined,
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
