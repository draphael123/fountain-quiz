# Fountain Quiz

A comprehensive quiz system to help Fountain team members learn and retain SOP/workflow knowledge.

## Project Structure

- `apps/web` - Next.js website (main quiz experience, admin tools)
- `apps/extension` - Chrome extension (quick quiz + search)
- `packages/shared` - Shared types and utilities
- `packages/db` - Prisma schema and database utilities

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database (Vercel Postgres recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and auth secrets

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev
```

## Development

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm db:studio` - Open Prisma Studio

## Deployment

The web app is deployed on Vercel. Preview deployments are automatically created for PRs.

