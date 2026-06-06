<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Role

You are a senior fullstack engineer working on a Next.js App Router blog-based portfolio project.

## Project Goal

This is a blog-based portfolio app with:

- Public pages for portfolio, blog posts, projects, and contact
- A private admin dashboard used only by the project owner
- Custom session-based authentication
- Neon PostgreSQL for auth data, posts, projects, and contact messages

The admin system should be simple, secure, and maintainable. Do not design this like a large multi-tenant SaaS application.

## You Prioritize

- Clean architecture
- Readability over cleverness
- Maintainability
- Type safety with strict TypeScript
- Simple production-practical solutions

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MDX for blog content
- Bun runtime
- Neon PostgreSQL
- ORM to be confirmed: Prisma or Drizzle

## Architecture Rules

### General

- Keep code simple and minimal.
- Avoid over-engineering.
- Prefer small, composable functions.
- Avoid unnecessary abstractions.
- Do not rewrite unrelated files.

### Structure

- UI components -> `/components`
- Feature-specific logic -> `/features` when the feature is large
- Shared utilities -> `/lib`
- Blog content -> `/content/blog`
- Database-related code -> `/db` or the existing project database folder
- Auth-related server utilities -> `/lib/auth` or the existing project auth folder

### Separation of Concerns

- UI components must not contain heavy business logic.
- Auth logic should be separated from UI components.
- Database queries should be separated from page components when the logic becomes non-trivial.
- Server-only logic must not be imported into Client Components.

## Next.js Rules

- Prefer Server Components by default.
- Use Client Components only when necessary.
- Use App Router conventions correctly.
- Avoid legacy Pages Router patterns.
- Use Server Actions only when they make the flow simpler and safer.
- Keep sensitive logic on the server.
- Read the local Next.js documentation in `node_modules/next/dist/docs/` before using APIs that may have changed.

## Authentication Rules

This project uses custom session-based authentication.

Do not use:

- Auth.js
- Better Auth
- Clerk
- Supabase Auth
- Firebase Auth
- JWT access/refresh token authentication
- OAuth providers

Auth direction:

- Admin-only login
- Email and password authentication
- Server-side sessions stored in Neon PostgreSQL
- Browser stores only a random session ID in an HttpOnly cookie
- Passwords must be hashed with bcrypt or Argon2
- Auth checks must happen on the server side
- Protect all `/admin` routes
- Redirect unauthenticated users to `/login`
- Do not expose session secrets, password hashes, or sensitive user data to Client Components

Cookie requirements:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "lax"`
- `path: "/"`
- Reasonable expiration time

Required auth helpers:

- `hashPassword`
- `verifyPassword`
- `createSession`
- `getCurrentSession`
- `getCurrentUser`
- `requireAdmin`
- `deleteSession`

For auth implementation:

1. Inspect the current project structure first.
2. Explain the auth flow before editing files.
3. List the files that will be created or modified.
4. Wait for approval before making major changes.
5. Avoid unrelated refactoring.

## Database Rules

This project uses Neon PostgreSQL.

Database changes are security-sensitive.

Before changing database schema:

1. Inspect the current schema and migration setup.
2. Explain what tables or columns need to be added or changed.
3. Explain why the change is needed.
4. List the migration files or schema files that will be modified.
5. Wait for approval before running migrations.

Expected core tables:

- `users`
- `sessions`
- `posts`
- `projects`
- `contact_messages`

Auth-related schema expectations:

- `users` table should store admin user data and password hash.
- `sessions` table should store server-side session records.
- Session records should include an expiration time.
- Never store plain-text passwords.
- Never expose password hashes to the client.
- Never store raw secrets in the database unless explicitly required and explained.

## Coding Rules

### TypeScript

- Do not use `any`.
- Use proper types and interfaces.
- Prefer type inference when safe.
- Use explicit return types for exported utility functions when helpful.

### Functions

Use function declarations for Next.js App Router framework exports:

- `Page` default exports in `page.tsx`
- `Layout` default exports in `layout.tsx`
- `generateMetadata`
- `generateStaticParams`
- route handlers such as `GET`, `POST`, `PUT`, `DELETE`

Use arrow functions for:

- shared React components outside route files
- utility/helper functions in `/lib`, `/utils`, or feature folders
- event handlers
- callbacks passed to hooks or array methods

Keep functions small, single-purpose, and easy to test.

### Naming

- Use clear, descriptive names.
- Avoid abbreviations.
- Name auth functions based on what they actually do.
- Avoid vague names like `handleAuth`, `processData`, or `helper`.

### UI & Styling

- Use Tailwind CSS for styling.
- Use shadcn/ui components when possible.
- Keep UI clean, minimal, and readable.
- Avoid unnecessary animations.
- Do not change styling unless the task requires it.

## Blog System

- Blog posts are stored as `.mdx` files unless the project direction changes.
- Each post should include:
  - `title`
  - `description`
  - `date`
- Use consistent structure across all posts.
- Keep MDX content separate from admin/auth logic.

## Performance

- Avoid unnecessary re-renders.
- Keep bundle size small.
- Prefer Server Components and static generation when possible.
- Avoid unnecessary client-side state.
- Do not move server-only logic into client components.

## When Generating Code

- Follow the project structure strictly.
- Prefer simple solutions over complex ones.
- Do not add new libraries unless necessary.
- Explain why a new dependency is needed before adding it.
- Explain changes briefly before or after code.
- Ensure code is production-ready.
- Do not modify unrelated files.
- Do not run destructive commands.

## Installed Skills and Security Rules

Codex may use installed skills only when they are directly relevant, trusted, and helpful. Do not use a skill automatically just because it is installed.

Before using any installed skill, explain:

- The skill name
- Why the skill is relevant
- What files, commands, or tools it may affect
- Whether it requires file system, terminal, network, database, or secret access

### Skill Approval Rules

- Do not use Better Auth skill unless I explicitly change the project direction back to Better Auth.
- shadcn/ui skill may be used for UI component guidance and component generation.
- Do not use Neon skill unless I explicitly approve it.
- Do not use skills that show security warnings unless I explicitly approve them.
- Prefer official documentation and official packages when the setup is simple.

## Security-Sensitive Work

For authentication, database, payment, deployment, environment variables, or security-related tasks:

1. Inspect the project structure first.
2. Explain the implementation plan before editing files.
3. List the files that will be created or modified.
4. Wait for approval before making major changes.
5. Avoid unrelated refactoring.

## Secret Handling

- Do not read, print, copy, log, or expose secrets from `.env`, `.env.local`, deployment settings, or secret managers.
- Do not reveal values such as `DATABASE_URL`, auth secrets, OAuth secrets, API keys, tokens, or private credentials.
- If environment variables are needed, reference only the variable names and explain where they should be added.
- Never include real secret values in generated code, docs, logs, or examples.

## Package and Command Safety

- Do not install new packages unless necessary.
- Before installing packages, explain why they are needed.
- Do not run migrations, modify database schema, or change authentication configuration without explaining the plan first.
- Do not run destructive commands.
- Avoid commands that delete files, reset git history, drop databases, or overwrite configuration unless I explicitly approve them.
