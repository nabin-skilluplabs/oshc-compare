const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

const quote = await request("/api/v1/quotes", {
  method: "POST",
  body: JSON.stringify({
    adults: 1,
    children: 0,
    policyStartDate: "2026-07-01",
    policyEndDate: "2027-07-01",
  }),
});

const results = await request(`/api/v1/quotes/${quote.data.id}/results`);
if (results.data.length === 0) throw new Error("Expected seeded quote results.");

const application = await request("/api/v1/applications", {
  method: "POST",
  body: JSON.stringify({
    quoteId: quote.data.id,
    selectedQuoteResultId: results.data[0].id,
  }),
});

await request(`/api/v1/applications/${application.data.id}`, {
  method: "PATCH",
  body: JSON.stringify({
    applicant: {
      firstName: "Demo",
      familyName: "Student",
      dateOfBirth: "2000-01-01",
      nationality: "India",
    },
    contact: {
      email: "student@example.com",
      phone: "+61400000001",
      country: "Australia",
    },
    visaStudy: {
      visaType: "Student 500",
      courseName: "Master of IT",
      institutionName: "Demo University",
    },
    consents: [
      { documentType: "privacy_policy", version: "2026-06-01", accepted: true },
      { documentType: "terms", version: "2026-06-01", accepted: true },
    ],
  }),
});

const order = await request("/api/v1/orders", {
  method: "POST",
  body: JSON.stringify({ applicationId: application.data.id }),
});

const paymentSession = await request("/api/v1/payments/sessions", {
  method: "POST",
  body: JSON.stringify({ orderId: order.data.id }),
});

await request("/api/v1/webhooks/payments/demo", {
  method: "POST",
  body: JSON.stringify({
    id: `evt_smoke_${Date.now()}`,
    type: "payment.succeeded",
    paymentId: paymentSession.data.paymentId,
  }),
});

console.log(
  JSON.stringify(
    {
      quoteId: quote.data.id,
      resultCount: results.data.length,
      applicationId: application.data.id,
      orderId: order.data.id,
      paymentId: paymentSession.data.paymentId,
    },
    null,
    2,
  ),
);
