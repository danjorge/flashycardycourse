# Flashy Cardy Course

A flashcard study app that lets users create decks of cards, manage their content, and study at their own pace. Users on the Pro plan get unlimited decks and AI-powered flashcard generation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Auth & Billing | [Clerk](https://clerk.com) (authentication + subscription plans) |
| Database | [Neon](https://neon.tech) (serverless Postgres) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |

## Project Structure

```
src/
  app/                  # Next.js App Router pages & server actions
    dashboard/          # Deck listing & creation
    decks/[deckId]/     # Individual deck view & card management
    pricing/            # Clerk PricingTable
  db/
    schema.ts           # Drizzle table definitions (decks, cards)
    index.ts            # Neon DB client
    queries/
      decks.ts          # All deck reads & writes
      cards.ts          # All card reads & writes
  components/ui/        # shadcn/ui components
  lib/
    utils.ts            # Shared utilities
```

## Database Schema

- **decks** — `id`, `clerkUserId`, `name`, `description`, `createdAt`, `updatedAt`
- **cards** — `id`, `deckId` (FK → decks, cascade delete), `front`, `back`, `createdAt`, `updatedAt`

## Subscription Plans

Plans and feature gating are handled entirely by Clerk Billing.

| Plan | Features |
|---|---|
| Free | Up to 3 decks |
| Pro | Unlimited decks, AI flashcard generation |

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the environment variables file and fill in your Clerk and Neon credentials:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Migrations

Generate and apply migrations with Drizzle Kit:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
