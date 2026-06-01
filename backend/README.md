# OSHC Compare Backend

Express + Prisma implementation of the MVP API contract in `../docs/API_SPEC_OSHC_Platform.yaml`.

## Stack

- Express
- JavaScript ES modules
- Prisma ORM
- SQLite for local development
- Resend for transactional email

## Setup

```sh
cp .env.example .env
npm install
npm run prisma:generate
npm run db:init
npm run prisma:seed
npm run dev
```

The API runs on:

```txt
http://localhost:3000
```

## Demo Credentials

Admin login:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Agent login:

```json
{
  "email": "agent@example.com",
  "password": "password"
}
```

Passwords are not verified in this demo backend. Replace the demo token/auth implementation before production use.

## Smoke Test

With the server running:

```sh
npm run smoke
```

The smoke test creates a quote, gets seeded results, creates an application, creates an order, starts payment, and simulates a successful payment webhook.

## Database Notes

The Prisma schema is the source of truth for the ORM model. For local SQLite setup, use `prisma/init.sql` to create the database tables:

```sh
npm run db:init
```

In this local environment, Prisma Client generation works, but Prisma's schema engine returned a silent error for `prisma db push` and `prisma migrate dev`. The SQL bootstrap keeps development unblocked while still using Prisma ORM at runtime.

## Email

If `RESEND_API_KEY` is set, email is sent through Resend. Without a key, email sends are logged and persisted with provider `development_log`.
