# Content Management System TODO

This document plans the admin content management system for viewing, creating, and editing blog posts and projects.

The current app renders public posts and projects from local MDX files:

- Blog posts: `src/content/blog/*.mdx`
- Projects: `src/content/projects/*.mdx`

The current admin routes already exist, but they are mostly placeholder pages:

- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/[postId]`
- `/admin/posts/[postId]/edit`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[projectId]`
- `/admin/projects/[projectId]/edit`

## Goal

Build a simple owner-only CMS inside the existing protected admin dashboard.

The CMS should let the admin:

- View all posts
- View one post
- Create a new post
- Edit an existing post
- View all projects
- View one project
- Create a new project
- Edit an existing project

Deletion can be deferred until the create/edit flow is stable.

## Important Architecture Decision

Before implementation, choose where CMS content will be stored.

### Option A: Database-backed CMS

Store posts and projects in Neon PostgreSQL.

This is the recommended production path if the admin dashboard should work after deployment.

Pros:

- Works in production.
- Content edits persist immediately.
- Easier to build admin create/edit flows.
- Can support drafts, publishing, timestamps, and search later.
- Matches the project direction of using Neon for posts and projects.

Cons:

- Requires schema design and migrations.
- Public MDX loaders must be adapted to read from the database.
- Need a strategy for rendering MDX content from database strings.

### Option B: Git-backed MDX CMS

Keep MDX files as the source of truth, but make admin edits commit changes through a Git provider API.

Pros:

- Preserves the current file-based MDX workflow.
- Content changes remain version-controlled.
- Public rendering can stay close to the current structure.

Cons:

- More operational complexity.
- Requires GitHub token handling and commit logic.
- Content updates require a deploy or revalidation strategy.
- Not necessary for a simple personal portfolio unless versioned editorial workflow matters.

### Option C: Local file-based MDX CMS

Write directly to `src/content/blog` and `src/content/projects` from admin actions.

Pros:

- Smallest change for local development.
- Reuses the current MDX file structure.

Cons:

- Not production-safe on most serverless hosts.
- File writes may be read-only or lost between deployments.
- Can create security and path traversal risks if not carefully guarded.

Recommended decision:

Start with Option A if the CMS must work in production. Use Option C only as a local development tool, not as the deployed CMS.

## Mental Model

Separate the CMS into four layers:

1. **Admin routes** render protected pages under `/admin`.
2. **Server loaders** read posts/projects for admin views.
3. **Server actions** handle create and edit mutations.
4. **Validation and persistence** enforce safe content shape before saving.

Reads should happen in Server Components where possible.

Mutations from admin forms should use Server Actions because this is internal UI, not an external API.

Route Handlers should be reserved for external integrations, uploads, webhooks, or endpoints that must be consumed outside the app.

## Phase 1: Confirm Content Storage

- [ ] Decide whether posts/projects will be stored in Neon PostgreSQL, Git-backed MDX files, or local MDX files.
- [ ] If using Neon, design `posts` and `projects` tables before editing schema.
- [ ] If using MDX files, document whether the CMS is local-only or production-supported.
- [ ] Decide whether slugs are editable after creation.
- [ ] Decide whether content supports only published content at first or includes drafts.
- [ ] Decide whether project images are selected from existing `public` assets or uploaded through admin.

## Phase 2: Define Content Models

### Blog Post Fields

- [ ] `id` or stable slug identifier
- [ ] `slug`
- [ ] `title`
- [ ] `description`
- [ ] `date`
- [ ] `tags`
- [ ] `content`
- [ ] `createdAt`
- [ ] `updatedAt`
- [ ] Optional: `publishedAt`
- [ ] Optional: `status` with `draft` and `published`

### Project Fields

- [ ] `id` or stable slug identifier
- [ ] `slug`
- [ ] `title`
- [ ] `description`
- [ ] `image`
- [ ] `techstack`
- [ ] `status`
- [ ] `content`
- [ ] `createdAt`
- [ ] `updatedAt`
- [ ] Optional: `publishedAt`

### Validation Rules

- [ ] Require non-empty titles.
- [ ] Require unique slugs.
- [ ] Normalize slugs from titles when creating content.
- [ ] Reject unsafe slug characters.
- [ ] Validate post dates.
- [ ] Validate project status values: `in-progress`, `maintaining`, `completed`.
- [ ] Validate project tech stack keys against `src/constants/project-tech-icons.ts`.
- [ ] Limit content length to a practical maximum.
- [ ] Keep validation shared between create and edit actions.

## Phase 3: Data Access Layer

Create a content-management data layer instead of putting persistence logic inside page components.

Recommended locations:

```txt
src/features/admin/posts
src/features/admin/projects
```

Potential files:

```txt
src/features/admin/posts/actions.ts
src/features/admin/posts/schema.ts
src/features/admin/posts/queries.ts
src/features/admin/posts/components/PostForm.tsx
src/features/admin/posts/components/PostTable.tsx
src/features/admin/projects/actions.ts
src/features/admin/projects/schema.ts
src/features/admin/projects/queries.ts
src/features/admin/projects/components/ProjectForm.tsx
src/features/admin/projects/components/ProjectTable.tsx
```

Keep server-only reads in query modules.

Keep mutations in Server Actions.

Keep form UI in focused components.

## Phase 4: Admin Post Views

### `/admin/posts`

- [ ] Replace placeholder page with a Server Component.
- [ ] Load all posts through an admin-safe query.
- [ ] Render a table or list with title, slug, date, tags, reading time, and last updated date.
- [ ] Add a link to `/admin/posts/new`.
- [ ] Add links to view and edit each post.
- [ ] Add empty state when no posts exist.
- [ ] Add basic search/filter only after the table works.

### `/admin/posts/[postId]`

- [ ] Load one post by ID or slug.
- [ ] Show title, description, date, tags, slug, and content preview.
- [ ] Render the MDX preview with the existing `MDXContent` renderer if safe.
- [ ] Add link to edit page.
- [ ] Use `notFound()` when the post does not exist.

## Phase 5: Admin Post Create Flow

### `/admin/posts/new`

- [ ] Build a post form with fields for title, slug, description, date, tags, and MDX content.
- [ ] Generate a slug preview from the title.
- [ ] Allow manual slug edits if needed.
- [ ] Validate with Zod before saving.
- [ ] Save through a Server Action.
- [ ] Redirect to the new post detail page after successful creation.
- [ ] Revalidate affected public paths after saving.
- [ ] Show clear form errors without exposing server internals.

Suggested Server Action behavior:

1. Require admin session.
2. Parse and validate form data.
3. Check slug uniqueness.
4. Save post.
5. Revalidate `/blog`, `/`, and the new `/blog/[slug]` path.
6. Redirect to `/admin/posts/[postId]`.

## Phase 6: Admin Post Edit Flow

### `/admin/posts/[postId]/edit`

- [ ] Load the existing post.
- [ ] Pre-fill the same form used by create.
- [ ] Validate edits with the same schema.
- [ ] Save through a Server Action.
- [ ] Handle slug changes carefully.
- [ ] Revalidate old and new public paths if the slug changes.
- [ ] Redirect back to the post detail page after saving.

Slug policy recommendation:

- For the MVP, keep slugs editable only before publishing.
- If slugs can change after publishing, add redirects later to avoid broken links.

## Phase 7: Admin Project Views

### `/admin/projects`

- [ ] Replace placeholder page with a Server Component.
- [ ] Load all projects through an admin-safe query.
- [ ] Render a table or list with title, slug, status, tech stack, image, and last updated date.
- [ ] Add a link to `/admin/projects/new`.
- [ ] Add links to view and edit each project.
- [ ] Add empty state when no projects exist.

### `/admin/projects/[projectId]`

- [ ] Load one project by ID or slug.
- [ ] Show title, description, status, image, tech stack, slug, and content preview.
- [ ] Render the MDX preview with the existing `MDXContent` renderer if safe.
- [ ] Add link to edit page.
- [ ] Use `notFound()` when the project does not exist.

## Phase 8: Admin Project Create Flow

### `/admin/projects/new`

- [ ] Build a project form with fields for title, slug, description, image, tech stack, status, and MDX content.
- [ ] Use a controlled selector or checkbox group for known tech stack keys.
- [ ] Use a select input for project status.
- [ ] Validate with Zod before saving.
- [ ] Save through a Server Action.
- [ ] Redirect to the new project detail page after successful creation.
- [ ] Revalidate affected public paths after saving.

Suggested Server Action behavior:

1. Require admin session.
2. Parse and validate form data.
3. Check slug uniqueness.
4. Save project.
5. Revalidate `/projects`, `/`, and the new `/projects/[slug]` path.
6. Redirect to `/admin/projects/[projectId]`.

## Phase 9: Admin Project Edit Flow

### `/admin/projects/[projectId]/edit`

- [ ] Load the existing project.
- [ ] Pre-fill the same form used by create.
- [ ] Validate edits with the same schema.
- [ ] Save through a Server Action.
- [ ] Handle image path changes.
- [ ] Handle slug changes carefully.
- [ ] Revalidate old and new public paths if the slug changes.
- [ ] Redirect back to the project detail page after saving.

## Phase 10: Shared Form UX

- [ ] Reuse form components between create and edit pages.
- [ ] Keep form state inside Client Components only where interactivity is needed.
- [ ] Keep validation rules on the server as the source of truth.
- [ ] Add pending states for submit buttons.
- [ ] Add field-level errors.
- [ ] Add a plain text MDX editor first.
- [ ] Add preview mode after basic save behavior works.
- [ ] Avoid adding a heavy rich text editor for the MVP.

## Phase 11: MDX Preview

- [ ] Reuse `MDXContent` for preview where possible.
- [ ] Add a preview tab or side-by-side preview only after the basic editor works.
- [ ] Verify code blocks render with Shiki.
- [ ] Verify headings generate stable IDs.
- [ ] Verify blog table of contents still works after created or edited posts.

## Phase 12: Security Checklist

- [ ] Require `requireAdmin()` for every admin page.
- [ ] Require admin verification inside every Server Action.
- [ ] Do not expose session data, password hashes, or secret values to Client Components.
- [ ] Validate all form inputs on the server.
- [ ] Reject unsafe slugs and paths.
- [ ] Prevent path traversal if MDX files are used.
- [ ] Do not allow arbitrary filesystem writes from user-controlled paths.
- [ ] Keep database errors generic in UI messages.
- [ ] Log operational errors only on the server.

## Phase 13: Database Plan If Using Neon

Do not run migrations until the schema is reviewed.

Potential `posts` table:

- [ ] `id uuid primary key`
- [ ] `slug text not null unique`
- [ ] `title text not null`
- [ ] `description text not null`
- [ ] `content text not null`
- [ ] `date date not null`
- [ ] `tags text[] not null default '{}'`
- [ ] `status text not null default 'draft'`
- [ ] `created_at timestamptz not null default now()`
- [ ] `updated_at timestamptz not null default now()`
- [ ] `published_at timestamptz`

Potential `projects` table:

- [ ] `id uuid primary key`
- [ ] `slug text not null unique`
- [ ] `title text not null`
- [ ] `description text not null`
- [ ] `image text`
- [ ] `techstack text[] not null default '{}'`
- [ ] `status text not null`
- [ ] `content text not null`
- [ ] `created_at timestamptz not null default now()`
- [ ] `updated_at timestamptz not null default now()`
- [ ] `published_at timestamptz`

Useful indexes:

- [ ] Unique index on `posts.slug`
- [ ] Index on `posts.status`
- [ ] Index on `posts.date`
- [ ] Unique index on `projects.slug`
- [ ] Index on `projects.status`

## Phase 14: Public Rendering Changes If Using Database

- [ ] Update public blog loaders to read posts from the database.
- [ ] Update public project loaders to read projects from the database.
- [ ] Keep `MDXContent` as the rendering layer.
- [ ] Keep `generateMetadata` based on stored title and description.
- [ ] Revisit `generateStaticParams` behavior for database content.
- [ ] Decide whether pages should be static, dynamic, or revalidated.
- [ ] Add a migration or import script if existing MDX files should move into the database.

## Phase 15: Manual QA

For posts:

- [ ] Create a new post.
- [ ] View it in `/admin/posts`.
- [ ] View its admin detail page.
- [ ] Edit its title, description, tags, and content.
- [ ] Confirm public `/blog` updates.
- [ ] Confirm public `/blog/[slug]` renders.
- [ ] Confirm code blocks render correctly.
- [ ] Confirm table of contents links work.

For projects:

- [ ] Create a new project.
- [ ] View it in `/admin/projects`.
- [ ] View its admin detail page.
- [ ] Edit its title, description, status, tech stack, image, and content.
- [ ] Confirm public `/projects` updates.
- [ ] Confirm public `/projects/[slug]` renders.
- [ ] Confirm project tech icons render correctly.

General checks:

- [ ] Run `bun run lint`.
- [ ] Run `bun run build`.
- [ ] Test unauthenticated access redirects to `/login`.
- [ ] Test invalid form submissions.
- [ ] Test duplicate slug handling.
- [ ] Test dark mode rendering.
- [ ] Test mobile admin layout.

## MVP Scope Recommendation

Build in this order:

1. Database decision and schema plan.
2. Post list and post detail.
3. Post create.
4. Post edit.
5. Project list and project detail.
6. Project create.
7. Project edit.
8. MDX preview.
9. Draft/published workflow.
10. Delete/archive behavior.

Keep the MVP simple:

- No rich text editor.
- No image uploads at first.
- No bulk actions.
- No multi-user roles.
- No revision history.
- No scheduled publishing.

Add those only after the basic owner-only CMS is stable.

