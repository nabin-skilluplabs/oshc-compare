# Business Requirements Document: OSHC Comparison and Purchase Platform

## 1. Document Control

| Field | Value |
| --- | --- |
| Product | OSHC comparison, purchase, and certificate delivery platform |
| Reference model | https://oshcaustralia.com.au/ |
| Prepared on | 2026-06-01 |
| Document type | Business Requirements Document |
| Status | Draft |

## 2. Executive Summary

The proposed system will allow international students, dependants, education agents, and internal administrators to compare Overseas Student Health Cover (OSHC) policies from approved Australian providers, select a suitable policy, complete payment, and receive an insurance certificate digitally.

The platform should provide a consumer-facing quote and checkout journey, an agent-facing partner workflow, multilingual content, provider comparison content, support resources, and an administration layer for pricing, providers, orders, commissions, content, and reporting.

The business goal is to reduce friction in OSHC purchase decisions, improve transparency across providers, increase conversion from quote to purchase, support agent-led distribution, and provide fast certificate fulfilment after payment confirmation.

## 3. Background and Market Context

International students applying for or holding an Australian student visa need compliant health insurance for the relevant visa period. The reference site positions itself around a simple value proposition: compare approved OSHC providers in one place, buy a policy online, and receive the certificate quickly. It also supports education agents, multilingual audiences, provider education pages, FAQ content, and live or assisted support.

The product to be built should follow this business model without copying branding, proprietary content, provider commercial terms, or protected implementation details from the reference site.

## 4. Business Objectives

- Enable students to obtain an OSHC quote in under 60 seconds using household composition and policy dates.
- Allow customers to compare eligible policies by price, provider, inclusions, limits, waiting periods, and certificate delivery expectations.
- Enable secure purchase and payment of OSHC policies.
- Automate policy application submission to providers where provider APIs are available.
- Deliver policy certificates by email and in the customer account as soon as payment and provider issuance are complete.
- Support education agents with quote creation, student-assisted purchase, commission tracking, and reporting.
- Support multilingual content and customer assistance for international audiences.
- Provide internal administrators with tools to manage providers, product rules, quote logic, orders, exceptions, commissions, and content.

## 5. Success Metrics

| Metric | Target |
| --- | --- |
| Quote completion rate | At least 70% of users who start the quote form receive results |
| Quote-to-purchase conversion | At least 12% within first 6 months after launch |
| Median quote response time | Less than 3 seconds, excluding third-party provider latency |
| Certificate delivery | 90% of automatically issued certificates delivered within 15 minutes of confirmed payment |
| Payment success rate | At least 95% of valid payment attempts |
| Support ticket rate | Less than 8% of completed purchases |
| Agent activation | At least 50 active agents within 6 months, subject to sales pipeline |
| Refund/cancellation processing SLA | 95% of eligible requests triaged within 2 business days |

## 6. Scope

### 6.1 In Scope

- Public marketing and quote landing pages.
- Quote form for adults, children, policy start date, and policy end date.
- Policy comparison results.
- Provider profile pages.
- Checkout and payment.
- Customer application form.
- Certificate delivery and customer email notifications.
- Customer account or purchase lookup.
- Agent portal for partner-led quoting and order tracking.
- Admin portal for operational management.
- Multilingual content framework.
- Support and FAQ content.
- Reporting and analytics.
- Security, privacy, audit logging, and operational monitoring.

### 6.2 Out of Scope for Initial Release

- Direct claims lodgement with insurers.
- Medical provider search or appointment booking.
- Native mobile applications.
- Full CRM implementation beyond core lead/order management.
- Complex dynamic underwriting beyond rules supplied by OSHC providers.
- Non-OSHC insurance products unless added in later phases.

## 7. Stakeholders

| Stakeholder | Interest |
| --- | --- |
| International students | Compare, buy, and receive OSHC policies easily |
| Student dependants | Be included correctly in policy eligibility and pricing |
| Education agents | Quote and assist students, track orders, earn commissions |
| Internal operations team | Resolve failed applications, refunds, data issues, provider exceptions |
| Finance team | Reconcile payments, commissions, refunds, and provider settlements |
| Compliance/legal team | Ensure privacy, insurance distribution, disclosure, and visa-related messaging is correct |
| Providers/insurers | Receive accurate application data and payment/issuance requests |
| Customer support team | Assist customers through chat, email, and phone |
| Product and marketing teams | Manage content, campaigns, conversion funnels, and SEO |

## 8. User Roles and Personas

### 8.1 Student Buyer

An international student who needs OSHC for a new visa, visa extension, or provider switch. They need clear pricing, visa-period guidance, and fast certificate delivery.

### 8.2 Dependant or Family Buyer

A student or family member purchasing cover for a couple or family. They need household composition rules, compliant policy options, and clarity on price differences.

### 8.3 Education Agent

A registered agent who helps students compare and purchase policies. They need quote tools, student handoff, conversion tracking, order status, downloadable certificates, and commission visibility.

### 8.4 Support Operator

An internal user who helps customers resolve payment issues, date corrections, certificate delays, cancellations, refunds, and provider questions.

### 8.5 Platform Administrator

An internal user who manages providers, products, pricing configurations, translations, agent accounts, commissions, integrations, and operational reports.

## 9. Customer Journey

1. User lands on the public website.
2. User selects language, if needed.
3. User enters number of adults, number of children, policy start date, and policy end date.
4. System validates dates and household composition.
5. System returns eligible policy options from approved OSHC providers.
6. User filters, sorts, and compares policies.
7. User selects a policy.
8. User completes applicant, dependant, contact, visa, and education details.
9. User reviews policy disclosures, terms, and payment amount.
10. User pays securely.
11. System confirms payment and submits application to provider.
12. System receives or uploads certificate.
13. User receives confirmation email and certificate.
14. User can contact support, retrieve certificate, request changes, or initiate cancellation/refund workflows where eligible.

## 10. Functional Requirements

### 10.1 Public Website

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | The system shall provide a public home page explaining the OSHC comparison value proposition. | Must |
| FR-002 | The system shall provide a prominent quote form above the fold on desktop and mobile. | Must |
| FR-003 | The system shall provide content pages for OSHC overview, visa condition guidance, provider pages, FAQs, contact, blog, privacy, and terms. | Must |
| FR-004 | The system shall support SEO metadata, structured content, canonical URLs, and sitemap generation. | Should |
| FR-005 | The system shall provide trust signals including secure checkout, support contact options, and provider legitimacy messaging. | Must |

### 10.2 Quote Form

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-006 | The system shall allow users to select 1 or 2 adults. | Must |
| FR-007 | The system shall allow users to select 0 to 10 children. | Must |
| FR-008 | The system shall allow users to enter policy start and end dates. | Must |
| FR-009 | The system shall validate that the end date is after the start date. | Must |
| FR-010 | The system shall show contextual guidance explaining that OSHC should cover the visa-length period. | Must |
| FR-011 | The system shall support quote recovery when a user leaves and returns within a defined period. | Should |
| FR-012 | The system shall track quote events for analytics and funnel reporting. | Must |

### 10.3 Eligibility and Pricing Engine

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-013 | The system shall calculate eligible cover type based on household composition: single, couple, single-parent family, or family. | Must |
| FR-014 | The system shall calculate policy duration in accordance with provider pricing rules. | Must |
| FR-015 | The system shall retrieve or calculate premiums for each enabled provider. | Must |
| FR-016 | The system shall exclude providers or products that are not available for the requested dates, household type, or sales channel. | Must |
| FR-017 | The system shall store quote inputs, returned prices, provider response metadata, and expiry timestamp. | Must |
| FR-018 | The system shall support manual price table imports where provider APIs are unavailable. | Must |
| FR-019 | The system shall support provider API pricing where available. | Should |
| FR-020 | The system shall display clear pricing currency, taxes/fees, payment fees, and total payable amount. | Must |

### 10.4 Comparison Results

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-021 | The system shall display all eligible policies in a comparable list. | Must |
| FR-022 | The system shall allow sorting by lowest price, provider name, recommended, and fastest certificate delivery where data is available. | Must |
| FR-023 | The system shall allow filtering by provider, cover type, and key benefits where available. | Should |
| FR-024 | The system shall provide side-by-side comparison of selected policies. | Should |
| FR-025 | The system shall display provider logos, policy names, price, key inclusions, waiting period notes, exclusions/disclosures, and certificate delivery expectations. | Must |
| FR-026 | The system shall clearly distinguish marketing summary from legally required product disclosure documents. | Must |
| FR-027 | The system shall link to provider policy documents, terms, and product disclosures. | Must |

### 10.5 Application and Checkout

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-028 | The system shall collect primary applicant legal name, date of birth, gender where required by provider, nationality, email, phone, and address. | Must |
| FR-029 | The system shall collect dependant details where applicable. | Must |
| FR-030 | The system shall collect visa, course, institution, and policy date information required by provider application rules. | Must |
| FR-031 | The system shall validate customer details before payment. | Must |
| FR-032 | The system shall require customer acceptance of terms, privacy policy, refund rules, and provider disclosures. | Must |
| FR-033 | The system shall support secure card payment at minimum. | Must |
| FR-034 | The system should support alternative payment methods relevant to international students, such as bank transfer or local payment rails through a payment partner. | Should |
| FR-035 | The system shall generate an order record before payment and update it through payment, provider submission, and fulfilment states. | Must |
| FR-036 | The system shall prevent duplicate purchase submission for the same payment/order. | Must |

### 10.6 Provider Submission and Certificate Fulfilment

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-037 | The system shall submit purchase data to the selected provider automatically where an API or integration file is available. | Must |
| FR-038 | The system shall support manual fulfilment queues where provider automation is unavailable or fails. | Must |
| FR-039 | The system shall store provider policy number, certificate file, issue timestamp, and fulfilment status. | Must |
| FR-040 | The system shall email the customer when the certificate is issued. | Must |
| FR-041 | The system shall make certificates downloadable from a secure customer lookup or account page. | Should |
| FR-042 | The system shall alert operations when certificate fulfilment exceeds SLA. | Must |

### 10.7 Customer Account and Order Lookup

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-043 | The system shall allow customers to retrieve orders using secure magic link authentication. | Should |
| FR-044 | The system shall show order status, policy details, selected provider, payment receipt, certificate, and support options. | Should |
| FR-045 | The system shall allow customers to request date correction, cancellation, refund, or certificate resend. | Should |

### 10.8 Agent Portal

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-046 | The system shall allow agents to register or be invited. | Must |
| FR-047 | The system shall support agent approval, suspension, and profile management by administrators. | Must |
| FR-048 | The system shall allow agents to create quotes on behalf of students. | Must |
| FR-049 | The system shall allow agents to send quote links to students for completion and payment. | Must |
| FR-050 | The system shall allow agents to view student order status and certificate availability where consent and permissions allow. | Must |
| FR-051 | The system shall calculate commissions based on configurable provider, product, agent, and date rules. | Must |
| FR-052 | The system shall provide agent reporting for quotes, conversions, purchases, cancellations, and commissions. | Should |

### 10.9 Admin Portal

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-053 | The system shall provide role-based admin access. | Must |
| FR-054 | The system shall allow administrators to manage provider records, product availability, pricing sources, and disclosure links. | Must |
| FR-055 | The system shall allow administrators to import provider price tables with validation and audit logs. | Must |
| FR-056 | The system shall allow administrators to view and manage quotes, orders, payments, provider submissions, certificates, refunds, and support flags. | Must |
| FR-057 | The system shall allow administrators to configure commission rules and payout statuses. | Must |
| FR-058 | The system shall allow administrators to manage CMS pages, FAQ entries, translations, blog posts, and provider content. | Should |
| FR-059 | The system shall provide audit logs for sensitive admin actions. | Must |

### 10.10 Multilingual Support

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-060 | The system shall support English at launch. | Must |
| FR-061 | The system should support additional languages including Chinese, Portuguese, Spanish, and Vietnamese. | Should |
| FR-062 | The system shall use a translation management approach that separates content strings from application logic. | Must |
| FR-063 | The system shall preserve legal, provider, and disclosure text accuracy across translations. | Must |

### 10.11 Support and Communications

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-064 | The system shall send transactional emails for quote started, payment received, certificate issued, provider delay, refund update, and support request confirmation. | Must |
| FR-065 | The system shall provide contact options including support form, email, and phone display. | Must |
| FR-066 | The system should integrate with live chat or helpdesk tooling. | Should |
| FR-067 | The system shall provide internal notes and status transitions for support cases linked to orders. | Should |

## 11. Non-Functional Requirements

### 11.1 Security

- All customer, payment, policy, and identity data must be transmitted over TLS.
- Payment processing must use a PCI-compliant payment processor; the platform should not store raw card details.
- Sensitive personal data must be encrypted at rest where technically feasible.
- Admin and agent portals must require strong authentication.
- Admin roles must follow least-privilege access.
- All certificate downloads must require authenticated or signed, expiring access.
- Security logs must capture authentication events, admin changes, payment status changes, and certificate access.

### 11.2 Privacy and Compliance

- The platform must comply with applicable Australian privacy obligations and any relevant overseas user privacy requirements based on target markets.
- The platform must present clear privacy notices before collecting personal information.
- The platform must collect only data required for quoting, purchase, fulfilment, support, analytics, fraud prevention, and compliance.
- The platform must provide data retention rules for quotes, incomplete applications, completed policies, support cases, and analytics records.
- Marketing consent must be opt-in and separate from transactional communications.

### 11.3 Performance

- Public pages should achieve good Core Web Vitals on mobile and desktop.
- Cached quote content and provider metadata should load within 2 seconds for 95% of page views.
- Quote result generation should complete within 3 seconds for 95% of requests when using local price tables.
- Provider API failures must degrade gracefully and not block other provider results.

### 11.4 Availability and Resilience

- Public quote and checkout functions should target 99.9% monthly availability after production stabilization.
- The system must queue provider submissions and retry transient failures.
- Payment webhook processing must be idempotent.
- Certificate fulfilment must be recoverable after integration failure.

### 11.5 Accessibility

- The public website and checkout should meet WCAG 2.1 AA where practical.
- Forms must support keyboard navigation, visible focus states, labels, validation messages, and screen reader-friendly errors.
- Date selection must support manual entry as well as picker interaction.

## 12. Integrations

| Integration | Purpose | Priority |
| --- | --- | --- |
| Payment gateway | Card payments, payment status, refunds, reconciliation | Must |
| Provider pricing APIs or price table imports | Quote results and policy availability | Must |
| Provider application APIs or secure submission files | Purchase fulfilment and certificate issuance | Must |
| Email service | Transactional email delivery | Must |
| Helpdesk/live chat | Customer support and ticketing | Should |
| Analytics | Funnel, attribution, conversion, campaign reporting | Must |
| Translation management/CMS | Multilingual content management | Should |
| Fraud/risk tooling | Detect suspicious payment or application patterns | Could |
| Agent identity verification | Agent onboarding and compliance checks | Could |

## 13. Data Requirements

### 13.1 Core Data Entities

- User
- Customer profile
- Agent profile
- Provider
- Product
- Price table
- Quote
- Quote result
- Application
- Order
- Payment
- Provider submission
- Policy
- Certificate
- Refund/cancellation request
- Commission rule
- Commission ledger
- Support case
- Content page
- Translation string
- Audit log

### 13.2 Data Retention Assumptions

- Incomplete quote data should be retained for a limited marketing and recovery period, subject to consent and privacy policy.
- Completed policy/order data should be retained for legal, accounting, support, and compliance periods.
- Payment records should retain processor references, not raw card data.
- Audit logs should be immutable or tamper-evident.

## 14. Reporting Requirements

| Report | Audience | Description |
| --- | --- | --- |
| Quote funnel | Product/marketing | Starts, completed quotes, provider selections, abandonments |
| Conversion report | Product/finance | Quote-to-purchase and payment success |
| Provider sales report | Finance/operations | Policies sold by provider, product, period, channel |
| Agent performance | Sales/agent managers | Agent quotes, purchases, commissions, cancellations |
| Certificate SLA report | Operations | Time from payment to certificate issue |
| Refund/cancellation report | Finance/support | Requests, reasons, status, refund amounts |
| Integration health | Engineering/operations | Provider API failures, webhook retries, queue age |
| Content performance | Marketing | SEO traffic, FAQ visits, language usage |

## 15. Business Rules

- A policy end date must be later than the policy start date.
- Household composition must map to provider-supported cover types.
- Prices must be shown in Australian dollars unless otherwise explicitly supported.
- Quote results must expire after a configurable period if provider prices or terms can change.
- Payment must be confirmed before automatic provider fulfilment, unless a payment method explicitly supports delayed settlement and the business accepts that risk.
- Certificates must not be sent to unauthenticated third parties unless consent, agent permissions, or business rules allow it.
- Agents must only access orders linked to their account or agency.
- Commission should not be payable on refunded or cancelled policies unless explicitly configured.
- Provider disclosures and product documents must be displayed before purchase.
- Refund and cancellation requests must follow provider and regulatory rules.

## 16. Compliance and Legal Considerations

- Confirm whether the business requires an Australian Financial Services Licence, authorised representative status, referral arrangement, or other legal structure for insurance distribution.
- Confirm required disclosures for comparing, recommending, arranging, or facilitating OSHC policies.
- Confirm provider contract requirements for displaying pricing, benefits, logos, product names, and policy documents.
- Confirm obligations for storing health insurance policy data and student personal information.
- Confirm requirements for handling minors' data if children are listed on policies.
- Confirm chargeback, refund, cancellation, and cooling-off obligations with each provider.
- Confirm language translation review requirements for legally sensitive content.

## 17. Assumptions

- Commercial agreements will be established with each OSHC provider before launch.
- Providers will supply price tables, API access, or approved fulfilment processes.
- A third-party payment provider will handle card data and PCI scope.
- The platform will sell OSHC only in the first release.
- The business will provide approved legal copy, provider disclosures, privacy policy, and terms.
- Certificate delivery timing depends on provider integration maturity and payment method.
- Initial launch can use manual operations fallbacks for providers without automation.

## 18. Dependencies

- Provider contracts and technical integration documentation.
- Payment gateway account and webhook configuration.
- Legal review of distribution, privacy, terms, and disclosure content.
- Brand identity and UX design.
- Content and translation approvals.
- Support process design and helpdesk setup.
- Finance process for reconciliation, provider settlement, commissions, and refunds.
- Analytics and attribution requirements.

## 19. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Provider APIs are unavailable or inconsistent | Quote or fulfilment delays | Support price table imports, queues, retries, and manual fulfilment |
| Pricing becomes stale | Customer disputes or margin loss | Quote expiry, scheduled imports, provider validation, audit logs |
| Legal classification is unclear | Regulatory exposure | Complete legal review before production sales |
| Certificate delivery is delayed | Support volume and customer dissatisfaction | SLA monitoring, proactive notifications, operations dashboard |
| Payment/webhook failure creates duplicate orders | Financial and fulfilment errors | Idempotent payment processing and order state machine |
| Multilingual content mistranslates legal terms | Compliance and trust issues | Human review of legal and provider content |
| Agent misuse or data overexposure | Privacy breach | Role-based permissions, agency scoping, audit logs |
| Refund rules vary by provider | Operational complexity | Provider-specific refund workflows and admin guidance |

## 20. MVP Requirements

The MVP should include:

- Public landing page with quote form.
- English-only content.
- Quote engine using imported price tables.
- Results list with sort by lowest price and provider.
- Provider comparison details and required disclosure links.
- Checkout application form.
- Card payment integration.
- Order state management.
- Manual or semi-automated provider fulfilment.
- Certificate upload and email delivery.
- Basic admin portal for providers, prices, orders, certificates, and refunds.
- Basic agent account creation and quote link tracking.
- Core analytics and operational reporting.

## 21. Future Enhancements

- Full provider API automation for pricing, purchase, and certificate retrieval.
- Customer account portal with self-service corrections and refunds.
- Expanded language support.
- Advanced agent commission dashboards.
- A/B testing for quote and checkout conversion.
- Additional insurance products for graduate, visitor, or temporary work visa audiences.
- Provider recommendation engine using user preferences.
- Open banking, local payment methods, or international payment partner integration.
- Automated compliance content monitoring against government or provider updates.

## 22. Acceptance Criteria

- A student can complete quote inputs and view eligible policy results.
- A student can select a policy, complete required application details, pay, and receive confirmation.
- Operations can view a paid order and complete certificate fulfilment.
- The system sends certificate email once the certificate is available.
- Admin users can import provider pricing and see audit history.
- Agents can create a quote link and track resulting order status.
- Failed payments, failed provider submissions, and delayed certificates are visible in admin queues.
- Public content includes FAQ, provider, contact, privacy, and terms pages.
- Quote and purchase analytics events are captured.
- Role-based access prevents agents from viewing unrelated orders.

## 23. Source Notes

This BRD was informed by publicly visible functionality and content on the OSHC Australia website as of 2026-06-01, including:

- Public quote inputs for adults, children, policy start date, and policy finish date.
- Positioning around comparing Australian Government-approved OSHC providers in one place.
- Purchase and certificate delivery messaging.
- Education agent value proposition and agent login path.
- Multilingual navigation options.
- Provider, visa, FAQ, blog, government information, and support content.
- Payment and platform references to Flywire/Cohort Go.

Relevant public reference URLs:

- https://oshcaustralia.com.au/en
- https://www.health.gov.au/resources/collections/overseas-student-health-cover-oshc-resources
- https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500

