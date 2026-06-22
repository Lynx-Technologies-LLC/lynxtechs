# Phase 2: Headless Commerce (Medusa)

This directory is reserved for the Lynx Technologies headless shop backend.

## Planned stack

- **Medusa v2** — products, cart, checkout, customers, orders, fulfillment
- **PostgreSQL** — Medusa database
- **Stripe** — payments via Medusa payment module
- **Next.js** (`apps/web`) — shop UI consuming Medusa Store API

## Shop routes (to add in `apps/web`)

| Route | Purpose |
|---|---|
| `/shop` | Product grid |
| `/shop/[handle]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/account` | Customer profile |
| `/account/orders` | Order history |
| `/account/orders/[id]` | Order tracking |

## Setup (when ready)

1. Scaffold Medusa in this directory:

   ```bash
   npx create-medusa-app@latest . --skip-db --no-browser
   ```

2. Configure environment (see `.env.example`).

3. Start PostgreSQL and Medusa:

   ```bash
   docker compose up -d
   npm run dev
   ```

4. In `apps/web`, install the Medusa JS SDK:

   ```bash
   npm install @medusajs/js-sdk
   ```

5. Add env vars to `apps/web/.env.local`:

   ```env
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```

6. Seed products (LXMSTR, LXDIO33-16) in Medusa Admin and build shop pages.

## Products to seed

- **LXMSTR** — Software license / integration package
- **LXDIO33-16** — Hardware module (quote or purchasable SKU)

## Deployment

- **Medusa + Postgres:** Railway or Render
- **Web:** Vercel (set `MEDUSA_BACKEND_URL` in project env)

See the root [README.md](../../README.md) for the full monorepo overview.
