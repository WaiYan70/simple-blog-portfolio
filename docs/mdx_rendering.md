# MDX Rendering

This app uses file-based MDX for blog posts and project case studies. The rendering flow is intentionally simple:

```txt
.mdx file
  -> read from src/content
  -> parse frontmatter with gray-matter
  -> normalize into a typed object
  -> load from an App Router page
  -> render content with next-mdx-remote/rsc
  -> style elements with custom MDX components
```

## Where MDX Content Lives

Blog posts live in:

```txt
src/content/blog
```

Project case studies live in:

```txt
src/content/projects
```

Each `.mdx` file uses frontmatter at the top of the file. The file name becomes the public slug.

For example:

```txt
src/content/blog/first-post.mdx
```

becomes:

```txt
/blog/first-post
```

## Blog MDX Flow

Blog loading logic lives in:

```txt
src/features/blog/lib/post.ts
```

The main functions are:

- `getAllPosts`
- `getPostBySlug`

### `getAllPosts`

`getAllPosts` is used when the app needs a list of blog posts, such as the blog index page or static route generation.

It does this:

1. Reads every `.mdx` file from `src/content/blog`.
2. Reads each file as text with Node `fs`.
3. Parses frontmatter and body content with `gray-matter`.
4. Creates the slug from the file name.
5. Normalizes the data into a `Post`.
6. Converts the full post into a `PostSummary`.
7. Sorts posts by date, newest first.

### `getPostBySlug`

`getPostBySlug` is used for an individual blog detail page.

It does this:

1. Builds a file path from the requested slug.
2. Returns `null` if the file does not exist.
3. Reads the `.mdx` file.
4. Parses frontmatter and content.
5. Normalizes the result into a full `Post`.

The normalized blog post shape is defined in:

```txt
src/types/post.ts
```

It includes:

- `slug`
- `title`
- `description`
- `content`
- `date`
- `tags`
- `readingTime`
- `headings`

## Project MDX Flow

Project loading logic lives in:

```txt
src/features/projects/lib/project.ts
```

The main functions are:

- `getAllProjects`
- `getProjectBySlug`

The project flow is similar to the blog flow:

1. Read `.mdx` files from `src/content/projects`.
2. Parse frontmatter and content with `gray-matter`.
3. Derive the slug from the file name.
4. Normalize the data into a typed `Project`.
5. Return either a full project or a summary.

The normalized project shape is defined in:

```txt
src/types/project.ts
```

It includes:

- `slug`
- `title`
- `description`
- `content`
- `image`
- `techstack`
- `status`

The project loader validates project status values and tech stack icon keys before exposing them to the UI.

## Route-Level Rendering

Blog detail pages are rendered from:

```txt
src/app/(portfolio)/blog/[slug]/page.tsx
```

Project detail pages are rendered from:

```txt
src/app/(portfolio)/projects/[slug]/page.tsx
```

Both pages follow the same pattern:

1. Use `generateStaticParams` to create static routes from all MDX files.
2. Use `generateMetadata` to build page metadata from frontmatter.
3. Load a single post or project by slug.
4. Return `notFound()` if the slug does not match an MDX file.
5. Render the page header from frontmatter.
6. Pass the raw MDX body content into `MDXContent`.

The important detail is that the page owns the route and layout, while `MDXContent` owns rendering the MDX body.

## Shared MDX Renderer

Both blog posts and project case studies use the same renderer:

```txt
src/features/blog/components/MDXContent.tsx
```

`MDXContent` receives a plain string:

```ts
type Props = {
  content: string;
};
```

Then it renders the string with:

```txt
next-mdx-remote/rsc
```

The renderer uses `MDXRemote` from:

```ts
import { MDXRemote } from "next-mdx-remote/rsc";
```

Because this app uses the RSC version, MDX rendering can happen in Server Components.

## Syntax Highlighting

Code block highlighting is configured inside `MDXContent`.

The app uses:

```txt
rehype-pretty-code
```

with Shiki through this option:

```ts
theme: "tokyo-night"
```

The current renderer also sets:

```ts
keepBackground: false
```

That allows the app's own Tailwind styling to control the code block background instead of keeping the full Shiki theme background.

## Custom MDX Components

Custom element mappings live in:

```txt
src/features/blog/components/MDXComponents.tsx
```

The exported object is:

```ts
mdxComponents
```

It maps normal Markdown/HTML elements to styled React components:

- `h1`
- `h2`
- `h3`
- `h4`
- `p`
- `a`
- `code`
- `pre`
- `ul`
- `ol`
- `li`
- `hr`

This is where the app controls typography, spacing, link styles, inline code styles, code block styles, and heading anchors.

## Heading IDs and Table of Contents

Heading helpers live in:

```txt
src/features/blog/lib/heading.ts
```

The two main helpers are:

- `slugifyHeading`
- `extractTextFromNode`

For rendered MDX headings, `MDXComponents.tsx` adds `id` attributes to `h2`, `h3`, and `h4`.

For example, this MDX:

```mdx
## Why MDX Works Here
```

becomes a heading with this id:

```txt
why-mdx-works-here
```

Blog posts also extract headings from the raw MDX content in `post.ts`. Those extracted headings are passed to:

```txt
src/features/blog/components/TableOfContent.tsx
```

That is what powers the "On this page" navigation on blog detail pages.

## Why Frontmatter and Content Are Separated

`gray-matter` splits an MDX file into two parts:

- `data` - frontmatter metadata
- `content` - the MDX body

The app uses frontmatter for page-level UI and metadata:

- title
- description
- date
- tags
- image
- status
- tech stack
- Open Graph metadata

The app uses `content` only for the article or case study body.

This separation keeps route pages simple:

- frontmatter renders the page shell
- MDX content renders the long-form body

## Current Limitations

- MDX files are read from the local filesystem, so content changes require a code/content deploy in production.
- Blog heading extraction uses a regular expression against raw MDX content.
- The shared `MDXContent` renderer is located under the blog feature, even though projects also use it.
- MDX component mappings currently cover common Markdown elements only.
- Custom embedded React components are not documented as a supported content pattern yet.

## Adding a New Blog Post

1. Create a new `.mdx` file in `src/content/blog`.
2. Add frontmatter:

```mdx
---
title: "Post Title"
description: "Short post description."
date: "2026-06-27"
tags: ["Next.js", "MDX"]
---
```

3. Write the body in MDX.
4. Use headings from `##` onward if the post should appear in the table of contents.
5. Run the app and visit `/blog/[slug]`.

## Adding a New Project Case Study

1. Create a new `.mdx` file in `src/content/projects`.
2. Add frontmatter:

```mdx
---
title: "Project Title"
description: "Short project description."
image: "/images/projects/example.jpg"
techstack: ["siNextdotjs", "siTypescript", "siTailwindcss"]
status: "in-progress"
---
```

3. Write the project body in MDX.
4. Run the app and visit `/projects/[slug]`.

## Checks After MDX Changes

After changing MDX rendering code, run:

```bash
bun run lint
```

For rendering changes, also run the app locally:

```bash
bun dev
```

Then manually verify:

- `/blog`
- `/blog/[slug]`
- `/projects`
- `/projects/[slug]`
- code block rendering
- heading anchor links
- blog table of contents
- dark mode styles

