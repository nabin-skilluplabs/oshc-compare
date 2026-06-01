# Milestones, Stories, and Tasks: OSHC Comparison and Purchase Platform

## 1. Document Control

| Field | Value |
| --- | --- |
| Product | OSHC comparison, purchase, and certificate delivery platform |
| Source documents | `docs/BRD_OSHC_Comparison_Platform.md`, `docs/PRD_OSHC_Comparison_Platform.md` |
| Prepared on | 2026-06-01 |
| Document type | Delivery backlog |
| Status | Draft |

## 2. Delivery Assumptions

- The MVP will be delivered as a responsive web application with public, agent, and admin surfaces.
- The MVP will use imported provider price tables rather than live provider pricing APIs.
- The MVP will support card payment through a PCI-compliant payment gateway.
- Certificate fulfilment can be manual in MVP through admin upload and email delivery.
- English is the MVP language.
- Provider agreements, legal copy, disclosure URLs, payment provider choice, and brand identity are external dependencies.
- Story estimates are indicative and should be recalibrated after technical architecture is selected.

## 3. Milestone Overview

| Milestone | Name | Goal | Primary Disciplines | Exit Criteria |
| --- | --- | --- | --- | --- |
| M0 | Discovery and Foundations | Confirm scope, architecture, compliance inputs, and delivery approach | Product, Design, Engineering, Legal/Ops | Architecture, UX direction, legal dependencies, and data model are approved |
| M1 | Public Quote Experience | Let visitors create a valid OSHC quote and view eligible policy results | Design, Frontend, Backend, QA | Users can submit quote inputs and see price-table-based results |
| M2 | Application and Checkout | Let students select a policy, complete application details, and pay | Design, Frontend, Backend, Payments, QA | Successful payment creates a paid order and confirmation email |
| M3 | Admin Operations | Let operations manage providers, price tables, orders, and certificates | Design, Frontend, Backend, QA, Ops | Admin can import prices, view orders, upload certificate, and fulfil an order |
| M4 | Agent MVP | Let education agents create tracked quotes and monitor outcomes | Design, Frontend, Backend, QA | Agent-created quote links preserve attribution through purchase |
| M5 | Reporting, Security, and Launch Readiness | Harden MVP for production launch | Engineering, QA, Security, Product, Ops | Security, analytics, monitoring, launch checklist, and end-to-end QA pass |
| M6 | Post-MVP Enhancements | Add customer self-service, multilingual support, APIs, and advanced agent functions | Product, Design, Engineering | Prioritized post-MVP items are ready for discovery or build |

## 4. Milestone M0: Discovery and Foundations

### M0-S1: Confirm MVP Scope and Delivery Plan

**As a** product owner, **I want** the MVP scope and release boundaries confirmed **so that** the team builds the smallest viable quote-to-certificate workflow.

**Discipline:** Product  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- MVP scope is documented and approved by business stakeholders.
- Post-MVP items are separated from launch-blocking work.
- Open questions from the PRD have named owners.
- Milestone exit criteria are accepted by product, design, engineering, and operations.

**Tasks:**

- Review BRD and PRD with stakeholders.
- Confirm MVP versus post-MVP feature list.
- Create decision log for open questions.
- Confirm launch-critical dependencies.
- Create delivery board with milestones, stories, and labels.

### M0-S2: Define Product Architecture

**As an** engineering lead, **I want** a target architecture **so that** teams can build quote, checkout, admin, and fulfilment features consistently.

**Discipline:** Engineering  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Architecture diagram covers public app, admin app, database, payment gateway, email service, storage, analytics, and background jobs.
- Authentication and role model are defined.
- Environment strategy for local, staging, and production is defined.
- Core non-functional requirements are mapped to technical decisions.

**Tasks:**

- Select application framework and hosting approach.
- Define app boundaries for public, agent, and admin surfaces.
- Define background job and queue approach.
- Define file storage approach for certificates and imports.
- Define observability and error tracking approach.
- Review architecture with engineering and product.

### M0-S3: Define Data Model and State Machines

**As a** backend developer, **I want** a validated data model **so that** quotes, applications, orders, payments, and certificates can be implemented safely.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Entity relationship model includes providers, products, prices, quotes, quote results, applications, orders, payments, certificates, agents, and audit logs.
- Order state machine is documented.
- Payment state handling is documented.
- Certificate fulfilment state handling is documented.
- Required audit events are listed.

**Tasks:**

- Draft database schema.
- Define enum values for cover types, order states, payment states, fulfilment states, and user roles.
- Define quote result snapshot model.
- Define application data model with provider-aware fields.
- Define audit log table structure.
- Review schema with engineering and operations.

### M0-S4: Legal, Compliance, and Disclosure Discovery

**As a** compliance stakeholder, **I want** legal requirements identified **so that** the product does not launch with unsupported insurance, visa, privacy, or refund claims.

**Discipline:** Product, Legal, Compliance  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Legal distribution model is documented.
- Required customer consents are documented.
- Provider disclosure and policy document requirements are documented.
- Privacy, terms, refund, and marketing consent requirements are documented.
- Launch-blocking legal copy dependencies are tracked.

**Tasks:**

- Confirm insurance distribution model.
- Identify required provider disclosures.
- Define consent capture requirements and versioning.
- Define privacy notice placement.
- Define refund and cancellation language requirements.
- Create legal copy checklist for design and content.

### M0-S5: UX Discovery and Design System Direction

**As a** product designer, **I want** UX flows and design foundations **so that** developers can build consistent screens.

**Discipline:** Design  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- User flows are created for quote, results, checkout, admin fulfilment, and agent quote creation.
- Low-fidelity wireframes exist for MVP screens.
- Design tokens or initial style direction are defined.
- Accessibility considerations are documented.

**Tasks:**

- Map student quote-to-purchase flow.
- Map admin price import and fulfilment flow.
- Map agent quote creation flow.
- Create wireframes for public landing, quote form, results, checkout, admin orders, admin price import, and agent dashboard.
- Define responsive layout rules.
- Define form validation and error message patterns.

## 5. Milestone M1: Public Quote Experience

### M1-S1: Build Public Landing Page

**As a** student visitor, **I want** to understand the product and start a quote immediately **so that** I can compare OSHC options quickly.

**Discipline:** Design, Frontend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Landing page communicates OSHC comparison value proposition.
- Quote form appears in the first viewport on desktop and early on mobile.
- Footer includes links to FAQ, providers, contact, privacy, and terms.
- Page is responsive across mobile, tablet, and desktop.
- Page supports SEO title and meta description.

**Tasks:**

- Finalize high-fidelity landing page design.
- Implement responsive page layout.
- Add header, navigation, and footer.
- Add trust markers and support contact section.
- Add placeholder links for required legal/content pages.
- Add SEO metadata.
- QA responsive rendering.

### M1-S2: Build Quote Form UI

**As a** student, **I want** to enter household and policy dates **so that** I can get eligible OSHC quotes.

**Discipline:** Design, Frontend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- User can select 1 or 2 adults.
- User can select 0 to 10 children.
- User can enter policy start and end dates.
- Form shows clear inline validation errors.
- Date guidance explains visa-length cover requirement.
- Form is keyboard accessible.

**Tasks:**

- Design form controls and validation states.
- Implement adult selector.
- Implement child selector.
- Implement date inputs with manual entry support.
- Add contextual date guidance.
- Add client-side validation.
- Add accessibility labels and focus states.
- QA mobile layout and keyboard navigation.

### M1-S3: Implement Quote Validation API

**As a** frontend developer, **I want** a quote validation API **so that** quote submissions are validated server-side before results are generated.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- API validates adult count, child count, start date, and end date.
- API rejects invalid or unsupported date ranges.
- API returns structured validation errors.
- API creates quote record for valid submissions.
- API calculates and stores cover type.

**Tasks:**

- Create quote endpoint.
- Implement server-side input schema.
- Implement date validation rules.
- Implement cover type calculation.
- Persist quote record.
- Add unit tests for validation.
- Add API integration tests.

### M1-S4: Implement Provider, Product, and Price Data Foundation

**As a** backend developer, **I want** provider, product, and price entities **so that** the pricing engine can return eligible results.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Providers can be stored with code, name, logo reference, status, and disclosure URLs.
- Products can be stored with provider, product code, cover type support, status, and fulfilment mode.
- Price rows can be stored with product, cover type, duration band, premium, currency, effective dates, and channel.
- Seed data can create sample providers, products, and prices for development.

**Tasks:**

- Create database migrations.
- Create provider model.
- Create product model.
- Create price table and price row models.
- Add seed data for representative providers.
- Add repository/service layer for pricing lookup.
- Add tests for active provider and product filtering.

### M1-S5: Implement Pricing Engine

**As a** student, **I want** to see eligible policy prices **so that** I can compare options.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Pricing engine accepts quote ID or validated quote inputs.
- Engine returns active products matching cover type and date rules.
- Engine excludes inactive providers/products.
- Engine calculates policy duration according to MVP rules.
- Engine returns price snapshots with premium, fees, total, expiry, provider, and product metadata.
- Engine returns a useful no-results response when no products match.

**Tasks:**

- Define duration calculation rules.
- Implement active price lookup.
- Implement cover type filtering.
- Implement effective date filtering.
- Implement quote result snapshot creation.
- Implement quote expiry timestamp.
- Add no-results response.
- Add unit and integration tests.

### M1-S6: Build Results Page

**As a** student, **I want** to compare policy results **so that** I can choose a policy.

**Discipline:** Design, Frontend, Backend  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Results page displays provider, product, price, cover type, key inclusions, delivery note, and disclosure links.
- User can sort by lowest price and provider name.
- User can edit quote inputs and re-run results.
- User can select a policy and continue to application.
- Empty state gives recovery guidance.
- Results work on mobile without horizontal scrolling.

**Tasks:**

- Finalize result card/list design.
- Implement results API.
- Implement results page route.
- Build result list component.
- Build sorting controls.
- Build quote summary and edit controls.
- Implement select policy action.
- Add no-results state.
- QA responsive layout.

### M1-S7: Instrument Quote Analytics

**As a** product manager, **I want** quote funnel events **so that** I can measure drop-off and conversion.

**Discipline:** Frontend, Backend, Analytics  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- `quote_started`, `quote_submitted`, and `quote_results_viewed` events are tracked.
- Events include session ID, quote ID where available, channel, adults, children, cover type, and result count where appropriate.
- Analytics events are not blocked by provider result failures.

**Tasks:**

- Define analytics event schema.
- Add event tracking to quote form focus/start.
- Add event tracking to quote submit success and failure.
- Add event tracking to results view.
- Validate events in staging.

## 6. Milestone M2: Application and Checkout

### M2-S1: Design Checkout Flow

**As a** student, **I want** a clear checkout flow **so that** I know what information is needed before payment.

**Discipline:** Design  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Designs cover applicant details, contact details, visa/study details, dependant details, review, disclosure consent, and payment entry.
- Designs include mobile and desktop states.
- Designs include validation, loading, save-progress, and error states.
- Designs identify where provider disclosure links and consent checkboxes appear.

**Tasks:**

- Create checkout flow map.
- Design application form steps.
- Design review and consent screen.
- Design payment screen.
- Design validation and error states.
- Review with product, legal, and engineering.

### M2-S2: Build Application Draft Model and API

**As a** backend developer, **I want** application drafts **so that** checkout data can be captured before payment.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Application draft is linked to quote and selected quote result.
- API can create and update application drafts.
- API validates required fields by selected product and cover type.
- Dependant data is supported for family and dependant cover types.
- Application data is stored securely.

**Tasks:**

- Create application table/model.
- Define applicant field schema.
- Define dependant field schema.
- Define visa/study field schema.
- Implement create application draft endpoint.
- Implement update application draft endpoint.
- Implement server-side validation.
- Add tests for single, couple, and family scenarios.

### M2-S3: Build Application Form UI

**As a** student, **I want** to enter required policy information **so that** my selected OSHC policy can be issued.

**Discipline:** Frontend  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Form captures applicant, contact, visa/study, and dependant details.
- Dependant section appears only when required.
- User can review selected policy and quote summary during checkout.
- Inline validation is shown for missing or invalid fields.
- Form progress is saved as application draft.

**Tasks:**

- Build checkout layout.
- Build applicant details form.
- Build contact details form.
- Build visa/study details form.
- Build dependant details form.
- Build policy summary panel.
- Integrate with application draft API.
- Add client-side validation.
- QA form behavior across cover types.

### M2-S4: Implement Consent and Disclosure Capture

**As a** compliance stakeholder, **I want** consent records captured **so that** purchase decisions have auditable legal acceptance.

**Discipline:** Backend, Frontend, Legal  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Checkout displays privacy, terms, refund, and provider disclosure links before payment.
- User must accept required consent checkboxes before payment.
- System records consent timestamp, document type, document version, and user/order context.
- Consent records are visible in admin order details.

**Tasks:**

- Define consent document/version model.
- Add consent fields to checkout.
- Block payment if required consent is missing.
- Persist consent records.
- Display consent records in admin order details.
- Add tests for consent requirement.

### M2-S5: Implement Order Creation and State Machine

**As a** backend developer, **I want** order state management **so that** payment and fulfilment workflows are reliable.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Order can be created from validated application and selected quote result.
- Order has one current state.
- Valid state transitions are enforced.
- State transition history is stored.
- Admin can view state history.

**Tasks:**

- Create order table/model.
- Create order state transition table/model.
- Implement order creation service.
- Implement state transition service.
- Define valid transition map.
- Add transition audit logging.
- Add unit tests for valid and invalid transitions.

### M2-S6: Integrate Card Payment

**As a** student, **I want** to pay securely by card **so that** I can complete my OSHC purchase.

**Discipline:** Backend, Frontend, Payments  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Payment session can be created for an order.
- Payment page displays final amount.
- Successful payment changes order to `paid`.
- Failed payment changes order to `payment_failed` or keeps it recoverable.
- Raw card data is never stored by the platform.

**Tasks:**

- Select and configure payment gateway.
- Create payment model.
- Implement payment session creation endpoint.
- Build payment UI integration.
- Implement payment success handling.
- Implement payment failure handling.
- Add payment status display in checkout.
- Test with gateway sandbox cards.

### M2-S7: Implement Idempotent Payment Webhooks

**As a** backend developer, **I want** payment webhooks to be idempotent **so that** duplicate gateway events do not duplicate fulfilment.

**Discipline:** Backend, Payments  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Webhook signature is verified.
- Duplicate webhook events are ignored or safely reprocessed.
- Payment records are updated exactly once per event outcome.
- Order fulfilment trigger runs only once per successful payment.

**Tasks:**

- Implement webhook endpoint.
- Add signature verification.
- Store gateway event IDs.
- Implement idempotency checks.
- Trigger order state transition on successful payment.
- Add tests for duplicate webhook delivery.

### M2-S8: Send Payment Confirmation Email

**As a** student, **I want** payment confirmation **so that** I know my purchase is being processed.

**Discipline:** Backend, Frontend/Ops Content  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- Payment confirmation email is sent after successful payment.
- Email includes order reference, selected provider/product, amount paid, and certificate expectation.
- Email delivery attempt is logged.
- Failed email delivery is visible to operations.

**Tasks:**

- Configure transactional email provider.
- Create payment confirmation template.
- Implement email send service.
- Trigger email after paid state.
- Log email delivery status.
- Test email rendering and delivery.

### M2-S9: Instrument Checkout Analytics

**As a** product manager, **I want** checkout analytics **so that** I can measure conversion and failures.

**Discipline:** Frontend, Backend, Analytics  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- `policy_selected`, `application_started`, `application_submitted`, `payment_started`, `payment_succeeded`, and `payment_failed` events are tracked.
- Events include quote ID, order ID when available, provider, product, cover type, amount, and channel.

**Tasks:**

- Define checkout event payloads.
- Add event tracking to policy selection.
- Add event tracking to application start and submit.
- Add event tracking to payment start and outcomes.
- Validate event delivery in staging.

## 7. Milestone M3: Admin Operations

### M3-S1: Design Admin Information Architecture

**As an** operations user, **I want** admin screens organized around my workflows **so that** I can manage exceptions quickly.

**Discipline:** Design, Product, Ops  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Admin navigation covers dashboard, providers, products, price tables, quotes, orders, payments, certificates, agents, users, and audit logs.
- Designs prioritize search, filtering, status visibility, and exception handling.
- Core admin screens have desktop-first wireframes.

**Tasks:**

- Interview operations and finance stakeholders.
- Define admin navigation.
- Create admin dashboard wireframe.
- Create provider/product management wireframes.
- Create price import wireframes.
- Create order detail and fulfilment wireframes.
- Review designs with engineering.

### M3-S2: Implement Admin Authentication and Roles

**As an** admin, **I want** secure role-based access **so that** sensitive operational functions are protected.

**Discipline:** Backend, Frontend, Security  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Admin users can sign in.
- Roles include operations, finance, admin, and super admin.
- Protected admin routes require authentication.
- Permission checks block unauthorized actions.
- Authentication events are audit logged.

**Tasks:**

- Implement admin user model.
- Implement sign-in flow.
- Implement session management.
- Implement role and permission middleware.
- Protect admin routes.
- Add audit logging for auth events.
- Add tests for permission checks.

### M3-S3: Build Provider and Product Management

**As an** admin, **I want** to manage providers and products **so that** quote results stay accurate.

**Discipline:** Frontend, Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Admin can create, edit, activate, and deactivate providers.
- Admin can create, edit, activate, and deactivate products.
- Products are linked to providers.
- Provider disclosure URLs and logo references can be managed.
- Changes are audit logged.

**Tasks:**

- Build provider list page.
- Build provider create/edit form.
- Build product list page.
- Build product create/edit form.
- Implement provider and product admin APIs.
- Add activation/deactivation controls.
- Add audit logs for changes.
- QA admin CRUD workflows.

### M3-S4: Build Price Table Import

**As an** admin, **I want** to import provider price tables **so that** non-engineers can update prices.

**Discipline:** Frontend, Backend, QA  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Admin can upload CSV price table.
- System validates required fields, provider/product existence, cover type, premium, effective dates, and overlapping rows.
- Admin can review validation summary.
- Valid imports can be published.
- Published price tables are versioned and auditable.

**Tasks:**

- Define CSV template.
- Build upload UI.
- Implement file parsing.
- Implement row validation.
- Implement conflict detection.
- Build validation results UI.
- Implement publish action.
- Store source file reference.
- Add tests for valid and invalid imports.

### M3-S5: Build Admin Order Search and Detail

**As an** operations user, **I want** to search and inspect orders **so that** I can support customers and fulfil policies.

**Discipline:** Frontend, Backend  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Admin can search by order ID, email, provider, policy number, and date range.
- Order list shows state, customer, provider, product, amount, payment status, and certificate status.
- Order detail shows quote, application, payment, consent, state history, certificate, and audit information.
- Access respects admin role permissions.

**Tasks:**

- Implement order search API.
- Build order list UI.
- Build order detail UI.
- Add filters and pagination.
- Display state history.
- Display payment and consent details.
- Add permission checks.
- QA search scenarios.

### M3-S6: Build Manual Certificate Fulfilment

**As an** operations user, **I want** to upload certificates to paid orders **so that** customers can receive their policy documents.

**Discipline:** Frontend, Backend, Ops  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Certificate can only be uploaded to paid or certificate-pending orders.
- Admin can enter provider policy number.
- Admin can upload certificate PDF.
- System stores certificate securely.
- System marks certificate as issued and then fulfilled.
- Certificate email is sent to customer.

**Tasks:**

- Implement secure file upload.
- Validate PDF file type and size.
- Add policy number field.
- Implement certificate model and storage reference.
- Add fulfilment action to admin order detail.
- Trigger certificate issued email.
- Add audit logs.
- Test certificate upload and email delivery.

### M3-S7: Build Fulfilment Queue and SLA Alerts

**As an** operations user, **I want** to see orders requiring fulfilment **so that** certificate delays are addressed quickly.

**Discipline:** Frontend, Backend, Ops  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Admin dashboard shows paid orders awaiting provider submission or certificate.
- Queue can be filtered by provider, age, and status.
- Orders breaching configured SLA are highlighted.
- Operations can open an order directly from the queue.

**Tasks:**

- Define SLA thresholds.
- Implement fulfilment queue query.
- Build queue UI.
- Add status and age filters.
- Add breach highlighting.
- Add dashboard count widgets.
- QA queue sorting and filters.

### M3-S8: Implement Audit Logging

**As a** compliance stakeholder, **I want** sensitive admin actions logged **so that** operational changes are traceable.

**Discipline:** Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Audit logs capture actor, action, entity, entity ID, timestamp, and before/after metadata where appropriate.
- Provider, product, price, order, certificate, agent, role, and permission changes are logged.
- Audit logs are viewable by authorized admin users.

**Tasks:**

- Implement audit log service.
- Add audit calls to admin mutations.
- Build audit log list API.
- Build audit log UI.
- Add filters by actor, entity, action, and date.
- Add tests for logged actions.

## 8. Milestone M4: Agent MVP

### M4-S1: Design Agent Portal

**As an** agent, **I want** a simple portal **so that** I can create quote links and track outcomes.

**Discipline:** Design  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- Designs include agent sign-in, dashboard, create quote, quote link confirmation, and quote/order list.
- Designs are desktop and mobile responsive.
- Designs show suspended or pending account states.

**Tasks:**

- Create agent flow map.
- Design agent dashboard.
- Design quote creation form.
- Design quote link generated state.
- Design quote and order list.
- Review with product and engineering.

### M4-S2: Implement Agent Account Management

**As an** admin, **I want** to manage agent accounts **so that** only approved agents can create tracked quote links.

**Discipline:** Backend, Frontend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Admin can create, approve, suspend, and edit agent profiles.
- Agent status controls portal access.
- Agent profile includes agency, name, email, and status.
- Agent changes are audit logged.

**Tasks:**

- Create agent model.
- Build admin agent list.
- Build agent create/edit form.
- Implement status changes.
- Add permission checks.
- Add audit logging.
- Add tests for suspended access.

### M4-S3: Implement Agent Sign-In and Dashboard

**As an** agent, **I want** to sign in and see my quote activity **so that** I can track student outcomes.

**Discipline:** Frontend, Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Approved agents can sign in.
- Pending or suspended agents cannot create quote links.
- Dashboard shows recent quotes and order statuses.
- Agent can only see own attributed records.

**Tasks:**

- Implement agent authentication.
- Protect agent routes.
- Build agent dashboard UI.
- Build agent quote/order summary API.
- Add access control by agent ID.
- QA agent permissions.

### M4-S4: Build Agent Quote Link Creation

**As an** agent, **I want** to create a tracked quote link **so that** a student can complete purchase and attribution is preserved.

**Discipline:** Frontend, Backend  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Agent can enter quote inputs.
- System creates quote with agent attribution.
- System generates a shareable quote link.
- Student purchase through the link remains attributed to the agent.
- `agent_quote_created` event is tracked.

**Tasks:**

- Reuse quote form for agent context.
- Add agent attribution to quote model.
- Generate shareable quote URL.
- Preserve attribution through results, application, and order.
- Add copy-link UI.
- Add analytics event.
- Add tests for attribution persistence.

### M4-S5: Build Agent Outcome Tracking

**As an** agent, **I want** to view quote and order status **so that** I can follow up with students.

**Discipline:** Frontend, Backend  
**Priority:** Should  
**Estimate:** M

**Acceptance Criteria:**

- Agent can see quote created date, quote status, selected provider, order status, and certificate status where permitted.
- Agent cannot see sensitive application details unless explicitly allowed.
- List can be filtered by date and status.

**Tasks:**

- Define safe agent-visible fields.
- Build agent quote/order list API.
- Build list UI.
- Add filters.
- Add empty states.
- Add permission tests.

## 9. Milestone M5: Reporting, Security, and Launch Readiness

### M5-S1: Build MVP Reporting

**As a** product or operations stakeholder, **I want** MVP reports **so that** I can monitor launch performance.

**Discipline:** Backend, Frontend, Analytics  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Quote funnel report is available.
- Conversion report is available.
- Provider sales report is available.
- Certificate SLA report is available.
- Agent activity report is available.
- Reports can be filtered by date range.

**Tasks:**

- Define report queries and metrics.
- Build report APIs.
- Build report dashboard UI.
- Add date range filters.
- Validate report numbers against raw data.
- Add export option if required.

### M5-S2: Complete Transactional Email Logging

**As an** operations user, **I want** email delivery visibility **so that** failed communications can be investigated.

**Discipline:** Backend, Ops  
**Priority:** Must  
**Estimate:** S

**Acceptance Criteria:**

- Payment and certificate emails are logged.
- Email logs show recipient, template, status, provider reference, and timestamp.
- Failed emails appear in admin order detail.

**Tasks:**

- Create email log model.
- Add logging to email send service.
- Display email logs in admin order detail.
- Add failure handling.
- Test failed email scenario.

### M5-S3: Security and Privacy Hardening

**As a** security reviewer, **I want** sensitive workflows hardened **so that** customer and policy data is protected.

**Discipline:** Engineering, Security, QA  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Private file access uses signed or authenticated URLs.
- Admin and agent authorization is tested.
- Payment raw card data is not stored.
- Sensitive inputs are server-side validated.
- Basic security review findings are resolved or risk-accepted.

**Tasks:**

- Review authentication and authorization flows.
- Review certificate storage and access.
- Review payment implementation.
- Review audit logging coverage.
- Add automated permission tests.
- Add rate limiting for sensitive endpoints.
- Resolve security review findings.

### M5-S4: Performance and Accessibility QA

**As a** user, **I want** the platform to be fast and accessible **so that** I can complete purchase regardless of device or assistive needs.

**Discipline:** Frontend, QA, Design  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Public pages pass agreed performance thresholds.
- Quote and checkout forms are keyboard accessible.
- Form labels and error states are screen-reader friendly.
- Mobile layouts do not overflow or hide critical actions.

**Tasks:**

- Run performance audit on public pages.
- Run accessibility audit on quote and checkout.
- Test keyboard-only navigation.
- Test mobile viewport layouts.
- Fix identified issues.
- Re-run QA checks.

### M5-S5: End-to-End MVP QA

**As a** product team, **I want** the full MVP journey tested **so that** launch-blocking defects are found before release.

**Discipline:** QA, Product, Engineering, Ops  
**Priority:** Must  
**Estimate:** L

**Acceptance Criteria:**

- Student quote-to-certificate happy path passes.
- Failed payment path passes.
- No-results quote path passes.
- Admin price import path passes.
- Manual certificate fulfilment path passes.
- Agent tracked quote path passes.
- Permission tests pass.

**Tasks:**

- Create E2E test plan.
- Create test data.
- Execute student happy path.
- Execute payment failure path.
- Execute admin price import path.
- Execute certificate upload path.
- Execute agent attribution path.
- Log and triage defects.
- Re-test resolved defects.

### M5-S6: Production Launch Readiness

**As a** product owner, **I want** launch readiness confirmed **so that** the MVP can go live with known operational controls.

**Discipline:** Product, Engineering, Ops, Legal, QA  
**Priority:** Must  
**Estimate:** M

**Acceptance Criteria:**

- Launch checklist from PRD is complete or exceptions are approved.
- Production provider prices are imported and validated.
- Payment gateway production credentials are configured.
- Transactional emails are approved.
- Support and refund operating processes are documented.
- Monitoring and alerting are live.
- Go/no-go decision is recorded.

**Tasks:**

- Complete launch checklist.
- Validate production configuration.
- Confirm legal copy approval.
- Confirm provider disclosure links.
- Confirm support handoff process.
- Run production smoke test.
- Hold go/no-go review.

## 10. Milestone M6: Post-MVP Enhancements

### M6-S1: Customer Magic-Link Order Lookup

**As a** customer, **I want** to retrieve my order by email verification **so that** I can download my certificate or check status.

**Discipline:** Design, Frontend, Backend  
**Priority:** Should  
**Estimate:** L

**Acceptance Criteria:**

- Customer can request access using email and order reference.
- System sends expiring magic link.
- Customer can view own order status, receipt, and certificate.
- Unauthorized access is blocked.

**Tasks:**

- Design order lookup flow.
- Implement magic-link token model.
- Implement request access endpoint.
- Implement email template.
- Build customer order page.
- Add security tests.

### M6-S2: Customer Request Workflows

**As a** customer, **I want** to request corrections, refunds, cancellations, or certificate resend **so that** I can resolve post-purchase issues.

**Discipline:** Design, Frontend, Backend, Ops  
**Priority:** Should  
**Estimate:** L

**Acceptance Criteria:**

- Customer can submit date correction request.
- Customer can submit refund/cancellation request.
- Customer can request certificate resend.
- Operations can view and update request status.

**Tasks:**

- Design customer request forms.
- Create request data model.
- Build customer request UI.
- Build operations queue.
- Add status transitions.
- Add notification templates.

### M6-S3: Multilingual Content Framework

**As a** non-English-speaking student, **I want** to use the platform in my preferred language **so that** I can understand quote and purchase steps.

**Discipline:** Design, Frontend, Backend, Content  
**Priority:** Should  
**Estimate:** L

**Acceptance Criteria:**

- UI supports locale switching.
- Translation strings are separated from application logic.
- English plus prioritized launch languages can be configured.
- Legal and disclosure translations support review status.

**Tasks:**

- Select i18n framework.
- Define locale routing.
- Extract UI strings.
- Add language selector.
- Define translation workflow.
- Add translation review metadata.
- QA selected languages.

### M6-S4: Provider API Pricing and Submission

**As an** operations team, **I want** provider API automation **so that** manual fulfilment and stale pricing risk decrease.

**Discipline:** Backend, Integrations, QA  
**Priority:** Should  
**Estimate:** XL

**Acceptance Criteria:**

- Provider integration can retrieve prices where supported.
- Provider integration can submit paid applications where supported.
- Integration failures are queued, retried, and visible to operations.
- Manual fallback remains available.

**Tasks:**

- Review provider API documentation.
- Define provider adapter interface.
- Implement pricing adapter for first provider.
- Implement submission adapter for first provider.
- Add retry and error handling.
- Add integration health reporting.
- QA against provider sandbox.

### M6-S5: Agent Commission Ledger

**As an** agent manager, **I want** commission tracking **so that** agent payouts can be calculated and reviewed.

**Discipline:** Product, Backend, Frontend, Finance  
**Priority:** Should  
**Estimate:** L

**Acceptance Criteria:**

- Admin can configure commission rules.
- Purchases generate commission ledger entries.
- Refunded or cancelled policies update commission eligibility.
- Agents or finance users can view commission reports.

**Tasks:**

- Define commission rules with finance.
- Create commission rule model.
- Create commission ledger model.
- Implement commission calculation service.
- Build admin commission rule UI.
- Build commission report.
- Add tests for refunds and cancellations.

### M6-S6: Advanced Results Comparison

**As a** student, **I want** richer comparison tools **so that** I can choose a policy based on benefits, not price alone.

**Discipline:** Design, Frontend, Backend, Content  
**Priority:** Could  
**Estimate:** M

**Acceptance Criteria:**

- User can filter by provider and key benefit.
- User can compare selected policies side by side.
- Result cards can show recommended or fastest certificate delivery where data is available.

**Tasks:**

- Define benefit comparison data fields.
- Design filter and compare interactions.
- Implement comparison data model.
- Build filter controls.
- Build side-by-side comparison UI.
- Add analytics for compare interactions.

## 11. Cross-Cutting Design Tasks

| ID | Task | Related Milestones | Owner |
| --- | --- | --- | --- |
| UX-001 | Create design system basics: typography, color, spacing, buttons, form controls, tables, alerts, and status badges | M0-M5 | Design |
| UX-002 | Create responsive layout rules for public, checkout, admin, and agent screens | M0-M5 | Design |
| UX-003 | Create form validation copy and error patterns | M1-M2 | Design, Content |
| UX-004 | Create empty, loading, success, and error states for all key flows | M1-M5 | Design |
| UX-005 | Create admin status badge language and color mapping | M3-M5 | Design, Ops |
| UX-006 | Review accessibility of final designs before implementation | M1-M5 | Design, QA |
| UX-007 | Prepare content placeholders for legal, provider, FAQ, contact, and transactional emails | M1-M5 | Content, Legal |

## 12. Cross-Cutting Engineering Tasks

| ID | Task | Related Milestones | Owner |
| --- | --- | --- | --- |
| ENG-001 | Set up repository structure, code standards, linting, formatting, and CI | M0 | Engineering |
| ENG-002 | Set up database migrations and seed strategy | M0-M1 | Backend |
| ENG-003 | Set up environment configuration and secrets management | M0-M2 | Engineering |
| ENG-004 | Set up authentication/session foundation | M2-M4 | Engineering |
| ENG-005 | Set up file storage for imports and certificates | M3 | Backend |
| ENG-006 | Set up transactional email provider integration | M2-M3 | Backend |
| ENG-007 | Set up analytics provider and event helper | M1-M5 | Frontend, Backend |
| ENG-008 | Set up error tracking and structured logging | M0-M5 | Engineering |
| ENG-009 | Set up automated test framework | M0-M5 | Engineering, QA |
| ENG-010 | Add deployment pipeline for staging and production | M0-M5 | Engineering |

## 13. Suggested Developer Pick-Up Labels

- `area:public-web`
- `area:quote`
- `area:pricing`
- `area:checkout`
- `area:payments`
- `area:admin`
- `area:agent`
- `area:fulfilment`
- `area:analytics`
- `area:security`
- `area:content`
- `discipline:design`
- `discipline:frontend`
- `discipline:backend`
- `discipline:qa`
- `discipline:ops`
- `priority:must`
- `priority:should`
- `priority:could`
- `size:s`
- `size:m`
- `size:l`
- `size:xl`

## 14. Dependency Map

| Dependency | Blocks |
| --- | --- |
| Legal distribution model | Consent, disclosure copy, checkout wording, launch |
| Provider agreements | Provider setup, price tables, disclosure URLs, fulfilment process |
| Payment gateway selection | Payment integration, webhook implementation, launch testing |
| Brand and design direction | Public landing page, checkout, agent portal, admin styling |
| Price table format | Pricing engine, import validation, quote results |
| Email provider selection | Payment confirmation, certificate email, launch readiness |
| File storage decision | Price imports, certificates, secure downloads |
| Authentication strategy | Admin portal, agent portal, customer lookup |
| Support process | Refund/cancellation flow, delayed certificate handling |

## 15. MVP Critical Path

1. Confirm scope, legal dependencies, architecture, and data model.
2. Build provider/product/price foundation.
3. Build public quote form and quote API.
4. Build pricing engine and results page.
5. Build application form and order state machine.
6. Integrate card payment and idempotent webhooks.
7. Build admin price import and order management.
8. Build manual certificate fulfilment and email delivery.
9. Build basic agent quote attribution.
10. Complete reporting, security, QA, and launch readiness.

