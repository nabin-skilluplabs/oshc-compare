# Product Requirements Document: OSHC Comparison and Purchase Platform

## 1. Document Control

| Field | Value |
| --- | --- |
| Product | OSHC comparison, purchase, and certificate delivery platform |
| Source document | `docs/BRD_OSHC_Comparison_Platform.md` |
| Prepared on | 2026-06-01 |
| Document type | Product Requirements Document |
| Status | Draft |

## 2. Product Summary

The product is a web platform that helps international students and education agents compare Overseas Student Health Cover (OSHC) policies, select a compliant policy, complete payment, and receive a policy certificate digitally.

The first release will focus on a reliable quote-to-certificate flow using imported provider price tables, secure card payment, operational fulfilment tools, and basic agent tracking. Later releases will add deeper provider automation, multilingual experiences, customer self-service, and advanced agent commission workflows.

## 3. Product Goals

- Let students generate an OSHC quote from household composition and policy dates.
- Let students compare eligible provider policies clearly and confidently.
- Let students complete purchase and payment without needing manual assistance.
- Let operations fulfil certificates and handle exceptions efficiently.
- Let agents create quote links and track student purchase outcomes.
- Give administrators control over providers, price tables, orders, certificates, refunds, and reporting.

## 4. Non-Goals

- The product will not process insurance claims.
- The product will not provide medical advice.
- The product will not replace provider policy documents or legal disclosures.
- The first release will not include native mobile apps.
- The first release will not support non-OSHC insurance products.
- The first release will not implement a full CRM beyond quote, order, support, and agent tracking.

## 5. Target Users

### 5.1 Student Buyer

Needs to compare approved OSHC policies, understand price differences, complete a compliant purchase, and receive a certificate for visa purposes.

### 5.2 Family or Dependant Buyer

Needs to enter adults and children accurately, understand whether the purchase is single, couple, single-parent family, or family cover, and avoid buying the wrong policy type.

### 5.3 Education Agent

Needs to create quotes for students, send a student-completion link, track order status, and later see commission-related performance.

### 5.4 Operations User

Needs to monitor paid orders, provider submission outcomes, certificate status, refund requests, failed payments, and support escalations.

### 5.5 Administrator

Needs to configure provider availability, products, prices, disclosures, agent accounts, admin access, and reporting.

## 6. Product Principles

- Make the quote journey fast and easy for users who may not understand Australian health insurance.
- Keep policy comparison factual and disclosure-led.
- Avoid making unsupported recommendations before legal and compliance approval.
- Treat payment, identity, certificate, and dependant data as sensitive.
- Prefer automated fulfilment, but provide strong operational fallbacks.
- Make every externally dependent workflow observable and recoverable.

## 7. Key User Journeys

### 7.1 Student Quote to Purchase

1. Student opens the landing page.
2. Student enters adults, children, policy start date, and policy end date.
3. Student submits the quote form.
4. System validates input and determines cover type.
5. System returns eligible policy options.
6. Student sorts, filters, and reviews policies.
7. Student selects a policy.
8. Student enters applicant, dependant, contact, visa, and education details.
9. Student reviews terms, disclosures, and total payable amount.
10. Student pays by card.
11. System creates a paid order and triggers fulfilment.
12. Student receives payment confirmation.
13. Student receives certificate when issued.

### 7.2 Agent-Assisted Quote

1. Agent signs in.
2. Agent creates a quote with student household and date details.
3. System generates a tracked quote link.
4. Agent sends the link to the student.
5. Student completes policy selection, application, and payment.
6. Agent sees order status and certificate availability where permissions allow.
7. System records attribution for reporting and commissions.

### 7.3 Operations Certificate Fulfilment

1. Operations user opens the fulfilment queue.
2. User sees paid orders awaiting provider submission or certificate upload.
3. User submits provider application manually or reviews automated submission status.
4. User records provider policy number.
5. User uploads certificate or verifies automatically retrieved certificate.
6. System sends certificate email to customer.
7. Order status changes to fulfilled.

### 7.4 Admin Price Table Update

1. Admin opens provider pricing management.
2. Admin selects provider and product.
3. Admin uploads a price table file.
4. System validates format, required fields, effective dates, cover types, and price values.
5. Admin reviews validation summary.
6. Admin publishes the price table.
7. New quotes use the updated pricing from the effective date.

## 8. Release Scope

### 8.1 MVP

- Public landing page.
- Quote form.
- Quote validation and cover type calculation.
- Price table-based quote results.
- Policy results list with basic sorting.
- Policy detail and disclosure links.
- Checkout application form.
- Card payment.
- Order state machine.
- Admin provider and price management.
- Admin order and certificate management.
- Manual certificate upload and customer email.
- Basic agent account and tracked quote links.
- Core analytics events.

### 8.2 Post-MVP

- Provider API pricing.
- Provider API purchase submission.
- Automatic certificate retrieval.
- Customer magic-link order lookup.
- Date correction, refund, and cancellation self-service.
- Multilingual UI and content.
- CMS-managed blog, FAQ, provider, and visa content.
- Agent commission ledger and payout reporting.
- Helpdesk and live chat integration.
- Advanced comparison and recommendation features.

## 9. Feature Requirements

### 9.1 Public Landing Page

**Purpose:** Convert visitors into quote starters and communicate the platform value proposition.

**Requirements:**

- Display clear headline and supporting copy about comparing OSHC policies.
- Include the quote form in the first viewport on desktop and mobile.
- Display trust markers such as secure checkout, provider comparison, support availability, and certificate delivery expectations.
- Include navigation to FAQ, provider pages, contact, privacy, terms, and agent information.
- Support responsive layouts for mobile, tablet, and desktop.

**Acceptance Criteria:**

- A first-time visitor can identify the product purpose within 5 seconds.
- The quote form is visible without scrolling on common desktop viewports.
- The quote form appears before long-form content on mobile.
- Legal pages and support contact are reachable from the page footer.

### 9.2 Quote Form

**Purpose:** Capture minimum information needed to generate eligible OSHC policy options.

**Inputs:**

- Adults: `1` or `2`.
- Children: `0` to `10`.
- Policy start date.
- Policy end date.

**Validation Rules:**

- Adults is required.
- Children is required.
- Start date is required.
- End date is required.
- End date must be after start date.
- Start date cannot be earlier than the configured minimum purchasable date.
- Date range must meet provider-supported minimum and maximum durations.

**Acceptance Criteria:**

- Users cannot submit the form with missing or invalid fields.
- Inline error messages explain how to fix each invalid field.
- Successful submission creates a quote record.
- Successful submission navigates to results.

### 9.3 Cover Type Calculation

**Purpose:** Map household composition to provider-compatible cover types.

**Rules:**

| Adults | Children | Cover type |
| --- | ---: | --- |
| 1 | 0 | Single |
| 2 | 0 | Couple |
| 1 | 1 or more | Single-parent family |
| 2 | 1 or more | Family |

**Acceptance Criteria:**

- The system assigns exactly one cover type for each valid quote.
- The assigned cover type is stored with the quote.
- Results only include products available for that cover type.

### 9.4 Pricing Engine

**Purpose:** Return eligible policy prices from enabled providers.

**Requirements:**

- Use active price tables for MVP.
- Support provider, product, cover type, start date, end date, policy duration, effective date, and channel availability.
- Exclude inactive providers and products.
- Exclude products without a valid price for the quote inputs.
- Store price result snapshots to preserve the customer-facing quote.
- Set quote expiry based on configurable business rules.

**Acceptance Criteria:**

- For a valid quote, the engine returns all matching active products with prices.
- Ineligible products are not shown.
- A quote result includes provider, product, cover type, duration, premium, fees if applicable, total price, and expiry timestamp.
- The platform can explain why no products are available.

### 9.5 Results and Comparison

**Purpose:** Help users choose a policy from eligible options.

**Requirements:**

- Show provider logo/name, product name, total price, cover type, certificate delivery note, and key inclusions.
- Provide sorting by lowest price and provider name in MVP.
- Preserve quote inputs on the results page.
- Allow users to edit quote inputs and re-run results.
- Link to provider policy documents and disclosures.
- Show a clear call to action for selecting a policy.

**Post-MVP Requirements:**

- Sort by recommended, fastest certificate delivery, and benefit strength.
- Filter by provider and key benefit.
- Compare selected policies side by side.

**Acceptance Criteria:**

- Results are readable on mobile without horizontal scrolling.
- Selecting a policy creates or updates the application draft.
- Provider disclosure links are visible before checkout.
- If no results are available, the page gives recovery guidance.

### 9.6 Application Form

**Purpose:** Collect the data required to purchase and issue a policy.

**Sections:**

- Primary applicant details.
- Contact details.
- Visa and study details.
- Dependant details, when applicable.
- Policy confirmation.
- Terms and disclosures.

**Primary Applicant Fields:**

- Legal first name.
- Legal family name.
- Date of birth.
- Email.
- Phone.
- Nationality.
- Gender, if required by provider.
- Australian or overseas address, as required by provider.

**Visa and Study Fields:**

- Visa type or intended visa type.
- Course or program name.
- Institution name.
- Student ID, if available or required.
- Course start date, if required.
- Course end date, if required.

**Acceptance Criteria:**

- Required fields are provider-aware where product requirements differ.
- The user can save progress implicitly during checkout.
- Form validation prevents payment when required application fields are incomplete.
- Dependant fields appear only when the selected cover type requires them.

### 9.7 Checkout and Payment

**Purpose:** Securely collect payment and create a fulfilment-ready order.

**Requirements:**

- Create an order before payment attempt.
- Integrate with a PCI-compliant payment gateway.
- Support card payment in MVP.
- Handle payment success, failure, cancellation, and webhook retry.
- Prevent duplicate order fulfilment from duplicate webhook events.
- Display final amount before payment.
- Send payment confirmation email after successful payment.

**Acceptance Criteria:**

- Successful payment changes order status to `paid`.
- Failed payment keeps order in `payment_failed` or equivalent recoverable state.
- Duplicate webhook delivery does not create duplicate orders or provider submissions.
- Customer receives a payment confirmation email within 5 minutes of successful payment.

### 9.8 Order State Machine

**Purpose:** Provide reliable tracking from quote through certificate delivery.

**Core States:**

- `quote_created`
- `application_started`
- `application_completed`
- `payment_pending`
- `payment_failed`
- `paid`
- `provider_submission_pending`
- `provider_submission_failed`
- `certificate_pending`
- `certificate_issued`
- `fulfilled`
- `refund_requested`
- `refunded`
- `cancelled`

**Acceptance Criteria:**

- Every order has exactly one current state.
- State transitions are timestamped.
- Invalid state transitions are rejected.
- Admin users can view order state history.

### 9.9 Certificate Fulfilment

**Purpose:** Ensure customers receive policy certificates after purchase.

**MVP Requirements:**

- Admin can upload certificate PDF to a paid order.
- Admin can enter provider policy number.
- Admin can mark certificate as issued.
- System sends certificate email with secure download access.
- Certificate file is stored securely.

**Post-MVP Requirements:**

- Provider API can return policy number and certificate.
- System can retry certificate retrieval.
- Customer can download certificate from order lookup.

**Acceptance Criteria:**

- Certificate cannot be attached to an unpaid order.
- Customer receives certificate email after the certificate is issued.
- Certificate access links are secure and expire or require authentication.
- Operations can identify orders breaching fulfilment SLA.

### 9.10 Customer Order Lookup

**Purpose:** Let customers retrieve order status and documents without creating a password account.

**Release:** Post-MVP unless capacity allows.

**Requirements:**

- Customer enters email and order reference.
- System sends magic link to verified email.
- Customer can view order status, policy details, receipt, and certificate.
- Customer can request certificate resend, date correction, cancellation, or refund.

**Acceptance Criteria:**

- Order data is not exposed before email verification.
- Magic links expire.
- A customer cannot retrieve another customer's order.

### 9.11 Agent Portal

**Purpose:** Support education agents as a sales and support channel.

**MVP Requirements:**

- Agent can sign in.
- Agent can create a quote.
- Agent can generate a tracked quote link.
- Agent can view quotes and resulting order statuses.
- Admin can approve, suspend, and edit agent profiles.

**Post-MVP Requirements:**

- Agent dashboard for conversion metrics.
- Commission estimate and ledger.
- Certificate access subject to permissions and consent.
- Agency-level account hierarchy.

**Acceptance Criteria:**

- Quotes created by an agent are attributed to that agent.
- Tracked links preserve attribution through purchase.
- Suspended agents cannot create new quote links.
- Agents cannot view unrelated orders.

### 9.12 Admin Portal

**Purpose:** Provide operational control over configuration, fulfilment, and exception management.

**MVP Modules:**

- Dashboard.
- Providers.
- Products.
- Price tables.
- Quotes.
- Orders.
- Payments.
- Certificates.
- Agents.
- Admin users.
- Audit logs.

**Requirements:**

- Admin users have role-based permissions.
- Admins can create, edit, activate, and deactivate providers and products.
- Admins can upload and publish price tables.
- Admins can view order details and state history.
- Admins can upload certificates.
- Admins can view payment status and processor references.
- Admins can search by order ID, email, provider, policy number, and date range.

**Acceptance Criteria:**

- Admin actions that affect pricing, orders, certificates, agents, or permissions are audit logged.
- Price imports show validation errors before publish.
- Admin search returns matching records within acceptable performance thresholds.

### 9.13 Price Table Import

**Purpose:** Allow non-engineering users to update provider prices safely.

**Supported File Types:**

- CSV for MVP.
- XLSX post-MVP if needed.

**Required Fields:**

- Provider code.
- Product code.
- Cover type.
- Duration unit or date band.
- Premium.
- Currency.
- Effective from.
- Effective to, if applicable.
- Sales channel, if applicable.

**Validation:**

- Required fields present.
- Provider and product exist.
- Cover type is valid.
- Premium is numeric and non-negative.
- Effective date range is valid.
- No conflicting active rows for the same provider/product/cover/duration/effective period.

**Acceptance Criteria:**

- Invalid files cannot be published.
- Admin sees row-level validation errors.
- Published price tables are versioned.
- Previous price versions remain auditable.

### 9.14 Content and SEO

**Purpose:** Support acquisition and customer education.

**MVP Requirements:**

- Static or managed pages for home, FAQ, provider pages, contact, privacy, and terms.
- SEO title and description per page.
- Sitemap and robots configuration.

**Post-MVP Requirements:**

- CMS-managed blog.
- CMS-managed translations.
- Structured data for FAQ where legally approved.

**Acceptance Criteria:**

- Public pages render correctly on mobile and desktop.
- Privacy and terms are always available from the footer.
- Provider pages include disclosure links and avoid unsupported claims.

### 9.15 Notifications

**Purpose:** Keep customers, agents, and operations informed.

**Transactional Emails:**

- Quote recovery, if enabled.
- Payment confirmation.
- Payment failure.
- Certificate issued.
- Certificate delayed.
- Refund request received.
- Refund completed.
- Agent quote link created.

**Acceptance Criteria:**

- Transactional emails are logged.
- Failed email delivery is visible to operations.
- Emails use approved templates.
- Marketing consent is separate from transactional email delivery.

### 9.16 Reporting and Analytics

**Purpose:** Measure funnel, operations, provider performance, and agent performance.

**MVP Events:**

- `quote_started`
- `quote_submitted`
- `quote_results_viewed`
- `policy_selected`
- `application_started`
- `application_submitted`
- `payment_started`
- `payment_succeeded`
- `payment_failed`
- `certificate_issued`
- `agent_quote_created`
- `agent_quote_converted`

**MVP Reports:**

- Quote funnel.
- Conversion report.
- Provider sales report.
- Certificate SLA report.
- Agent activity report.

**Acceptance Criteria:**

- Events include anonymous session ID where no user is logged in.
- Purchase events include order ID, provider, product, cover type, and channel.
- Reports can be filtered by date range.

## 10. UX Requirements

- The quote form must be usable without insurance knowledge.
- Date guidance must explain that OSHC should cover the visa period.
- Results must not overwhelm users with legal detail before they can compare price and provider.
- Legal disclosures must be visible before payment.
- Checkout progress should be clear.
- Form errors should be inline, specific, and recoverable.
- Mobile checkout must avoid unnecessary typing where possible.
- Admin and operations screens should prioritize scanning, filtering, and exception handling.

## 11. Data Model Overview

| Entity | Key Fields |
| --- | --- |
| Provider | ID, name, code, logo, status, disclosure URLs, support metadata |
| Product | ID, provider ID, name, code, cover types, status, fulfilment mode |
| Price table | ID, provider ID, version, effective dates, import status, source file |
| Price row | Product ID, cover type, duration band, premium, currency, channel |
| Quote | ID, session ID, adults, children, start date, end date, cover type, expiry |
| Quote result | Quote ID, product ID, premium, fees, total, snapshot metadata |
| Application | ID, quote ID, applicant data, dependant data, visa/study data, validation status |
| Order | ID, application ID, quote result ID, status, total, channel, agent ID |
| Payment | ID, order ID, processor, processor reference, status, amount, timestamps |
| Provider submission | ID, order ID, provider, status, request metadata, response metadata |
| Certificate | ID, order ID, policy number, file reference, issued at, sent at |
| Agent | ID, agency ID, name, email, status, commission profile |
| Audit log | Actor, action, entity, entity ID, timestamp, before/after metadata |

## 12. Permissions

| Role | Permissions |
| --- | --- |
| Anonymous visitor | Create quote, view results, start checkout |
| Customer | View own order through verified access, download own certificate |
| Agent | Create tracked quotes, view own quote/order statuses |
| Operations | View and update orders, submissions, certificates, support notes |
| Finance | View payments, refunds, provider sales, commission reports |
| Admin | Manage providers, products, prices, agents, users, content, and settings |
| Super admin | Manage admin roles, sensitive configuration, and full audit access |

## 13. Technical Product Requirements

- The system must support responsive web access on modern browsers.
- The system must support server-side validation for all quote, application, payment, and admin inputs.
- The system must use signed or authenticated access for private files.
- The system must process payment webhooks idempotently.
- The system must provide queue-based retry for provider submission where automation exists.
- The system must expose operational logs and alerts for failed fulfilment workflows.
- The system must support environment separation for development, staging, and production.

## 14. Compliance Requirements

- Product and legal teams must approve all insurance, visa, refund, and provider disclosure copy before launch.
- Provider policy documents must be linked before purchase.
- Customer consent to terms, privacy policy, refund rules, and provider disclosures must be recorded with timestamp and document version.
- The system must not store raw card numbers.
- Data collection must be minimized to quote, purchase, fulfilment, support, analytics, fraud prevention, and legal needs.
- Agent access to student information must be permissioned and auditable.

## 15. Open Questions

- Which providers will be available at MVP launch?
- Will MVP use one payment provider or support multiple payment methods?
- Which legal distribution model will the business operate under?
- What exact fields does each provider require for policy issuance?
- Which certificate fulfilment processes are automated versus manual at launch?
- What price table format will each provider supply?
- What languages are required for launch versus later phases?
- What support tooling will be used?
- What commission model will be available to agents in MVP?

## 16. Launch Readiness Checklist

- Provider agreements signed.
- Product disclosure links approved.
- Legal copy approved.
- Privacy policy and terms approved.
- Payment gateway configured and tested.
- Provider price tables imported and validated.
- Admin users and roles configured.
- Agent onboarding workflow tested.
- Transactional email templates approved.
- Certificate upload and send workflow tested.
- Analytics events validated.
- Refund and cancellation operating process documented.
- Production monitoring and alerting configured.
- Security review completed.

## 17. MVP Acceptance Criteria

- A student can create a quote and see matching policy results.
- A student can select a policy and complete application details.
- A student can pay by card.
- A successful payment creates a paid order.
- Operations can upload a certificate to the paid order.
- The customer receives a certificate email.
- Admin can import provider pricing.
- Admin can view quote, order, payment, and certificate status.
- Agent can create a tracked quote link.
- Agent-attributed purchases are visible in reporting.
- Payment webhooks are idempotent.
- Role permissions prevent unauthorized order access.
- Public legal and support pages are available.

## 18. Product Risks

| Risk | Product Impact | Mitigation |
| --- | --- | --- |
| Users choose incorrect dates | Visa compliance concerns and support load | Add contextual date guidance, validation, and post-purchase correction workflow |
| Users misunderstand policy differences | Reduced trust or poor purchase decisions | Present key inclusions, links to disclosures, and clear comparison language |
| Provider price data is stale | Incorrect customer pricing | Use quote expiry, effective dates, import validation, and admin alerts |
| Manual fulfilment is slow | Certificate delay | Fulfilment queue, SLA alerts, and proactive delay emails |
| Agent attribution fails | Commission disputes | Use tracked links, immutable attribution records, and audit logs |
| Legal wording is incomplete | Compliance risk | Require legal approval before launch and version consent records |

## 19. Appendix: BRD Traceability

| PRD Area | BRD Source |
| --- | --- |
| Product goals | BRD sections 2, 4, 5 |
| Personas | BRD sections 7, 8 |
| User journeys | BRD section 9 |
| MVP scope | BRD section 20 |
| Functional requirements | BRD section 10 |
| Non-functional requirements | BRD section 11 |
| Integrations | BRD section 12 |
| Data model | BRD section 13 |
| Reporting | BRD section 14 |
| Business rules | BRD section 15 |
| Compliance | BRD section 16 |
| Risks | BRD section 19 |

