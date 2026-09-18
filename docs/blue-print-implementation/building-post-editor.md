# Building a Local Markdown Post Editor

This tutorial follows the admin post editor from a form in the browser to a local blog post. Start here for the architecture, then read one chapter at a time. Each chapter explains the purpose of its code, traces the data flow, and points you to the relevant source files.

## What we are building

The administrator enters metadata and an article body, previews the draft, and creates a new file in `src/content/blog`. Each file contains YAML frontmatter followed by Markdown:

```mdx
---
title: "Building My Portfolio with Next.js"
description: "Why I chose a blog-first portfolio."
date: "2026-03-26"
tags: ["Next.js", "MDX"]
---

# Building My Portfolio with Next.js

This is the article body.
```

The filename supplies the slug and public URL. For example, `building-my-portfolio.mdx` becomes `/blog/building-my-portfolio`. The editor generates the frontmatter from separate fields; the author writes only the body in the textarea.

The goal is a small, understandable authoring workflow: enter a draft, preview it, correct validation errors, save without overwriting an existing post, and open the result in local development. Editing and deleting posts are later phases.

## Read the tutorial in order

| Chapter | What you will learn |
| --- | --- |
| [1. Form and schema](post-editor/01-form-and-schema.md) | Choose component boundaries, connect form fields, validate their shape, and display errors |
| [2. Validation and saving](post-editor/02-validation-and-saving.md) | Enforce Markdown-only content, write a file safely, handle failures, and invalidate affected routes |
| [3. Rendering and headings](post-editor/03-rendering-and-headings.md) | Compile local MDX, load metadata, and keep heading IDs consistent with the table of contents |
| [4. Markdown preview](post-editor/04-markdown-preview.md) | Preview unsaved content, handle pending and error states, and ignore outdated responses |
| [5. Verification and follow-ups](post-editor/05-verification-and-follow-ups.md) | Check the complete workflow, investigate remaining bugs, and understand production limits |

If you are changing one part of the feature, open its chapter directly. The fifth chapter owns the verification checklist and current follow-up status so those details do not drift across several files.

## Mental model: four responsibilities

| Boundary | Owns | Main source |
| --- | --- | --- |
| Browser form | Draft state, view selection, submission, and feedback | `PostEditorForm.tsx` |
| Server Action | Authorization, validation order, error mapping, and navigation | `actions.ts` |
| File repository | Path checks, frontmatter serialization, and exclusive file creation | `post-file-repository.ts` |
| Public renderer | Metadata, compiled article content, and heading navigation | `post.ts`, `@next/mdx`, and `remark-headings.mjs` |

Keep these boundaries in mind as you read. For example, a duplicate filename belongs to the repository, but deciding to show that problem beside the slug input belongs to the action and form.

### Saving a post

```text
Create page (Server Component)
  -> PostEditorForm (Client Component)
  -> createPostAction
       -> requireAdmin
       -> Zod field validation
       -> Markdown-only content validation
       -> createPostFile
       -> invalidate affected routes
       -> redirect to /blog/<slug>

Saved .mdx file
  -> @next/mdx compilation with remarkHeadings
  -> public blog page
```

The last compilation step is available through the local development workflow. Publishing a newly created source module in production requires a rebuild; cache invalidation alone does not compile new modules.

### Previewing a draft

```text
Current textarea content
  -> previewPostAction
       -> requireAdmin
       -> body schema and Markdown-only content validation
       -> compileMarkdownPreview with format: "md" and remarkHeadings
  -> rendered React preview
  -> display only if its request ID is still current
```

Preview has no file-write step. It uses the same visual components and heading algorithm as public rendering while keeping MDX execution disabled for the submitted text.

## Understand the content tools

- **Zod** validates field shapes, limits, and transformations.
- **`gray-matter`** reads and writes YAML frontmatter; it does not render the article.
- **`@mdx-js/mdx`** checks content with the Markdown-only validation plugin and separately renders unsaved Markdown previews on the server.
- **`@next/mdx`** compiles trusted local files into components for public pages.
- **`remark-headings.mjs`** supplies the shared heading collection and unique-ID algorithm used by the post loader and both renderers.

The file extension is `.mdx`, but the editor deliberately accepts a Markdown-only subset that also parses under the MDX grammar. Expressions, imports, exports, and JSX/HTML outside code examples are rejected. The detailed policy belongs to [Chapter 2](post-editor/02-validation-and-saving.md).

## Scope and constraints

Only an authenticated administrator may create or preview a post. The browser owns the form state; validation, compilation, and filesystem access remain on the server. Slugs are validated as both filenames and URL segments, and creating a post must never overwrite an existing file.

Local files remain the source of truth for this learning phase. Moving posts to the project's planned Neon PostgreSQL database is deferred. A deployed serverless filesystem is not a durable content store; see [production persistence limits](post-editor/05-verification-and-follow-ups.md#3-local-writes-are-not-production-persistence).

## Current status and how to use the examples

The code includes Markdown-only validation, homepage invalidation, and parsed heading collection. The [verification chapter](post-editor/05-verification-and-follow-ups.md) records the remaining rendering bug, clearer-error-message follow-up, and checks still needed before declaring the complete flow verified.

Read the snippets alongside the linked source files. They are focused teaching excerpts, not complete files to paste over the implementation. Future design sketches are labeled as proposals. This documentation series does not itself modify application code, install dependencies, or run migrations.

Start with [Chapter 1: Form and schema](post-editor/01-form-and-schema.md).
