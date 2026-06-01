# Developer Task Backlog: OSHC Comparison and Purchase Platform

## 1. Document Control

| Field | Value |
| --- | --- |
| Product | OSHC comparison, purchase, and certificate delivery platform |
| Source documents | `docs/BRD_OSHC_Comparison_Platform.md`, `docs/PRD_OSHC_Comparison_Platform.md`, `docs/MILESTONES_STORIES_TASKS_OSHC_Platform.md` |
| Prepared on | 2026-06-01 |
| Document type | Pick-up-ready task backlog |
| Status | Draft |

## 2. Status Values

Use these values when updating task progress:

- `Todo`
- `In Progress`
- `Blocked`
- `In Review`
- `Done`
- `Deferred`

## 3. Task Template

```md
### TASK-000: Task title

Status: Todo
Milestone: M0
Area: Area name
Discipline: Product | Design | Frontend | Backend | QA | DevOps | Security | Ops
Priority: Must | Should | Could
Estimate: S | M | L | XL
Depends on: None

Description:
Short description of the task outcome.

Acceptance Criteria:
- Criteria 1.
- Criteria 2.
- Criteria 3.
```

## 3.1 Architecture and Schema References

- Database schema and ER diagram: `docs/DATABASE_SCHEMA_OSHC_Platform.md`
- Swagger/OpenAPI API specification: `docs/API_SPEC_OSHC_Platform.yaml`

## 4. M0: Discovery and Foundations

### TASK-001: Confirm MVP Scope

Status: Todo  
Milestone: M0  
Area: Product Planning  
Discipline: Product  
Priority: Must  
Estimate: S  
Depends on: None

Description:
Review the BRD and PRD with stakeholders and confirm the exact MVP feature boundary.

Acceptance Criteria:
- MVP features are documented and approved.
- Post-MVP features are listed separately.
- Scope decisions are recorded in a decision log.
- Any disputed scope item has an owner and due date.

### TASK-002: Create Delivery Board Structure

Status: Todo  
Milestone: M0  
Area: Product Planning  
Discipline: Product  
Priority: Must  
Estimate: S  
Depends on: TASK-001

Description:
Create the team delivery board structure in the selected tool.

Acceptance Criteria:
- Board has columns matching approved status values.
- Board has milestone labels from M0 to M6.
- Board has area, discipline, priority, and size labels.
- At least the MVP tasks are loaded into the board.

### TASK-003: Create Product Decision Log

Status: Todo  
Milestone: M0  
Area: Product Planning  
Discipline: Product  
Priority: Must  
Estimate: S  
Depends on: None

Description:
Create a decision log for open product, legal, provider, and technical questions.

Acceptance Criteria:
- Decision log has fields for topic, decision, owner, date, and status.
- PRD open questions are added.
- Launch-blocking decisions are marked clearly.
- Decision log is accessible to product, design, engineering, and operations.

### TASK-004: Select Application Architecture

Status: Todo  
Milestone: M0  
Area: Architecture  
Discipline: Engineering  
Priority: Must  
Estimate: M  
Depends on: TASK-001

Description:
Select the target technical architecture for the public, admin, and agent web application.

Acceptance Criteria:
- Application framework is selected.
- Hosting approach is selected.
- Public, admin, and agent app boundaries are defined.
- API, database, background job, file storage, email, analytics, and payment components are included.
- Architecture is reviewed by engineering lead and product owner.

### TASK-005: Define Environment Strategy

Status: Todo  
Milestone: M0  
Area: Architecture  
Discipline: DevOps  
Priority: Must  
Estimate: S  
Depends on: TASK-004

Description:
Define local, staging, and production environment requirements.

Acceptance Criteria:
- Environment list is documented.
- Required environment variables are listed.
- Secrets management approach is defined.
- Deployment promotion path is defined.
- Staging can be used for payment and email sandbox testing.

### TASK-006: Define Core Data Model

Status: Done  
Milestone: M0  
Area: Data Model  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-004

Description:
Define the MVP database entities and relationships.

Output:
Draft schema and ER diagram are available in `docs/DATABASE_SCHEMA_OSHC_Platform.md`.

Acceptance Criteria:
- Data model includes provider, product, price table, price row, quote, quote result, application, order, payment, certificate, agent, and audit log.
- Required fields are documented for each entity.
- Relationships and cardinality are documented.
- Sensitive fields are identified.
- Engineering review is completed.

### TASK-007: Define Order State Machine

Status: Done  
Milestone: M0  
Area: Order Management  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-006

Description:
Define valid order states and transitions from quote through fulfilment.

Output:
Draft order state machine is documented in `docs/DATABASE_SCHEMA_OSHC_Platform.md`.

Acceptance Criteria:
- Order states from PRD are documented.
- Valid transitions are listed.
- Invalid transitions are identified.
- Transition side effects are documented.
- Admin-visible state history requirements are documented.

### TASK-008: Define Payment State Handling

Status: Done  
Milestone: M0  
Area: Payments  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-007

Description:
Define payment states, webhook handling, and idempotency requirements.

Output:
Draft payment state handling and webhook idempotency model are documented in `docs/DATABASE_SCHEMA_OSHC_Platform.md`.

Acceptance Criteria:
- Payment states are documented.
- Gateway event types required for MVP are listed.
- Webhook idempotency key strategy is documented.
- Duplicate event behavior is documented.
- Failed payment recovery behavior is documented.

### TASK-009: Define Certificate Fulfilment States

Status: Done  
Milestone: M0  
Area: Fulfilment  
Discipline: Backend, Ops  
Priority: Must  
Estimate: S  
Depends on: TASK-007

Description:
Define certificate fulfilment states and operational handling.

Output:
Draft certificate fulfilment states are documented in `docs/DATABASE_SCHEMA_OSHC_Platform.md`.

Acceptance Criteria:
- Certificate pending, issued, sent, failed, and fulfilled states are defined.
- Manual upload requirements are documented.
- SLA breach calculation is documented.
- Admin visibility requirements are documented.
- Email trigger points are documented.

### TASK-010: Define Legal Consent Requirements

Status: Todo  
Milestone: M0  
Area: Compliance  
Discipline: Product, Legal  
Priority: Must  
Estimate: M  
Depends on: TASK-001

Description:
Define required customer consents for checkout.

Acceptance Criteria:
- Required consent types are listed.
- Consent display placement is documented.
- Consent record fields are defined.
- Document versioning requirements are defined.
- Legal owner signs off on requirements.

### TASK-011: Define Provider Disclosure Requirements

Status: Todo  
Milestone: M0  
Area: Compliance  
Discipline: Product, Legal  
Priority: Must  
Estimate: M  
Depends on: TASK-001

Description:
Define how provider disclosure and product document links must appear in the product.

Acceptance Criteria:
- Required disclosure links are listed.
- Disclosure placement is defined for results and checkout.
- Unsupported recommendation language is identified.
- Provider logo and product name usage requirements are documented.
- Legal and provider-dependency gaps are tracked.

### TASK-012: Map Student Quote-to-Purchase Flow

Status: Todo  
Milestone: M0  
Area: UX  
Discipline: Design  
Priority: Must  
Estimate: S  
Depends on: TASK-001

Description:
Create a user flow diagram for the student quote-to-certificate journey.

Acceptance Criteria:
- Flow includes landing, quote, results, application, consent, payment, confirmation, and certificate delivery.
- Error and empty states are represented.
- Flow identifies handoffs between frontend, backend, payment, and email.
- Product and engineering approve the flow.

### TASK-013: Map Admin Operations Flows

Status: Todo  
Milestone: M0  
Area: UX  
Discipline: Design, Ops  
Priority: Must  
Estimate: S  
Depends on: TASK-001

Description:
Create user flows for price import, order search, and certificate fulfilment.

Acceptance Criteria:
- Price import flow includes upload, validation, review, and publish.
- Fulfilment flow includes paid order, policy number entry, certificate upload, email send, and fulfilled status.
- Exception states are included.
- Operations stakeholder reviews the flows.

### TASK-014: Create Initial Design System

Status: Todo  
Milestone: M0  
Area: Design System  
Discipline: Design  
Priority: Must  
Estimate: M  
Depends on: TASK-012

Description:
Define initial visual foundations and reusable UI patterns.

Acceptance Criteria:
- Typography, colors, spacing, buttons, inputs, tables, alerts, and status badges are defined.
- Responsive layout rules are documented.
- Form validation pattern is documented.
- Accessibility notes are included.
- Components are ready for frontend implementation.

### TASK-015: Set Up Repository Standards

Status: Todo  
Milestone: M0  
Area: Engineering Setup  
Discipline: Engineering  
Priority: Must  
Estimate: M  
Depends on: TASK-004

Description:
Set up codebase standards and baseline tooling.

Acceptance Criteria:
- Project structure is created.
- Linting and formatting are configured.
- Type checking or equivalent static checks are configured where applicable.
- Test framework is configured.
- CI runs checks on pull requests.

### TASK-016A: Create MVP API Specification

Status: Done  
Milestone: M0  
Area: API Design  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-006, TASK-007, TASK-008, TASK-009

Description:
Create a Swagger/OpenAPI contract for MVP public, checkout, admin, agent, payment webhook, reporting, and fulfilment endpoints.

Output:
Swagger/OpenAPI-compatible API spec is available in `docs/API_SPEC_OSHC_Platform.yaml`.

Acceptance Criteria:
- API spec documents endpoint paths, methods, auth requirements, request bodies, responses, validation errors, and status codes.
- Spec covers quote, results, application draft, order, payment, admin provider/product/price/order, certificate, fulfilment queue, agent quote, and reporting endpoints.
- Error response format is standardized.
- Spec is reviewable in Swagger UI or Swagger Editor.
- Spec is stored in OpenAPI format.

## 5. M1: Public Quote Experience

### TASK-016: Design Public Landing Page

Status: Todo  
Milestone: M1  
Area: Public Web  
Discipline: Design  
Priority: Must  
Estimate: M  
Depends on: TASK-014

Description:
Create high-fidelity designs for the public landing page.

Acceptance Criteria:
- Desktop and mobile designs are complete.
- Quote form appears prominently.
- Trust markers and support contact area are included.
- Header and footer navigation are included.
- Design is reviewed by product and engineering.

### TASK-017: Implement Public Landing Page Layout

Status: Todo  
Milestone: M1  
Area: Public Web  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-016

Description:
Build the responsive landing page shell.

Acceptance Criteria:
- Page renders on desktop, tablet, and mobile.
- Header, navigation, main content, and footer are implemented.
- Footer links include FAQ, providers, contact, privacy, and terms.
- Page matches approved design.
- No horizontal overflow occurs on mobile.

### TASK-018: Add Public Page SEO Metadata

Status: Todo  
Milestone: M1  
Area: Public Web  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-017

Description:
Add MVP SEO metadata to the landing page.

Acceptance Criteria:
- Page has title and meta description.
- Canonical URL behavior is defined or implemented.
- Social preview metadata is added where supported.
- Metadata can be updated without changing quote logic.

### TASK-019: Design Quote Form Controls

Status: Todo  
Milestone: M1  
Area: Quote  
Discipline: Design  
Priority: Must  
Estimate: S  
Depends on: TASK-014

Description:
Design adult selector, child selector, date inputs, validation states, and guidance copy.

Acceptance Criteria:
- Adult and child selector states are designed.
- Date input empty, filled, focused, and invalid states are designed.
- Inline validation pattern is shown.
- Guidance copy placement is shown.
- Mobile layout is included.

### TASK-020: Implement Adult and Child Selectors

Status: Todo  
Milestone: M1  
Area: Quote  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-019

Description:
Build the quote form controls for household composition.

Acceptance Criteria:
- Adult selector supports values 1 and 2.
- Child selector supports values 0 through 10.
- Controls are keyboard accessible.
- Controls have accessible labels.
- Selected values are included in form state.

### TASK-021: Implement Quote Date Inputs

Status: Todo  
Milestone: M1  
Area: Quote  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-019

Description:
Build policy start date and end date inputs.

Acceptance Criteria:
- User can manually enter start and end dates.
- Inputs support focus and invalid states.
- End date before or equal to start date is flagged.
- Date guidance is displayed near inputs.
- Mobile keyboard behavior is acceptable.

### TASK-022: Implement Client-Side Quote Validation

Status: Todo  
Milestone: M1  
Area: Quote  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-020, TASK-021

Description:
Validate quote form fields before API submission.

Acceptance Criteria:
- Missing adult, child, start date, and end date values are blocked.
- Invalid date ranges are blocked.
- Errors appear inline beside relevant fields.
- Error copy is specific and actionable.
- Submit button behavior is clear during validation and loading.

### TASK-023: Create Quote Database Model

Status: Done  
Milestone: M1  
Area: Quote  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-006

Description:
Create the quote storage model.

Acceptance Criteria:
- Quote stores session ID, adults, children, start date, end date, cover type, channel, agent ID if present, and expiry.
- Required fields are constrained.
- Created and updated timestamps are stored.
- Migration or schema change is included.
- Model tests or schema validation are included.

### TASK-024: Implement Cover Type Calculation

Status: Done  
Milestone: M1  
Area: Quote  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-023

Description:
Implement cover type mapping for household composition.

Acceptance Criteria:
- 1 adult and 0 children maps to single.
- 2 adults and 0 children maps to couple.
- 1 adult and 1 or more children maps to single-parent family.
- 2 adults and 1 or more children maps to family.
- Unit tests cover all mappings and invalid inputs.

### TASK-025: Implement Quote Validation API

Status: Done  
Milestone: M1  
Area: Quote  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-023, TASK-024

Description:
Create the server endpoint that validates quote inputs and creates quote records.

Acceptance Criteria:
- Endpoint accepts adults, children, start date, and end date.
- Invalid inputs return structured validation errors.
- Valid inputs create a quote record.
- Cover type is calculated and stored.
- API tests cover success and failure cases.

### TASK-026: Integrate Quote Form With API

Status: Todo  
Milestone: M1  
Area: Quote  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-022, TASK-025

Description:
Connect the public quote form to the quote validation API.

Acceptance Criteria:
- Submitting valid inputs calls the API.
- API validation errors are rendered inline.
- Successful submission navigates to results using the created quote ID.
- Loading state prevents duplicate submissions.
- Network failure shows a recoverable error.

### TASK-027: Create Provider Model

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-006

Description:
Create provider storage for quote result display and filtering.

Acceptance Criteria:
- Provider stores code, name, logo reference, status, disclosure URLs, and support metadata.
- Provider status can be active or inactive.
- Required fields are constrained.
- Seed provider data can be created for development.

### TASK-028: Create Product Model

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-027

Description:
Create product storage linked to providers.

Acceptance Criteria:
- Product stores provider ID, code, name, supported cover types, status, fulfilment mode, and disclosure URLs.
- Product belongs to exactly one provider.
- Inactive products can be excluded from pricing.
- Development seed data includes products for each sample provider.

### TASK-029: Create Price Table and Price Row Models

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-028

Description:
Create price table and price row storage for MVP pricing.

Acceptance Criteria:
- Price table stores provider, version, effective dates, source file reference, and status.
- Price row stores product, cover type, duration band or date band, premium, currency, and channel.
- Price rows are linked to a price table.
- Active prices can be queried by provider, product, cover type, and date.

### TASK-030: Add Provider/Product/Price Seed Data

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-027, TASK-028, TASK-029

Description:
Add development seed data for providers, products, and prices.

Acceptance Criteria:
- Seed data creates at least three providers.
- Each provider has at least one product.
- Each product has price rows for supported MVP cover types.
- Seed data supports successful quote result generation.
- Seed data can be reset in local development.

### TASK-031: Implement Duration Calculation

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-025

Description:
Calculate policy duration from quote start and end dates according to MVP pricing rules.

Acceptance Criteria:
- Duration calculation is deterministic.
- Same date inputs always produce the same duration value.
- Invalid date ranges are rejected.
- Boundary cases are unit tested.
- Pricing engine can use the calculated duration.

### TASK-032: Implement Active Product Price Lookup

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: L  
Depends on: TASK-029, TASK-031

Description:
Implement service that returns eligible prices for a quote.

Acceptance Criteria:
- Inactive providers are excluded.
- Inactive products are excluded.
- Products not supporting the quote cover type are excluded.
- Price rows outside effective dates are excluded.
- Response includes provider, product, premium, total, currency, and disclosure metadata.

### TASK-033: Create Quote Result Snapshot Model

Status: Done  
Milestone: M1  
Area: Pricing  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-032

Description:
Persist customer-facing quote result snapshots.

Acceptance Criteria:
- Quote result is linked to quote and product.
- Snapshot stores provider/product display values, premium, fees, total, currency, expiry, and metadata.
- Result snapshots are not changed by later price table updates.
- Tests verify snapshot persistence.

### TASK-034: Implement Results API

Status: Done  
Milestone: M1  
Area: Results  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-032, TASK-033

Description:
Create API endpoint to fetch quote results.

Acceptance Criteria:
- Endpoint returns results for a valid quote ID.
- Endpoint creates snapshots if not already created.
- Endpoint returns no-results response when no products match.
- Endpoint includes quote summary.
- Endpoint handles expired or missing quote IDs.

### TASK-035: Design Results Page

Status: Todo  
Milestone: M1  
Area: Results  
Discipline: Design  
Priority: Must  
Estimate: M  
Depends on: TASK-016, TASK-019

Description:
Design the quote results page.

Acceptance Criteria:
- Result card/list design includes provider, product, price, cover type, key inclusions, delivery note, and disclosure links.
- Sort controls are designed.
- Quote summary and edit interaction are designed.
- Empty state is designed.
- Mobile layout is included.

### TASK-036: Build Results List UI

Status: Todo  
Milestone: M1  
Area: Results  
Discipline: Frontend  
Priority: Must  
Estimate: L  
Depends on: TASK-034, TASK-035

Description:
Build the results page UI.

Acceptance Criteria:
- Results render from the results API.
- Results show provider, product, total price, cover type, delivery note, and disclosure links.
- Empty state appears when no results are available.
- Page is readable on mobile.
- Loading and error states are implemented.

### TASK-037: Add Results Sorting

Status: Todo  
Milestone: M1  
Area: Results  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-036

Description:
Add sorting controls for quote results.

Acceptance Criteria:
- User can sort by lowest price.
- User can sort by provider name.
- Sort state is visible to the user.
- Sorting works without refetching if data is already available.
- Sorting does not mutate result snapshot data.

### TASK-038: Implement Edit Quote From Results

Status: Todo  
Milestone: M1  
Area: Results  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-026, TASK-036

Description:
Allow users to change quote inputs from the results page and regenerate results.

Acceptance Criteria:
- User can open quote edit controls from results.
- Updated values are validated.
- New quote or updated quote results are generated.
- Results page reflects updated inputs.
- Invalid edits show clear errors.

### TASK-039: Implement Policy Selection Action

Status: Todo  
Milestone: M1  
Area: Results  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-036

Description:
Allow users to select a policy and continue to checkout.

Acceptance Criteria:
- Select action stores selected quote result.
- User is routed to application checkout.
- Expired quote results cannot be selected.
- Missing result IDs show recoverable errors.
- `policy_selected` analytics event is emitted.

### TASK-040: Track Quote Analytics Events

Status: Todo  
Milestone: M1  
Area: Analytics  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-026, TASK-036

Description:
Track MVP quote funnel events.

Acceptance Criteria:
- `quote_started` is tracked.
- `quote_submitted` is tracked.
- `quote_results_viewed` is tracked.
- Events include session ID and quote ID where available.
- Events are validated in staging or local analytics logs.

## 6. M2: Application and Checkout

### TASK-041: Design Checkout Flow

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Design  
Priority: Must  
Estimate: M  
Depends on: TASK-039

Description:
Design the full application and checkout flow.

Acceptance Criteria:
- Designs cover applicant, contact, visa/study, dependant, review, consent, and payment steps.
- Desktop and mobile layouts are included.
- Validation, loading, and error states are included.
- Provider disclosures and consent placement are shown.
- Product, legal, and engineering review is complete.

### TASK-042: Create Application Draft Model

Status: Done  
Milestone: M2  
Area: Checkout  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-006, TASK-039

Description:
Create storage for application draft data.

Acceptance Criteria:
- Application draft links to quote and selected quote result.
- Applicant, contact, visa/study, and dependant data can be stored.
- Validation status is stored.
- Created and updated timestamps are stored.
- Sensitive fields are handled according to data model requirements.

### TASK-043: Implement Application Draft API

Status: Done  
Milestone: M2  
Area: Checkout  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-042

Description:
Create APIs to create and update checkout application drafts.

Acceptance Criteria:
- API creates an application draft for selected quote result.
- API updates partial application data.
- API validates required fields server-side.
- API supports dependant data for applicable cover types.
- API tests cover single, couple, single-parent family, and family cases.

### TASK-044: Build Applicant Details Form

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-041, TASK-043

Description:
Build the checkout section for primary applicant details.

Acceptance Criteria:
- Form captures legal first name, legal family name, date of birth, nationality, and gender where required.
- Required fields show inline validation.
- Form saves to application draft.
- Existing draft values can be reloaded.
- Mobile layout is usable.

### TASK-045: Build Contact Details Form

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-041, TASK-043

Description:
Build the checkout section for customer contact details.

Acceptance Criteria:
- Form captures email and phone.
- Address fields are shown according to MVP provider requirements.
- Email format validation is applied.
- Contact data saves to application draft.
- Validation errors are clear and field-specific.

### TASK-046: Build Visa and Study Details Form

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-041, TASK-043

Description:
Build the checkout section for visa and education details.

Acceptance Criteria:
- Form captures visa type or intended visa type.
- Form captures course or program name.
- Form captures institution name.
- Optional student ID and course dates are supported if configured.
- Form saves to application draft.

### TASK-047: Build Dependant Details Form

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-041, TASK-043

Description:
Build dependant data capture for couple, single-parent family, and family cover.

Acceptance Criteria:
- Dependant section appears only when cover type requires it.
- Required dependant fields are shown.
- Multiple children can be entered up to the quote child count.
- Dependant validation is applied before payment.
- Dependant data saves to application draft.

### TASK-048: Build Checkout Review Screen

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-044, TASK-045, TASK-046, TASK-047

Description:
Build the review screen before payment.

Acceptance Criteria:
- Selected provider, product, cover type, dates, and price are displayed.
- Applicant and dependant summary is displayed.
- User can return to edit previous sections.
- Final amount is clearly shown.
- Disclosure and consent section is included or linked.

### TASK-049: Create Consent Model

Status: Done  
Milestone: M2  
Area: Compliance  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-010

Description:
Create storage for customer consent records.

Acceptance Criteria:
- Consent record stores order/application context, consent type, document version, timestamp, and IP/user context where available.
- Consent types can include terms, privacy, refund, and provider disclosure.
- Consent records are immutable after creation.
- Consent records can be retrieved for admin order detail.

### TASK-050: Implement Consent UI and Validation

Status: Todo  
Milestone: M2  
Area: Compliance  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-048, TASK-049

Description:
Require users to accept required disclosures before payment.

Acceptance Criteria:
- Required consent checkboxes appear before payment.
- Provider disclosure links are visible.
- Payment is blocked until required consents are accepted.
- Accepted consents are saved with document version and timestamp.
- Consent validation is enforced server-side.

### TASK-051: Create Order Model

Status: Done  
Milestone: M2  
Area: Order Management  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-007, TASK-043

Description:
Create order storage linked to application and quote result.

Acceptance Criteria:
- Order stores application ID, quote result ID, status, amount, currency, channel, and agent ID where applicable.
- Order reference is unique and customer-safe.
- Current state is stored.
- Created and updated timestamps are stored.
- Schema supports state history.

### TASK-052: Implement Order Creation Service

Status: Done  
Milestone: M2  
Area: Order Management  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-051

Description:
Create service that turns a validated application into an order.

Acceptance Criteria:
- Order is created only from a valid application and selected quote result.
- Expired quote results cannot create orders.
- Order amount uses quote result snapshot.
- Initial order state is recorded.
- Tests cover valid, invalid, and expired quote scenarios.

### TASK-053: Implement Order State Transition Service

Status: Done  
Milestone: M2  
Area: Order Management  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-051

Description:
Implement controlled order state transitions.

Acceptance Criteria:
- Valid state transitions are enforced.
- Invalid transitions are rejected.
- Transition history records from-state, to-state, actor/system, and timestamp.
- Transition side effects can be hooked in later.
- Unit tests cover valid and invalid transitions.

### TASK-054: Select and Configure Payment Gateway

Status: Todo  
Milestone: M2  
Area: Payments  
Discipline: Engineering, Product  
Priority: Must  
Estimate: S  
Depends on: TASK-008

Description:
Select and configure the MVP payment gateway sandbox.

Acceptance Criteria:
- Payment provider is selected.
- Sandbox account is available.
- Required credentials and webhook signing secret are configured in staging/local environment.
- Supported payment method for MVP is documented.
- PCI responsibility assumptions are documented.

### TASK-055: Create Payment Model

Status: Done  
Milestone: M2  
Area: Payments  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-051, TASK-054

Description:
Create storage for payment attempts and gateway references.

Acceptance Criteria:
- Payment stores order ID, processor, processor reference, amount, currency, status, and timestamps.
- Payment does not store raw card details.
- Multiple attempts can be associated with one order if needed.
- Gateway event IDs can be associated with payment processing.

### TASK-056: Implement Payment Session Creation

Status: Done  
Milestone: M2  
Area: Payments  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-052, TASK-055

Description:
Create backend endpoint to start a payment session.

Acceptance Criteria:
- Endpoint creates payment session for valid order.
- Endpoint rejects missing, expired, or already paid orders.
- Gateway amount matches order amount.
- Payment record is created.
- API returns only safe client-side payment information.

### TASK-057: Build Payment UI

Status: Todo  
Milestone: M2  
Area: Payments  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-048, TASK-056

Description:
Build the checkout payment step.

Acceptance Criteria:
- Payment step displays final amount.
- Payment component uses gateway-supported secure entry.
- Loading and failure states are shown.
- Raw card data is never handled by custom app code.
- Successful client-side payment flow leads to confirmation state.

### TASK-058: Implement Payment Webhook Endpoint

Status: Done  
Milestone: M2  
Area: Payments  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-056

Description:
Process payment gateway webhooks.

Acceptance Criteria:
- Webhook signature is verified.
- Successful payment updates payment status.
- Successful payment transitions order to paid.
- Failed payment updates payment/order state appropriately.
- Unsupported webhook event types are safely ignored or logged.

### TASK-059: Implement Webhook Idempotency

Status: Done  
Milestone: M2  
Area: Payments  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-058

Description:
Prevent duplicate gateway events from creating duplicate side effects.

Acceptance Criteria:
- Gateway event IDs are stored.
- Duplicate events are not processed twice.
- Order fulfilment trigger runs once per successful payment.
- Tests simulate duplicate success and failure events.
- Idempotency failures are logged.

### TASK-060: Build Payment Confirmation Page

Status: Todo  
Milestone: M2  
Area: Checkout  
Discipline: Frontend  
Priority: Must  
Estimate: S  
Depends on: TASK-057, TASK-058

Description:
Show the user confirmation after successful payment.

Acceptance Criteria:
- Page displays order reference.
- Page displays selected provider and product.
- Page explains certificate delivery expectation.
- Page provides support contact path.
- Page handles pending payment confirmation gracefully.

### TASK-061: Configure Transactional Email Provider

Status: Done  
Milestone: M2  
Area: Notifications  
Discipline: Backend, DevOps  
Priority: Must  
Estimate: S  
Depends on: TASK-005

Description:
Set up transactional email provider for MVP emails.

Acceptance Criteria:
- Email provider is selected and configured for local/staging.
- Sender domain or sender address is configured.
- Delivery API credentials are stored securely.
- Test email can be sent from staging/local environment.
- Bounce/failure visibility approach is documented.

### TASK-062: Send Payment Confirmation Email

Status: Done  
Milestone: M2  
Area: Notifications  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-058, TASK-061

Description:
Send payment confirmation after order is paid.

Acceptance Criteria:
- Email sends only after successful payment.
- Email includes order reference, provider/product, amount, and certificate expectation.
- Email delivery attempt is logged.
- Failed email send is visible in logs/admin detail.
- Tests verify email trigger runs once.

### TASK-063: Track Checkout Analytics Events

Status: Todo  
Milestone: M2  
Area: Analytics  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-039, TASK-057, TASK-058

Description:
Track MVP checkout funnel events.

Acceptance Criteria:
- `application_started` is tracked.
- `application_submitted` is tracked.
- `payment_started` is tracked.
- `payment_succeeded` is tracked.
- `payment_failed` is tracked.
- Events include quote ID, order ID where available, provider, product, cover type, amount, and channel.

## 7. M3: Admin Operations

### TASK-064: Design Admin Navigation and Dashboard

Status: Todo  
Milestone: M3  
Area: Admin  
Discipline: Design  
Priority: Must  
Estimate: M  
Depends on: TASK-013, TASK-014

Description:
Design the admin information architecture and dashboard.

Acceptance Criteria:
- Navigation includes dashboard, providers, products, price tables, quotes, orders, payments, certificates, agents, users, and audit logs.
- Dashboard highlights fulfilment and operational exceptions.
- Desktop layout is optimized for scanning.
- Designs are reviewed by operations and engineering.

### TASK-065: Implement Admin Authentication

Status: Done  
Milestone: M3  
Area: Admin Auth  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-015

Description:
Implement secure sign-in for admin users.

Acceptance Criteria:
- Admin users can sign in.
- Invalid credentials are rejected.
- Sessions are created securely.
- Protected admin routes require authentication.
- Authentication events are logged.

### TASK-066: Implement Admin Roles and Permissions

Status: Done  
Milestone: M3  
Area: Admin Auth  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-065

Description:
Implement role-based permission checks for admin users.

Acceptance Criteria:
- Roles include operations, finance, admin, and super admin.
- Backend permission middleware protects sensitive actions.
- Frontend hides or disables unauthorized actions.
- Permission failures are logged.
- Tests cover allowed and denied actions.

### TASK-067: Build Provider Admin List and Form

Status: Done  
Milestone: M3  
Area: Admin Providers  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-027, TASK-066

Description:
Allow admins to manage providers.

Acceptance Criteria:
- Admin can list providers.
- Admin can create and edit provider records.
- Admin can activate and deactivate providers.
- Provider disclosure URLs and logo references can be edited.
- Changes are audit logged.

### TASK-068: Build Product Admin List and Form

Status: Done  
Milestone: M3  
Area: Admin Products  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-028, TASK-066

Description:
Allow admins to manage products.

Acceptance Criteria:
- Admin can list products by provider.
- Admin can create and edit product records.
- Admin can configure supported cover types.
- Admin can activate and deactivate products.
- Changes are audit logged.

### TASK-069: Define CSV Price Import Template

Status: Todo  
Milestone: M3  
Area: Price Import  
Discipline: Backend, Product  
Priority: Must  
Estimate: S  
Depends on: TASK-029

Description:
Define the MVP CSV format for provider price imports.

Acceptance Criteria:
- Template includes provider code, product code, cover type, duration/date band, premium, currency, effective from, effective to, and channel if applicable.
- Example valid CSV is created.
- Example invalid CSV is created for QA.
- Template is reviewed by product and backend.

### TASK-070: Implement Price Import File Upload

Status: Done  
Milestone: M3  
Area: Price Import  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-066, TASK-069

Description:
Allow admins to upload CSV price files.

Acceptance Criteria:
- Admin can select and upload CSV file.
- File type and size are validated.
- Uploaded source file reference is stored.
- Upload failures show clear errors.
- Permission checks apply.

### TASK-071: Implement Price Import Row Validation

Status: Todo  
Milestone: M3  
Area: Price Import  
Discipline: Backend  
Priority: Must  
Estimate: L  
Depends on: TASK-070

Description:
Validate uploaded price table rows.

Acceptance Criteria:
- Required fields are validated.
- Provider and product codes must exist.
- Cover type must be valid.
- Premium must be numeric and non-negative.
- Effective date ranges must be valid.
- Row-level validation errors are returned.

### TASK-072: Implement Price Import Conflict Detection

Status: Todo  
Milestone: M3  
Area: Price Import  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-071

Description:
Detect conflicting active price rows before publishing.

Acceptance Criteria:
- Overlapping rows for same provider, product, cover type, duration/date band, channel, and effective period are detected.
- Conflicts prevent publish.
- Conflict errors identify affected rows.
- Tests cover overlapping and non-overlapping imports.

### TASK-073: Build Price Import Validation Review UI

Status: Todo  
Milestone: M3  
Area: Price Import  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-071, TASK-072

Description:
Show admins validation results before publishing a price import.

Acceptance Criteria:
- UI shows import summary.
- UI shows row-level errors.
- UI prevents publish when errors exist.
- UI allows admin to abandon failed import.
- UI is usable for large validation result sets.

### TASK-074: Implement Price Table Publish

Status: Done  
Milestone: M3  
Area: Price Import  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-073

Description:
Publish a valid price table import for quote usage.

Acceptance Criteria:
- Only valid imports can be published.
- Published price table version is recorded.
- Quote pricing uses published active prices.
- Previous versions remain auditable.
- Publish action is audit logged.

### TASK-075: Build Admin Order Search API

Status: Done  
Milestone: M3  
Area: Admin Orders  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-051, TASK-066

Description:
Create backend search for admin order management.

Acceptance Criteria:
- API supports search by order ID, email, provider, policy number, and date range.
- API supports pagination.
- API enforces admin permissions.
- API returns order state, payment status, certificate status, customer summary, and provider/product summary.
- Tests cover filters and permission checks.

### TASK-076: Build Admin Order List UI

Status: Todo  
Milestone: M3  
Area: Admin Orders  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-064, TASK-075

Description:
Build the admin order list and search interface.

Acceptance Criteria:
- Admin can search and filter orders.
- List shows order reference, customer, provider, product, amount, order state, payment status, and certificate status.
- Pagination is implemented.
- Empty, loading, and error states are implemented.
- Selecting an order opens order detail.

### TASK-077: Build Admin Order Detail API

Status: Done  
Milestone: M3  
Area: Admin Orders  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-075

Description:
Create backend endpoint for full admin order detail.

Acceptance Criteria:
- API returns quote summary, application data, payment records, consent records, state history, certificate data, and audit records.
- Sensitive data respects role permissions.
- Missing order returns safe not-found response.
- Tests cover authorized and unauthorized users.

### TASK-078: Build Admin Order Detail UI

Status: Todo  
Milestone: M3  
Area: Admin Orders  
Discipline: Frontend  
Priority: Must  
Estimate: L  
Depends on: TASK-077

Description:
Build the admin screen for viewing order detail.

Acceptance Criteria:
- UI displays quote, application, payment, consent, state history, and certificate sections.
- Sensitive fields are hidden where role does not allow access.
- State history is readable.
- Email log area is included or prepared.
- Loading and error states are implemented.

### TASK-079: Implement Secure Certificate Storage

Status: Todo  
Milestone: M3  
Area: Fulfilment  
Discipline: Backend, DevOps  
Priority: Must  
Estimate: M  
Depends on: TASK-005, TASK-009

Description:
Set up secure storage for certificate PDFs.

Acceptance Criteria:
- Certificates are stored outside public static access.
- Access uses signed URLs or authenticated download.
- File size and content type limits are defined.
- Storage references are persisted.
- Storage errors are logged.

### TASK-080: Build Certificate Upload API

Status: Done  
Milestone: M3  
Area: Fulfilment  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-079

Description:
Allow authorized admins to upload certificate PDFs to paid orders.

Acceptance Criteria:
- Upload is allowed only for paid or certificate-pending orders.
- PDF file type is validated.
- Provider policy number can be saved.
- Certificate record is created or updated.
- Upload action is audit logged.

### TASK-081: Build Certificate Upload UI

Status: Todo  
Milestone: M3  
Area: Fulfilment  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-078, TASK-080

Description:
Add certificate upload controls to admin order detail.

Acceptance Criteria:
- Admin can enter provider policy number.
- Admin can upload certificate PDF.
- UI shows upload progress and outcome.
- UI blocks upload when order state is not eligible.
- Uploaded certificate status is visible.

### TASK-082: Send Certificate Issued Email

Status: Todo  
Milestone: M3  
Area: Notifications  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-061, TASK-080

Description:
Send customer email when certificate is issued.

Acceptance Criteria:
- Email sends after certificate is issued.
- Email includes order reference, provider/product, and secure certificate access.
- Email delivery is logged.
- Failed email delivery is visible to operations.
- `certificate_issued` analytics event is emitted.

### TASK-083: Implement Fulfilment Queue API

Status: Done  
Milestone: M3  
Area: Fulfilment  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-053, TASK-080

Description:
Create API for paid orders awaiting certificate fulfilment.

Acceptance Criteria:
- API returns orders requiring fulfilment.
- API supports filtering by provider, age, and status.
- API identifies SLA breach status.
- API enforces operations/admin permissions.
- Tests cover queue filters.

### TASK-084: Build Fulfilment Queue UI

Status: Todo  
Milestone: M3  
Area: Fulfilment  
Discipline: Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-064, TASK-083

Description:
Build admin queue for outstanding certificate fulfilment.

Acceptance Criteria:
- Queue shows paid orders awaiting certificate action.
- Queue supports provider, age, and status filters.
- SLA breaches are visually highlighted.
- Admin can open order detail from queue.
- Empty state is implemented.

### TASK-085: Implement Audit Log Service

Status: Done  
Milestone: M3  
Area: Audit  
Discipline: Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-006

Description:
Create shared service for audit logging sensitive actions.

Acceptance Criteria:
- Audit records actor, action, entity, entity ID, timestamp, and metadata.
- Service can be called from admin mutations.
- Failures are handled without corrupting main transaction where appropriate.
- Unit tests cover audit record creation.

### TASK-086: Build Audit Log UI

Status: Todo  
Milestone: M3  
Area: Audit  
Discipline: Frontend, Backend  
Priority: Should  
Estimate: M  
Depends on: TASK-085, TASK-066

Description:
Allow authorized admins to view audit logs.

Acceptance Criteria:
- Admin can view audit log list.
- Logs can be filtered by actor, entity, action, and date.
- Only authorized roles can access audit logs.
- Log detail displays metadata safely.
- Pagination is implemented.

## 8. M4: Agent MVP

### TASK-087: Design Agent Portal Screens

Status: Todo  
Milestone: M4  
Area: Agent Portal  
Discipline: Design  
Priority: Must  
Estimate: S  
Depends on: TASK-014

Description:
Design agent sign-in, dashboard, quote creation, generated link, and quote/order list screens.

Acceptance Criteria:
- Desktop and mobile designs are complete.
- Pending and suspended states are represented.
- Quote link copy interaction is designed.
- Designs are reviewed by product and engineering.

### TASK-088: Create Agent Model

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-006

Description:
Create agent account storage.

Acceptance Criteria:
- Agent stores agency, name, email, status, and commission profile placeholder.
- Agent status supports pending, approved, and suspended.
- Agent can be linked to quotes and orders.
- Agent changes can be audit logged.

### TASK-089: Build Admin Agent Management

Status: Todo  
Milestone: M4  
Area: Agent Portal  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-066, TASK-088

Description:
Allow admins to create, approve, suspend, and edit agents.

Acceptance Criteria:
- Admin can list agents.
- Admin can create and edit agent profiles.
- Admin can approve and suspend agents.
- Suspended agents cannot create quote links.
- Agent changes are audit logged.

### TASK-090: Implement Agent Authentication

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-087, TASK-088

Description:
Implement sign-in and route protection for agents.

Acceptance Criteria:
- Approved agents can sign in.
- Pending and suspended agents cannot access quote creation.
- Agent sessions are isolated from admin sessions.
- Protected agent routes require authentication.
- Authentication failures are handled safely.

### TASK-091: Build Agent Dashboard

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-087, TASK-090

Description:
Build the agent dashboard with recent quote and order activity.

Acceptance Criteria:
- Dashboard shows recent agent-created quotes.
- Dashboard shows resulting order statuses where available.
- Agent only sees own attributed records.
- Empty and loading states are implemented.
- Access control tests cover unrelated records.

### TASK-092: Implement Agent Quote Creation

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-026, TASK-090

Description:
Allow agents to create quotes from the agent portal.

Acceptance Criteria:
- Agent can enter adults, children, start date, and end date.
- Created quote stores agent attribution.
- Quote validation matches public quote validation.
- `agent_quote_created` analytics event is tracked.
- Suspended agents cannot create quotes.

### TASK-093: Implement Tracked Quote Link

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Frontend, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-092

Description:
Generate shareable quote links that preserve agent attribution.

Acceptance Criteria:
- Agent can copy a generated quote link.
- Student opening the link sees the quote or results flow.
- Attribution persists through results, application, and order.
- Attribution cannot be overwritten by another agent link during same order flow.
- Tests verify order is linked to original agent.

### TASK-094: Build Agent Quote and Order List

Status: Done  
Milestone: M4  
Area: Agent Portal  
Discipline: Frontend, Backend  
Priority: Should  
Estimate: M  
Depends on: TASK-091, TASK-093

Description:
Allow agents to view tracked quote and order outcomes.

Acceptance Criteria:
- Agent can view quote created date, status, selected provider, order status, and certificate status where allowed.
- Sensitive application details are hidden.
- List can be filtered by date and status.
- Agent cannot access unrelated records.
- Empty state is implemented.

## 9. M5: Reporting, Security, QA, and Launch

### TASK-095: Build Quote Funnel Report

Status: Done  
Milestone: M5  
Area: Reporting  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-040

Description:
Create report for quote starts, submissions, and result views.

Acceptance Criteria:
- Report shows quote started, submitted, and results viewed counts.
- Report supports date range filtering.
- Report can be viewed by authorized admin users.
- Numbers reconcile with tracked events.

### TASK-096: Build Conversion Report

Status: Done  
Milestone: M5  
Area: Reporting  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-063

Description:
Create report for quote-to-purchase conversion.

Acceptance Criteria:
- Report shows policy selected, application submitted, payment started, payment succeeded, and payment failed.
- Report supports date range filtering.
- Report shows conversion percentages.
- Numbers reconcile with orders and payment records.

### TASK-097: Build Provider Sales Report

Status: Todo  
Milestone: M5  
Area: Reporting  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-058, TASK-075

Description:
Create provider sales report for paid orders.

Acceptance Criteria:
- Report shows paid policies by provider and product.
- Report shows total amount by provider and product.
- Report supports date range filtering.
- Report excludes failed payments.
- Finance/admin roles can access it.

### TASK-098: Build Certificate SLA Report

Status: Todo  
Milestone: M5  
Area: Reporting  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-083

Description:
Create report for time from payment to certificate issue.

Acceptance Criteria:
- Report shows pending, fulfilled, and breached certificate counts.
- Report shows median and maximum fulfilment time.
- Report supports provider and date filters.
- Breach logic matches fulfilment queue logic.

### TASK-099: Build Agent Activity Report

Status: Todo  
Milestone: M5  
Area: Reporting  
Discipline: Backend, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-093, TASK-094

Description:
Create report for agent quote and order activity.

Acceptance Criteria:
- Report shows quotes created by agent.
- Report shows converted orders by agent.
- Report shows conversion rate by agent.
- Report supports date range filtering.
- Agent attribution matches order records.

### TASK-100: Implement Email Delivery Logging

Status: Done  
Milestone: M5  
Area: Notifications  
Discipline: Backend  
Priority: Must  
Estimate: S  
Depends on: TASK-062, TASK-082

Description:
Create durable logs for transactional email attempts.

Acceptance Criteria:
- Email log stores recipient, template, status, provider reference, order ID, and timestamp.
- Payment confirmation and certificate issued emails are logged.
- Failed email attempts are visible in admin order detail.
- Tests verify logs are created for success and failure.

### TASK-101: Add Rate Limiting to Sensitive Endpoints

Status: Todo  
Milestone: M5  
Area: Security  
Discipline: Backend, Security  
Priority: Must  
Estimate: M  
Depends on: TASK-025, TASK-065, TASK-090

Description:
Apply rate limits to sensitive public and auth endpoints.

Acceptance Criteria:
- Quote submission has reasonable abuse protection.
- Admin sign-in is rate limited.
- Agent sign-in is rate limited.
- Rate limit responses are safe and user-friendly.
- Limits are configurable by environment.

### TASK-102: Run Authorization Test Pass

Status: Todo  
Milestone: M5  
Area: Security  
Discipline: QA, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-066, TASK-090

Description:
Verify users cannot access unauthorized admin or agent records.

Acceptance Criteria:
- Operations role cannot access super admin functions.
- Finance role cannot modify provider pricing unless allowed.
- Agent cannot view unrelated agent records.
- Anonymous user cannot access admin or agent APIs.
- Authorization defects are logged and fixed or risk-accepted.

### TASK-103: Verify Certificate Access Security

Status: Todo  
Milestone: M5  
Area: Security  
Discipline: QA, Backend  
Priority: Must  
Estimate: M  
Depends on: TASK-079, TASK-082

Description:
Verify certificate PDFs are not publicly exposed.

Acceptance Criteria:
- Direct storage URLs are not public.
- Certificate access requires signed or authenticated URL.
- Expired signed URL cannot access certificate.
- Unauthorized user cannot download another customer's certificate.
- Test evidence is recorded.

### TASK-104: Run Accessibility QA

Status: Todo  
Milestone: M5  
Area: Accessibility  
Discipline: QA, Design, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-036, TASK-048, TASK-078

Description:
Run accessibility checks on public quote, results, checkout, and admin screens.

Acceptance Criteria:
- Keyboard navigation works on quote and checkout.
- Inputs have labels.
- Validation errors are associated with fields.
- Focus states are visible.
- Critical accessibility issues are fixed before launch.

### TASK-105: Run Mobile Responsive QA

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA, Frontend  
Priority: Must  
Estimate: M  
Depends on: TASK-017, TASK-036, TASK-048, TASK-057

Description:
Verify MVP customer-facing flows on mobile viewports.

Acceptance Criteria:
- Landing page has no horizontal overflow.
- Quote form is usable on mobile.
- Results are readable on mobile.
- Checkout forms are usable on mobile.
- Payment step is usable on mobile.

### TASK-106: Create End-to-End QA Test Plan

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA  
Priority: Must  
Estimate: M  
Depends on: TASK-063, TASK-084, TASK-093

Description:
Create a test plan for MVP release verification.

Acceptance Criteria:
- Test plan includes student happy path.
- Test plan includes failed payment path.
- Test plan includes no-results quote path.
- Test plan includes admin price import path.
- Test plan includes certificate upload path.
- Test plan includes agent attribution path.

### TASK-107: Execute Student Quote-to-Certificate QA

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA, Product, Ops  
Priority: Must  
Estimate: M  
Depends on: TASK-106

Description:
Test the complete student journey from quote through certificate email.

Acceptance Criteria:
- Student can create quote.
- Student can select policy.
- Student can complete application.
- Student can pay successfully.
- Operations can upload certificate.
- Student receives certificate email.
- Defects are logged with reproduction steps.

### TASK-108: Execute Payment Failure QA

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA  
Priority: Must  
Estimate: S  
Depends on: TASK-106

Description:
Test failed payment and recovery scenarios.

Acceptance Criteria:
- Failed payment does not create paid order.
- User sees recoverable failure message.
- Payment record stores failed status.
- Order can be retried where supported.
- Duplicate failure webhooks do not corrupt state.

### TASK-109: Execute Admin Price Import QA

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA, Ops  
Priority: Must  
Estimate: S  
Depends on: TASK-106

Description:
Test price import with valid, invalid, and conflicting files.

Acceptance Criteria:
- Valid CSV can be published.
- Invalid CSV displays row-level errors.
- Conflicting CSV cannot be published.
- Published prices appear in quote results.
- Previous price version remains auditable.

### TASK-110: Execute Agent Attribution QA

Status: Todo  
Milestone: M5  
Area: QA  
Discipline: QA  
Priority: Must  
Estimate: S  
Depends on: TASK-106

Description:
Test tracked quote links from agent creation through student purchase.

Acceptance Criteria:
- Agent can create quote link.
- Student can complete purchase through link.
- Order stores agent attribution.
- Agent can see permitted order status.
- Another agent cannot view the order.

### TASK-111: Complete Launch Configuration Checklist

Status: Todo  
Milestone: M5  
Area: Launch  
Discipline: DevOps, Product, Ops  
Priority: Must  
Estimate: M  
Depends on: TASK-107, TASK-108, TASK-109, TASK-110

Description:
Verify production configuration before launch.

Acceptance Criteria:
- Production environment variables are configured.
- Payment gateway production credentials are configured.
- Email sender is configured.
- Provider prices are imported and validated.
- Admin users and roles are configured.
- Monitoring and alerting are enabled.

### TASK-112: Conduct Go/No-Go Review

Status: Todo  
Milestone: M5  
Area: Launch  
Discipline: Product, Engineering, QA, Ops, Legal  
Priority: Must  
Estimate: S  
Depends on: TASK-111

Description:
Run final release readiness review.

Acceptance Criteria:
- Launch checklist is reviewed.
- Open defects are classified by severity.
- Legal and compliance blockers are resolved or risk-accepted.
- Operations support process is confirmed.
- Go/no-go decision is recorded.

## 10. M6: Post-MVP Tasks

### TASK-113: Design Customer Magic-Link Order Lookup

Status: Todo  
Milestone: M6  
Area: Customer Self-Service  
Discipline: Design  
Priority: Should  
Estimate: M  
Depends on: TASK-112

Description:
Design order lookup, magic link verification, and order status screens.

Acceptance Criteria:
- Customer can request access using email and order reference.
- Magic link email state is designed.
- Order detail screen includes status, receipt, and certificate.
- Error states for expired link and not found are designed.

### TASK-114: Implement Magic-Link Token Model

Status: Todo  
Milestone: M6  
Area: Customer Self-Service  
Discipline: Backend  
Priority: Should  
Estimate: M  
Depends on: TASK-113

Description:
Create backend model and service for expiring customer order access links.

Acceptance Criteria:
- Token is linked to order and email.
- Token has expiry timestamp.
- Token can be used once or invalidated according to defined policy.
- Token is stored securely.
- Tests cover expired and invalid tokens.

### TASK-115: Build Customer Order Lookup UI

Status: Todo  
Milestone: M6  
Area: Customer Self-Service  
Discipline: Frontend, Backend  
Priority: Should  
Estimate: L  
Depends on: TASK-114

Description:
Build customer-facing order lookup and order detail flow.

Acceptance Criteria:
- Customer can submit email and order reference.
- System sends magic link to verified email.
- Customer can view own order status, receipt, and certificate.
- Unauthorized access is blocked.
- Expired links show clear recovery path.

### TASK-116: Build Customer Request Workflows

Status: Todo  
Milestone: M6  
Area: Customer Self-Service  
Discipline: Frontend, Backend, Ops  
Priority: Should  
Estimate: L  
Depends on: TASK-115

Description:
Allow customers to request date correction, refund/cancellation, or certificate resend.

Acceptance Criteria:
- Customer can submit correction request.
- Customer can submit refund/cancellation request.
- Customer can request certificate resend.
- Operations can view and update request status.
- Customer receives request confirmation email.

### TASK-117: Implement Multilingual Framework

Status: Todo  
Milestone: M6  
Area: Internationalization  
Discipline: Frontend, Backend  
Priority: Should  
Estimate: L  
Depends on: TASK-112

Description:
Add locale support and translation string management.

Acceptance Criteria:
- UI strings are separated from application logic.
- Locale switching is supported.
- English remains default.
- Legal/disclosure strings support review status.
- Selected non-English locale can be QA tested.

### TASK-118: Implement Provider API Adapter Interface

Status: Todo  
Milestone: M6  
Area: Provider Integrations  
Discipline: Backend  
Priority: Should  
Estimate: L  
Depends on: TASK-112

Description:
Create provider integration abstraction for pricing and submission APIs.

Acceptance Criteria:
- Adapter interface supports pricing lookup.
- Adapter interface supports application submission.
- Adapter interface supports certificate retrieval where available.
- Failures are normalized for operations visibility.
- Manual fallback remains possible.

### TASK-119: Implement First Provider API Integration

Status: Todo  
Milestone: M6  
Area: Provider Integrations  
Discipline: Backend, QA  
Priority: Should  
Estimate: XL  
Depends on: TASK-118

Description:
Integrate the first provider API for pricing or submission based on provider capability.

Acceptance Criteria:
- Provider sandbox credentials are configured.
- Integration maps platform data to provider request format.
- Successful provider response is stored.
- Failure response is queued or visible to operations.
- Integration tests cover success and failure scenarios.

### TASK-120: Define Commission Rules

Status: Todo  
Milestone: M6  
Area: Agent Commissions  
Discipline: Product, Finance  
Priority: Should  
Estimate: S  
Depends on: TASK-112

Description:
Define rules for agent commission calculation.

Acceptance Criteria:
- Commission basis is documented.
- Refund and cancellation treatment is documented.
- Provider/product/date-specific rules are documented.
- Finance stakeholder approves rules.

### TASK-121: Build Commission Ledger

Status: Todo  
Milestone: M6  
Area: Agent Commissions  
Discipline: Backend, Frontend  
Priority: Should  
Estimate: L  
Depends on: TASK-120

Description:
Implement commission calculation and reporting foundation.

Acceptance Criteria:
- Commission rule model exists.
- Paid agent-attributed orders create ledger entries.
- Refunded or cancelled policies update commission eligibility.
- Finance/admin users can view commission report.
- Tests cover paid, refunded, and cancelled cases.

### TASK-122: Design Advanced Results Comparison

Status: Todo  
Milestone: M6  
Area: Results  
Discipline: Design  
Priority: Could  
Estimate: M  
Depends on: TASK-112

Description:
Design richer filters and side-by-side policy comparison.

Acceptance Criteria:
- Filter controls are designed.
- Side-by-side comparison layout is designed.
- Mobile comparison behavior is designed.
- Recommended or fastest-delivery badge behavior is defined.

### TASK-123: Build Advanced Results Comparison

Status: Todo  
Milestone: M6  
Area: Results  
Discipline: Frontend, Backend  
Priority: Could  
Estimate: L  
Depends on: TASK-122

Description:
Implement post-MVP result filters and comparison UI.

Acceptance Criteria:
- User can filter by provider.
- User can filter by key benefit where data exists.
- User can compare selected policies side by side.
- Compare interactions are tracked.
- Existing MVP result selection remains unchanged.

## 11. MVP Critical Path Task Order

1. TASK-001 to TASK-015: Foundations.
2. TASK-016 to TASK-040: Public quote and results.
3. TASK-041 to TASK-063: Checkout and payment.
4. TASK-064 to TASK-086: Admin operations and fulfilment.
5. TASK-087 to TASK-094: Agent MVP.
6. TASK-095 to TASK-112: Reporting, security, QA, and launch.
