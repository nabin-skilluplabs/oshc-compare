import { toDateOnly } from "../../lib/validation.js";
import { jsonParse } from "../../lib/json-field.js";

export function mapQuote(quote) {
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

export function mapMoney(amountMinorUnits, currency = "AUD") {
  return { amountMinorUnits, currency };
}

export function mapQuoteResult(result) {
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

export function mapApplication(application) {
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

export function mapOrder(order, quoteResult) {
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
