# MDX Rendering

This app stores blog posts and project case studies as local `.mdx` files. Public rendering has two paths: one reads metadata and derived values, and the other imports a compiled React component for the article body.

```txt
.mdx file in src/content
  ├─ fs + gray-matter
  │    -> typed metadata, raw body, and derived values
  │    -> page header, metadata, lists, and blog table of contents
  └─ @next/mdx compilation
       -> remark-frontmatter + remark-headings + rehype-pretty-code
       -> compiled component loaded by getPostContent / getProjectContent
       -> rendered inside MDXContentShell
```

The detail pages join these paths on the server. They do not pass the raw body to a runtime `MDXRemote` renderer. `next-mdx-remote` is not a dependency in the current `package.json`.

Admin preview has a separate server-side Markdown compiler, described below. This document describes the current code, including known limitations; it is not a record of passing runtime checks.

## Content and Source Files

| Responsibility | Location |
| --- | --- |
| Blog content | `src/content/blog` |
| Project content | `src/content/projects` |
| Blog metadata and component loading | [post.ts](../src/features/blog/lib/post.ts) |
| Project metadata and component loading | [project.ts](../src/features/projects/lib/project.ts) |
| Public MDX compiler configuration | [next.config.ts](../next.config.ts) |
| Global MDX component registration | [mdx-components.tsx](../src/mdx-components.tsx) |
| Styled Markdown elements | [MDXComponents.tsx](../src/features/blog/components/MDXComponents.tsx) |
| Shared body wrapper | [MDXContentShell.tsx](../src/features/blog/components/MDXContentShell.tsx) |
| Heading collection and compiler plugin | [remark-headings.mjs](../src/features/admin/posts/lib/remark-headings.mjs) |
| Admin preview compiler | [compile-markdown-preview.tsx](../src/features/admin/posts/lib/compile-markdown-preview.tsx) |

Each file has YAML frontmatter followed by its body. The filename supplies the public slug: `src/content/blog/first-post.mdx` maps to `/blog/first-post`.

Both single-item loaders and component loaders accept lowercase letters and numbers separated by single hyphens. Invalid slugs and missing files return `null`. Use filenames such as `first-post.mdx`, without uppercase letters, spaces, underscores, or leading/trailing hyphens.

## Blog Loading

[post.ts](../src/features/blog/lib/post.ts) is marked `server-only` and exports three functions.

### `getAllPosts`

1. Lists `.mdx` files in `src/content/blog`.
2. Reads each file with Node `fs` and separates frontmatter from the body with `gray-matter`.
3. Derives its slug from the filename and normalizes a full `Post`.
4. Returns a `PostSummary`, excluding the raw `content` field.
5. Sorts summaries by date, newest first.

Normalization also calculates reading time and extracts headings, including when building summaries. Reading time is the body word count divided by 225, rounded up; an empty body returns zero.

### `getPostBySlug`

This function validates the slug, checks whether its file exists, reads the file, and returns a normalized `Post`. It does not compile or render the body.

[Post and PostSummary](../src/types/post.ts) contain:

- `slug`, `title`, `description`, and `date`
- `tags`
- `readingTime`
- `headings`, with `text`, `slug`, and `level` for each entry
- `content`, on the full `Post` only

The loader keeps string metadata values and falls back to an empty string for other types. Tags are filtered to strings. This is normalization, not the stricter validation used by the admin form. Keep frontmatter dates quoted so they remain strings.

### `getPostContent`

After validating the slug and checking file existence, this function dynamically imports `@/content/blog/${slug}.mdx` and returns its default export, typed as `MDXContent` from `mdx/types`.

Here `MDXContent` is the type of a compiled component. There is no current `src/features/blog/components/MDXContent.tsx` string renderer. Invalid MDX or module-loading failures are not converted into `null` by this helper.

## Project Loading

[project.ts](../src/features/projects/lib/project.ts) is also marked `server-only` and provides:

- `getAllProjects`: reads and normalizes local files, then returns summaries without the raw body. It does not apply a date sort.
- `getProjectBySlug`: validates the slug and returns a full project, or `null` for an invalid slug or missing file.
- `getProjectContent`: imports `@/content/projects/${slug}.mdx` and returns its compiled default component after the same slug/file checks.

[Project and ProjectSummary](../src/types/project.ts) include `slug`, `title`, `description`, `image`, `techstack`, and `status`. Only the full project includes `content`; projects do not currently include reading time or a table-of-contents field.

The loader filters tech stack entries against [project-tech-icons.ts](../src/constants/project-tech-icons.ts) and removes duplicates. Accepted statuses are `in-progress`, `maintaining`, and `completed`; other values fall back to `in-progress`.

## Public MDX Compilation

[next.config.ts](../next.config.ts) wraps the Next.js configuration with `createMDX` from `@next/mdx` and includes `md` and `mdx` in `pageExtensions`. Current content files and dynamic imports use `.mdx`.

The configured plugins run in this order:

1. `remark-frontmatter` recognizes the YAML block so it is not rendered as article text. Metadata is still read separately with `gray-matter`.
2. The local `remark-headings.mjs` plugin assigns heading IDs on the Markdown syntax tree.
3. `rehype-pretty-code` prepares highlighted code markup using Shiki.

The configuration supplies plugin names as strings and resolves the local heading plugin to an absolute path. This follows the string-based plugin configuration described in the installed Next.js guide for Turbopack.

[src/mdx-components.tsx](../src/mdx-components.tsx) exports `useMDXComponents`, which returns the shared `mdxComponents` mapping. This file registers the styled elements for compiled local MDX in the App Router.

Local MDX is compiled as application code and must be trusted. The admin Markdown-only validator is applied by the admin actions; it is not part of the public compiler configuration and does not restrict files edited directly in the repository.

## Route-Level Rendering

The public detail routes are:

- [Blog detail page](<../src/app/(portfolio)/blog/[slug]/page.tsx>)
- [Project detail page](<../src/app/(portfolio)/projects/[slug]/page.tsx>)

Both are Server Components and follow the same structure:

1. `generateStaticParams` returns slugs from the corresponding summary loader for prerendering.
2. `generateMetadata` reads the normalized metadata for the requested slug.
3. The page awaits `params` and loads metadata and the compiled body in parallel with `Promise.all`.
4. If either result is `null`, the page calls `notFound()`.
5. The page renders its header from normalized metadata and the compiled component as a child of `MDXContentShell`.

The blog page additionally passes `post.headings` to [TableOfContent.tsx](../src/features/blog/components/TableOfContent.tsx), which exports `TableOfContents`. That Client Component owns the active-heading state and scroll tracking. The project page has no table of contents.

The page owns layout and route behavior, the imported component renders the body, and `MDXContentShell` supplies the shared typography wrapper. The shell accepts React children; it does not parse or compile strings and has no client state.

## Styling and Syntax Highlighting

[MDXComponents.tsx](../src/features/blog/components/MDXComponents.tsx) exports mappings for `h1` through `h4`, `p`, `a`, `code`, `pre`, `ul`, `ol`, `li`, and `hr`.

These mappings provide Tailwind styles and forward element props. [MDXContentShell.tsx](../src/features/blog/components/MDXContentShell.tsx) adds `prose` typography, spacing, and dark-mode styles around the body. Both are shared by public blog pages, project pages, and admin preview.

`rehype-pretty-code` uses `theme: "tokyo-night"` and `keepBackground: false`, allowing the app's styles to supply the code block background. These options currently appear in three places:

- `next.config.ts` for public MDX compilation
- `compile-markdown-preview.tsx` for admin preview
- [validate-post-content.ts](../src/features/admin/posts/lib/validate-post-content.ts) for content validation compilation

Keep those options aligned when changing code highlighting. Validation compiles content but does not return the rendered article.

**Known rendering bug:** the `h2`, `h3`, and `h4` mappings currently use block-bodied arrow functions without returning their JSX. They return `undefined`, so those headings cannot render through these mappings. This affects public content and preview, breaks the corresponding table-of-contents targets, and can block TypeScript checking. The heading plugin described below is connected, but that does not mean heading rendering works end to end.

## Heading IDs and Table of Contents

[remark-headings.mjs](../src/features/admin/posts/lib/remark-headings.mjs) exports `collectHeadings` and a default remark plugin that calls it. The same collector is used in three paths:

- Public MDX compilation, through `next.config.ts`
- Blog metadata loading, where `post.ts` parses the body with `createProcessor` from `@mdx-js/mdx` and passes the syntax tree to `collectHeadings`
- Admin preview compilation, through its remark plugin list

Heading extraction uses syntax-tree nodes, not a regular expression over raw Markdown. The collector:

1. Reads heading text, including nested text, inline code, and image alt text.
2. Lowercases and trims it, replaces whitespace with hyphens, and removes characters other than ASCII letters, digits, underscores, and hyphens.
3. Uses `section` if the resulting ID is empty.
4. Adds numeric suffixes until the ID is unique within the document.
5. Writes the ID into the heading node's `data.hProperties` for compilation.
6. Returns table-of-contents entries for heading levels 2 through 6.

For example, repeated `## Setup` headings receive `setup` and `setup-1`. Level-1 headings also reserve IDs but are omitted from the returned table of contents. Heading-looking text inside a fenced code block is not a heading node and is excluded.

The old `slugifyHeading` and `extractTextFromNode` helpers remain in [heading.ts](../src/features/blog/lib/heading.ts), but they no longer drive this pipeline. Their remaining unused imports are cleanup work.

## Admin Markdown Preview and Saving

[PostEditorForm.tsx](../src/features/admin/posts/components/PostEditorForm.tsx) is a Client Component. It owns the body text, Write/Preview selection, preview result, error, and pending state. It sends the article body to server actions; compilation stays on the server.

### Preview

[previewPostAction](../src/features/admin/posts/actions.ts) performs these steps:

1. Calls `requireAdmin()`.
2. Validates the body with `postContentSchema`: it must contain non-whitespace content and be at most 200,000 characters.
3. Calls `validatePostContent`, which parses/compiles as MDX and rejects imports, exports, expressions, and JSX/HTML nodes outside code examples.
4. Calls `compileMarkdownPreview`, which uses `evaluate` from `@mdx-js/mdx` with `format: "md"`, the React JSX runtime, the shared heading plugin, and code highlighting.
5. Returns the rendered preview using the shared component mapping and `MDXContentShell`.

Preview does not write a file. The form uses a request ID to ignore stale responses after switching views or requesting another preview, and displays pending/error feedback. A hidden `content` input preserves the body in form submission while the textarea is replaced by preview.

### Saving

`createPostAction` separately requires the administrator, validates all form fields with [createPostSchema](../src/features/admin/posts/schema/post-schema.ts), and runs the same content validator before writing anything.

[post-file-repository.ts](../src/features/admin/posts/lib/post-file-repository.ts) generates frontmatter with `gray-matter`, checks the slug and destination directory, and creates a new `.mdx` file with an exclusive write (`wx`). An existing filename produces a duplicate-slug error rather than being overwritten.

After a successful write, the action revalidates `/`, `/admin/posts`, `/blog`, and the new detail path, then redirects to `/blog/<slug>`. This does not compile new source modules into an existing production build; see the production limitation below.

The editor accepts a Markdown subset even though the stored extension is `.mdx`. Code examples containing JSX, imports, or expressions must be inside inline backticks or fenced code blocks. Directly authored repository MDX uses the public compiler and does not pass through this validator.

For the fuller editor workflow, see [Building the Post Editor](blue-print-implementation/building-post-editor.md), [Rendering and Headings](blue-print-implementation/post-editor/03-rendering-and-headings.md), and [Markdown Preview](blue-print-implementation/post-editor/04-markdown-preview.md).

## Current Limitations

- The missing JSX returns in `h2`–`h4` remain an implementation bug. Documenting the heading pipeline does not resolve it.
- Public content is backed by local files and compiled modules. Production publishing requires those source files to be included in a build/deployment. Runtime file writes also require a writable filesystem; revalidating a route does not add a new MDX module to the deployed bundle.
- Public loaders normalize frontmatter but do not enforce the admin form's full schema. Invalid manually authored content can fail parsing or compilation.
- Shared styling lives under the blog feature, while the shared heading plugin lives under the admin posts feature. Public rendering therefore depends on a helper located in the admin feature, though that helper contains no authentication or database logic.
- The component mapping covers common elements and does not register custom embedded React widgets. The admin editor explicitly rejects embedded JSX.
- Preview uses Markdown mode while public files compile as MDX. Shared validation, headings, and styles align the supported editor content; preview is not a substitute for checking the saved public page.

See [Verification and Follow-ups](blue-print-implementation/post-editor/05-verification-and-follow-ups.md) for the existing implementation issues and detailed verification scenarios.

## Adding a Blog Post

### Directly in the repository

1. Create `src/content/blog/<slug>.mdx` using a valid lowercase, hyphen-separated slug.
2. Include the required `title`, `description`, and quoted `date`; add tags as a YAML array when needed:

```mdx
---
title: "Post Title"
description: "Short post description."
date: "2026-09-19"
tags: ["Next.js", "MDX"]
---

## Introduction

Write the article body here.
```

3. Use `##` through `######` for entries in the blog table of contents. Rendering of levels 2–4 currently requires fixing the known component bug.
4. Verify the page at `/blog/<slug>` and include the new file in the production build/deployment.

### Through the admin editor

Open `/admin/posts/new`, enter metadata in the form fields, and write only the article body in the content field. Use comma-separated tags in the form. Preview checks the body without requiring completed metadata; Create validates all fields and generates frontmatter before saving.

This currently writes local source files. It is not a database-backed production publishing workflow.

## Adding a Project Case Study

1. Create `src/content/projects/<slug>.mdx` using the same filename rules.
2. Add frontmatter and a body:

```mdx
---
title: "Project Title"
description: "Short project description."
image: "/images/projects/example.jpg"
techstack: ["siNextdotjs", "siTypescript", "siTailwindcss"]
status: "in-progress"
---

## Overview

Write the case study here.
```

3. Replace the example image path with an existing asset, or omit it to use the page's fallback. Choose tech stack keys from `project-tech-icons.ts` and one of the three supported statuses.
4. Verify `/projects/<slug>` and include the file in the production build/deployment.

## Checks After Changes

For documentation-only edits, check referenced paths, compare claims with the source, and run `git diff --check`.

After changing rendering code or content, use the scripts in [package.json](../package.json):

```bash
bun run lint
bun run build
```

There is no dedicated `typecheck` or test script. The production build includes Next.js TypeScript checking and MDX compilation; the known missing heading returns may block it. These commands are verification instructions, not a claim that checks have passed.

For interactive checks, run `bun run dev`. After a successful production build, use `bun run start` to check production behavior.

Manually verify:

- `/blog`, a real `/blog/<slug>`, `/projects`, and a real `/projects/<slug>`
- Invalid or missing slugs and their not-found behavior
- Frontmatter-derived headers, reading time, code blocks, links, and light/dark styles
- Visible headings and table-of-contents targets, including duplicate headings, formatted text, non-ASCII-only headings, and code fences containing heading-like text
- Admin preview success, validation errors, loading feedback, and stale-response handling
- Rejection of expressions, imports, exports, and JSX/HTML outside code examples in both Preview and Create
- Successful local creation, duplicate-slug rejection, and the saved public page
- Production inclusion of newly authored files separately from route cache invalidation

The [editor verification chapter](blue-print-implementation/post-editor/05-verification-and-follow-ups.md) contains the detailed fixtures and expected outcomes.
