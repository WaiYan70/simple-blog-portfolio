# Simple Blog Portfolio

A blog-based portfolio built with Next.js App Router. The app is designed to present portfolio work through long-form writing, project case studies, and a simple owner-only admin area.

The public site focuses on readable content and practical project proof. Blog posts and project pages are stored as MDX files, while private admin access is protected by custom server-side sessions backed by Neon PostgreSQL.

## What This App Does

- Shows a public portfolio homepage with profile, skills, journey, projects, blog previews, resume, and contact sections.
- Renders blog posts from local `.mdx` files in `src/content/blog`.
- Renders project case studies from local `.mdx` files in `src/content/projects`.
- Provides client-side blog browsing/search behavior.
- Generates Open Graph images for the portfolio and individual blog posts.
- Sends contact form submissions through a server route using Resend.
- Provides a private `/admin` dashboard protected by custom email/password authentication.
- Stores admin users, sessions, and login attempt records in Neon PostgreSQL.

## How It Works

### Public Portfolio

The public routes live under the portfolio route group:

- `/` - main portfolio page
- `/blog` - blog index
- `/blog/[slug]` - individual blog post page
- `/projects` - project index
- `/projects/[slug]` - individual project page

Most public pages are Server Components by default. Interactive UI, such as search, theme toggles, carousels, dialogs, drawers, and forms, is isolated into Client Components.

### Blog and Project Content

Content is file-based:

- Blog posts: `src/content/blog/*.mdx`
- Projects: `src/content/projects/*.mdx`

The app reads frontmatter with `gray-matter`, derives the slug from the file name, and renders MDX content with custom components.

Blog posts support:

- `title`
- `description`
- `date`
- `tags`
- calculated reading time
- extracted headings for a table of contents

Projects support:

- `title`
- `description`
- `image`
- `techstack`
- `status`

### Contact Flow

The contact form validates user input with Zod and sends a message through:

```txt
POST /api/contact
```

The route uses Resend and requires email-related environment variables. Validation errors return `400`; send failures return `500`.

### Admin Authentication

The admin area is intentionally simple because this is a single-owner portfolio, not a multi-tenant SaaS app.

Admin routes live under:

```txt
/admin
```

Authentication uses:

- email and password login
- Argon2id password hashing
- server-side sessions stored in Neon PostgreSQL
- a random session token stored in an HttpOnly cookie
- a SHA-256 hash of that token stored in the database
- login attempt tracking for rate limiting

The browser never receives password hashes or sensitive user records. Admin authorization happens on the server before protected admin pages render.

More details are documented in `docs/auth.md`.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Runtime/package manager:** Bun
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Radix UI primitives
- **Icons:** lucide-react, simple-icons
- **Content:** MDX, next-mdx-remote, gray-matter
- **Code highlighting:** Shiki, rehype-pretty-code
- **Themes:** next-themes
- **Database:** Neon PostgreSQL via `@neondatabase/serverless`
- **Authentication:** custom session-based auth with Argon2id password hashing
- **Email:** Resend
- **Charts/visuals:** Recharts, Motion
- **Validation:** Zod
- **Open Graph images:** `@vercel/og`

## Project Structure

```txt
src/app                     App Router routes and route groups
src/app/(portfolio)         Public portfolio, blog, and project pages
src/app/(auth)              Login page and login/logout server actions
src/app/(admin)             Protected admin dashboard routes
src/app/api/contact         Contact form API route
src/components              Shared layout, UI, theme, and primitive components
src/content/blog            Blog MDX files
src/content/projects        Project MDX files
src/db                      Neon client, repositories, and SQL migrations
src/features                Feature-specific UI, data, schemas, and helpers
src/lib                     Shared utilities and auth helpers
src/types                   Shared TypeScript types
docs                        Project documentation
scripts                     Utility scripts, including admin seeding
public                      Static assets, images, favicons, and resume files
```

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

Create a local environment file and provide the required values:

```txt
NEON_DATABASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
RESEND_API_KEY=
CONTACT_EMAIL=
```

Notes:

- `NEON_DATABASE_URL` is required for auth, sessions, login attempts, and admin seeding.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used by the seed script.
- `RESEND_API_KEY` and `CONTACT_EMAIL` are required for the contact form.
- Do not commit real secret values.

## Database Setup

SQL migrations are stored in:

```txt
src/db/migrations
```

Current migrations:

- `001_create_auth_tables.sql` - creates `users` and `sessions`
- `002_create_login_attempts.sql` - creates login attempt tracking

After applying the migrations to Neon, seed the admin user:

```bash
bun run seed:admin
```

The seed script hashes the admin password with Argon2id and upserts the admin user.

## Available Scripts

```bash
bun dev
```

Starts the local Next.js development server.

```bash
bun run build
```

Builds the production app.

```bash
bun start
```

Starts the production server after a successful build.

```bash
bun run lint
```

Runs ESLint.

```bash
bun run seed:admin
```

Creates or updates the admin user from environment variables.

## Content Workflow

To add a blog post:

1. Create a new `.mdx` file in `src/content/blog`.
2. Add frontmatter with `title`, `description`, `date`, and optional `tags`.
3. Use the file name as the post slug.

To add a project:

1. Create a new `.mdx` file in `src/content/projects`.
2. Add frontmatter with `title`, `description`, `image`, `techstack`, and `status`.
3. Use the file name as the project slug.

## Security Notes

- Admin auth is server-side and session-based.
- Session cookies are HttpOnly, use `sameSite: "lax"`, and are secure in production.
- Raw session tokens are not stored in the database.
- Passwords are hashed with Argon2id.
- Login attempts are tracked with hashed identifiers.
- Sensitive environment values should stay in local or deployment secret storage only.

## Development Notes

- Prefer Server Components unless a component needs browser APIs, state, effects, or event handlers.
- Keep MDX content separate from admin/auth logic.
- Keep database access in `src/db` repositories or server-only helpers.
- Keep auth helpers in `src/lib/auth`.
- Avoid importing server-only code into Client Components.

