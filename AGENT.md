# OSHC Compare Agent Rules

These rules apply to this repository. Follow them when changing code, docs, tests, or generated artifacts.

## Project Shape

- The current implementation lives in `backend/`.
- Planning and product documents live in `docs/`.
- The backend is an Express API written as JavaScript ES modules.
- Prisma ORM is used for data access.
- SQLite is used for local development and tests.
- Resend is used for transactional email when `RESEND_API_KEY` is configured; otherwise email is logged and persisted with provider `development_log`.

## API Contract

- The OpenAPI source of truth is `docs/API_SPEC_OSHC_Platform.yaml`.
- The backend serves Swagger UI from `/docs` and the YAML from `/openapi.yaml`.
- Keep route behavior aligned with the OpenAPI spec when adding or changing endpoints.
- Preserve existing API prefixes:
  - Public API: `/api/v1`
  - Admin API: `/api/v1/admin`
  - Agent API: `/api/v1/agent`

## Backend Structure

- `backend/src/app.js` creates and wires the Express app.
- `backend/src/server.js` starts the HTTP server.
- `backend/src/lib/` contains shared helpers for auth, errors, validation, Prisma, JSON fields, and async route handling.
- `backend/src/services/` contains business logic and data operations.
- `backend/src/routes/` contains thin route aggregators and feature route modules.
- Route entry files should stay small:
  - `routes/public.js`
  - `routes/admin.js`
  - `routes/agent.js`
- Put feature endpoints under their matching route folder:
  - `routes/public/`
  - `routes/admin/`
  - `routes/agent/`
- Put request schemas in `schemas.js` files near their route group.
- Put response mappers in mapper/helper modules and export them when unit tests or other routes need them.

## Database Rules

- Prisma schema is in `backend/prisma/schema.prisma`.
- SQLite table bootstrap SQL is in `backend/prisma/init.sql`.
- Seed data is in `backend/prisma/seed.js`.
- Local setup uses:

```sh
cd backend
npm run prisma:generate
npm run db:init
npm run prisma:seed
```

- Keep `schema.prisma` and `init.sql` aligned when changing tables, columns, enums, or relationships.
- Avoid relying on Prisma migrations until the local schema-engine issue noted in `backend/README.md` is resolved.

## Testing Rules

- Unit tests live in `backend/test/unit/`.
- Integration tests live in `backend/test/integration/`.
- `npm test` runs unit tests only.
- Use these commands from `backend/`:

```sh
npm run test:unit
npm run test:integration
npm run test:all
```

- Unit tests should not open network listeners or use a real database.
- Mock Prisma in service unit tests with `esmock`.
- Integration tests may use Supertest and a disposable SQLite database.
- Integration tests should not depend on the developer's running `dev.db`.
- Keep API flow tests in `test/integration`, not `test/unit`.

## Coding Rules

- Use ES module syntax.
- Use `asyncHandler` for async Express handlers.
- Validate request bodies with Zod through `validate(...)`.
- Throw API errors with helpers from `lib/errors.js`.
- Use `jsonString`, `jsonArrayString`, and `jsonParse` for JSON stored in text fields.
- Keep route handlers focused on HTTP concerns; move business logic into services when it grows.
- Do not add broad refactors while implementing a narrow feature.
- Preserve demo auth behavior unless explicitly replacing it:
  - Admin demo login: `admin@example.com` / `password`
  - Agent demo login: `agent@example.com` / `password`

## Documentation Rules

- Update `docs/API_SPEC_OSHC_Platform.yaml` when endpoint contracts change.
- Update `backend/README.md` when setup, scripts, ports, auth, database, or email behavior changes.
- Keep planning docs in `docs/` as markdown unless the user asks for another format.

## Git Rules

- Do not stage unrelated files.
- Check `git status --short` before committing.
- Commit focused changes with clear messages.
- Run relevant tests before committing backend changes.
- If an untracked file exists and is unrelated, leave it untouched unless the user asks otherwise.
