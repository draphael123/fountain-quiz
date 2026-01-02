# Fountain Quiz - Setup Guide

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database (Vercel Postgres recommended for production)
- Git

## Initial Setup

### 1. Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fountain_quiz?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Optional: Upstash Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

Generate a secret for NextAuth:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Open Prisma Studio to view data
pnpm db:studio
```

### 4. Create Admin User

You can create an admin user directly in the database or through Prisma Studio:

```sql
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
VALUES ('admin-id', 'admin@fountain.com', 'Admin User', 'admin', NOW(), NOW());
```

Or use Prisma Studio to add a user and set their role to 'admin'.

### 5. Start Development Server

```bash
pnpm dev
```

The web app will be available at `http://localhost:3000`

## Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `apps/extension` directory
5. Update `API_BASE` in `apps/extension/popup.js` if your API is not at `http://localhost:3000`

## Project Structure

```
fountain-quiz/
├── apps/
│   ├── web/              # Next.js website
│   └── extension/         # Chrome extension
├── packages/
│   ├── db/               # Prisma schema and database utilities
│   └── shared/           # Shared types and utilities
├── package.json          # Root package.json with workspace config
└── turbo.json           # Turborepo configuration
```

## Development Workflow

### Adding Questions

1. Sign in as admin at `/auth/signin`
2. Go to `/admin/import`
3. Upload a DOCX file (currently uses sample data - implement DOCX parsing)
4. Review questions at `/admin/review`
5. Publish questions when ready

### Running Quizzes

1. Go to `/quiz` to set up a quiz
2. Select tags, difficulty, and number of questions
3. Start the quiz and answer questions
4. View results at `/results/[id]`

### Search

Use `/search` to quickly find answers in the knowledge base.

## Next Steps for Production

1. **Implement DOCX Parsing**: Install `mammoth` and implement proper document parsing
2. **AI Question Generation**: Integrate OpenAI API for better question generation
3. **Authentication**: Set up proper SSO or OAuth providers
4. **Deploy to Vercel**: 
   - Connect your GitHub repo
   - Set up Vercel Postgres
   - Configure environment variables
   - Deploy!

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running
- Check your `DATABASE_URL` is correct
- Run `pnpm db:generate` if Prisma client is missing

### Build Errors

- Make sure all dependencies are installed: `pnpm install`
- Clear `.next` folder and rebuild: `rm -rf apps/web/.next && pnpm build`

### Extension Not Working

- Check that the API URL in `popup.js` matches your server
- Check browser console for errors
- Make sure CORS is configured if using a different domain

