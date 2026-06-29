# Database

This app uses Neon PostgreSQL for server-side application data.

Today, the database is used for custom admin authentication:

- admin users
- server-side sessions
- login attempt tracking

The public blog posts and project case studies are still file-based MDX content:

- `src/content/blog/*.mdx`
- `src/content/projects/*.mdx`

The planned admin CMS may move posts and projects into Neon later. That should be handled as a separate schema design and migration step.

## Current Database Stack

- **Database:** Neon PostgreSQL
- **Client:** `@neondatabase/serverless`
- **Runtime usage:** server-only code
- **Current ORM:** none
- **Migration style:** raw SQL files in `src/db/migrations`

The database client is defined in:

```txt
src/db/client.ts
```

It reads the database connection from:

```txt
NEON_DATABASE_URL
```

Do not print or commit the real value of this environment variable.

## Mental Model

The database layer should stay server-only.

The flow should look like this:

```txt
Route / Server Action
  -> auth guard if needed
  -> feature service or query function
  -> db repository
  -> Neon SQL client
  -> PostgreSQL table
```

Page components should not contain complex SQL.

Client Components should not import database utilities.

Sensitive database values, such as password hashes and session token hashes, should never be passed to the browser.

## Main Files

| Area | File |
| --- | --- |
| Neon client | `src/db/client.ts` |
| Auth tables migration | `src/db/migrations/001_create_auth_tables.sql` |
| Login attempts migration | `src/db/migrations/002_create_login_attempts.sql` |
| User repository | `src/db/repositories/user-repository.ts` |
| Session repository | `src/db/repositories/session-repository.ts` |
| Login attempt repository | `src/db/repositories/login-attempt-repository.ts` |
| Admin seed script | `scripts/seed-admin.ts` |
| Auth system docs | `docs/auth.md` |
| CMS planning docs | `docs/to-do-list.md` |

## Current Tables

### `users`

Defined in:

```txt
src/db/migrations/001_create_auth_tables.sql
```

Purpose:

Stores admin account data for the private dashboard.

Columns:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `email` | `text` | Unique admin login email. |
| `password_hash` | `text` | Argon2id password hash. |
| `role` | `text` | Currently restricted to `admin`. |
| `created_at` | `timestamptz` | Creation timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |

Constraints:

- `email` must be unique.
- `role` must be `admin`.

Important rule:

Never expose `password_hash` to Client Components or public API responses.

### `sessions`

Defined in:

```txt
src/db/migrations/001_create_auth_tables.sql
```

Purpose:

Stores server-side admin sessions.

The browser stores only the raw random session token in an HttpOnly cookie. The database stores only a SHA-256 hash of that token.

Columns:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `user_id` | `uuid` | Linked admin user. |
| `session_token_hash` | `text` | SHA-256 hash of the browser session token. |
| `user_agent` | `text` | Optional login request user agent snapshot. |
| `ip_address` | `text` | Optional login request IP snapshot. |
| `created_at` | `timestamptz` | Session creation timestamp. |
| `expires_at` | `timestamptz` | Session expiration timestamp. |

Indexes:

- `sessions_user_id_idx`
- `sessions_expires_at_idx`
- `sessions_one_active_session_per_user_idx`

Important behavior:

- A session belongs to one user.
- Deleting a user cascades and deletes that user's sessions.
- The current schema enforces one session row per user.
- New login replaces the previous active session for that admin user.

### `login_attempts`

Defined in:

```txt
src/db/migrations/002_create_login_attempts.sql
```

Purpose:

Tracks failed admin login attempts for rate limiting.

The table stores a hash of the identifier instead of storing the raw email/IP pair.

Columns:

| Column | Type | Purpose |
| --- | --- | --- |
| `identifier_hash` | `text` | Primary key. SHA-256 hash of the login identifier. |
| `failed_attempt_count` | `integer` | Number of failed attempts for the identifier. |
| `first_failed_at` | `timestamptz` | First failed attempt timestamp. |
| `last_failed_at` | `timestamptz` | Most recent failed attempt timestamp. |
| `locked_until` | `timestamptz` | Temporary lockout expiration time. |

Indexes:

- `login_attempts_locked_until_idx`

Current policy:

- Maximum failed attempts: `5`
- Lock duration: `15 minutes`

The policy values live in:

```txt
src/lib/auth/login-rate-limit.ts
```

## Repository Layer

Database queries are grouped by table responsibility.

### User Repository

File:

```txt
src/db/repositories/user-repository.ts
```

Main functions:

- `findCurrentUserById`
- `findAdminCredentialsByEmails`

`findCurrentUserById` returns safe user data for session checks.

`findAdminCredentialsByEmails` returns the password hash for server-side login verification only. This function must stay server-only.

### Session Repository

File:

```txt
src/db/repositories/session-repository.ts
```

Main functions:

- `createSessionRecord`
- `findActiveSessionByTokenHash`
- `deleteSessionByTokenHash`

`createSessionRecord` uses a serializable transaction to:

1. Check if the user already has an active session.
2. Delete existing sessions for that user.
3. Insert the new session.

This supports the current single-active-session behavior.

### Login Attempt Repository

File:

```txt
src/db/repositories/login-attempt-repository.ts
```

Main functions:

- `findLoginAttemptLock`
- `recordFailedLoginAttempt`
- `deleteLoginAttempt`

These functions support the login rate limiter in:

```txt
src/lib/auth/login-rate-limit.ts
```

## Admin Seed Flow

The admin user is created or updated with:

```bash
bun run seed:admin
```

Script:

```txt
scripts/seed-admin.ts
```

Required environment variable names:

```txt
NEON_DATABASE_URL
ADMIN_EMAIL
ADMIN_PASSWORD
```

The seed script:

1. Reads the admin email and password from environment variables.
2. Hashes the password with Argon2id.
3. Inserts the admin user.
4. Updates the password hash if the email already exists.

The script should never log the password, password hash, or database URL.

## Current Migration Files

Current migrations:

```txt
src/db/migrations/001_create_auth_tables.sql
src/db/migrations/002_create_login_attempts.sql
```

There is not currently a full migration runner in the project.

Until a migration tool is added, migrations are SQL files that must be applied carefully to the Neon database through an approved workflow.

Before adding a new migration:

1. Explain the data model change.
2. Explain why the change is needed.
3. List the table, column, index, and constraint changes.
4. Review backward compatibility.
5. Confirm whether existing data needs migration.
6. Get approval before applying the migration.

## Future CMS Tables

The project goal includes storing posts, projects, and contact messages in Neon PostgreSQL.

Those tables do not exist yet.

Recommended future tables:

- `posts`
- `projects`
- `contact_messages`

Do not add these tables casually. They affect public rendering, admin CMS flows, migrations, and content ownership.

## Planned `posts` Table

Possible first version:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `slug` | `text` | Public URL slug. Unique. |
| `title` | `text` | Post title. |
| `description` | `text` | SEO and card summary. |
| `content` | `text` | MDX body content. |
| `date` | `date` | Public display date. |
| `tags` | `text[]` | Post tags. |
| `status` | `text` | Draft or published state. |
| `created_at` | `timestamptz` | Creation timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |
| `published_at` | `timestamptz` | Optional publish timestamp. |

Useful constraints and indexes:

- Unique index on `slug`
- Index on `status`
- Index on `date`
- Check constraint for allowed `status` values

Recommended status values:

- `draft`
- `published`

## Planned `projects` Table

Possible first version:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `slug` | `text` | Public URL slug. Unique. |
| `title` | `text` | Project title. |
| `description` | `text` | SEO and card summary. |
| `image` | `text` | Public image path or remote image URL. |
| `techstack` | `text[]` | Simple Icons keys used by the UI. |
| `status` | `text` | Project status. |
| `content` | `text` | MDX case study body. |
| `created_at` | `timestamptz` | Creation timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |
| `published_at` | `timestamptz` | Optional publish timestamp. |

Useful constraints and indexes:

- Unique index on `slug`
- Index on `status`
- Check constraint for allowed `status` values

Recommended project status values:

- `in-progress`
- `maintaining`
- `completed`

## Planned `contact_messages` Table

The current contact form sends email through Resend. It does not store messages in the database.

If message storage is added later, a simple first version could be:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `name` | `text` | Sender name. |
| `email` | `text` | Sender email. |
| `subject` | `text` | Message subject. |
| `message` | `text` | Message body. |
| `status` | `text` | Review state. |
| `created_at` | `timestamptz` | Submission timestamp. |

Recommended status values:

- `new`
- `read`
- `archived`

Security note:

Contact messages are user-generated content. Validate lengths, avoid rendering raw HTML, and do not expose the admin inbox publicly.

## Data Access Rules

Use these rules when adding new database-backed features:

- Keep the Neon client in `src/db/client.ts`.
- Keep table-specific SQL in repositories or feature query modules.
- Use `server-only` for database modules.
- Validate data before insert or update.
- Use parameterized SQL through the Neon tagged template.
- Avoid `any`; define row types and mapped return types.
- Return only the fields the caller needs.
- Never return password hashes, token hashes, or sensitive operational fields to Client Components.
- Keep public read models separate from admin edit models when they need different fields.

## CMS Database Direction

If the admin CMS becomes production functionality, prefer database-backed posts and projects.

The future flow should look like this:

```txt
Admin form
  -> Server Action
  -> Zod validation
  -> requireAdmin()
  -> posts/projects repository
  -> Neon PostgreSQL
  -> revalidate public paths
  -> redirect to admin detail page
```

Public rendering would then read published content from Neon:

```txt
Public route
  -> post/project public query
  -> MDXContent
  -> rendered page
```

`MDXContent` can still render MDX stored as a database string. The storage changes, but the rendering layer can stay similar.

## Revalidation Notes

If posts and projects move into Neon, decide how public pages update after admin edits.

Likely paths to revalidate:

- `/`
- `/blog`
- `/blog/[slug]`
- `/projects`
- `/projects/[slug]`

If a slug changes, revalidate both the old path and the new path.

Slug changes after publishing should be handled carefully. A redirect table may be needed later to avoid broken public links.

## Security Notes

- Do not read or print `.env` values.
- Do not expose `NEON_DATABASE_URL`.
- Do not expose password hashes.
- Do not expose session token hashes.
- Do not store raw session tokens in the database.
- Do not store plain-text passwords.
- Keep database modules server-only.
- Validate every mutation on the server.
- Use generic error messages for auth failures.
- Avoid leaking database errors into UI responses.
- Treat contact messages and MDX content as user-controlled input if they are editable from admin forms.

## Operational Checks

After database-related code changes, run:

```bash
bun run lint
```

For schema or query changes, also run:

```bash
bun run build
```

Manual checks should include:

- Admin seed works.
- Login succeeds with the seeded admin user.
- Login fails with invalid credentials.
- Failed login lockout behavior still works.
- Admin session persists until expiration.
- Logout deletes the session.
- Protected `/admin` routes redirect unauthenticated users.

For future CMS database changes, also check:

- Create post.
- Edit post.
- Create project.
- Edit project.
- Public blog and project pages render database content.
- MDX code blocks still render correctly.
- Slug uniqueness errors are handled cleanly.

