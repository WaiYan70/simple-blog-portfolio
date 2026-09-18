# 3. Render Posts and Build Reliable Heading Links

[Overview](../building-post-editor.md) · [Previous chapter](02-validation-and-saving.md) · [Next chapter](04-markdown-preview.md)

A post has two public representations: the article that the reader sees and the metadata used to describe and navigate it. The body becomes a compiled React component; the title, reading time, and table of contents come from the post loader.

Those two paths must agree about headings. We will first trace how a saved file becomes a page, then follow one heading from its parsed node to its HTML ID and table-of-contents link.

## Files to follow

| File | What to look for |
| --- | --- |
| [next.config.ts](../../../next.config.ts) | The public MDX plugin pipeline |
| [mdx-components.tsx](../../../src/mdx-components.tsx) | The App Router component mapping |
| [post.ts](../../../src/features/blog/lib/post.ts) | Metadata, reading time, heading extraction, and content imports |
| [remark-headings.mjs](../../../src/features/admin/posts/lib/remark-headings.mjs) | Heading text, unique IDs, and the remark plugin |
| [MDXComponents.tsx](../../../src/features/blog/components/MDXComponents.tsx) | Styled elements and forwarded heading props |
| [Blog detail page](<../../../src/app/(portfolio)/blog/[slug]/page.tsx>) | Joining metadata and the compiled article |
| [TableOfContent.tsx](../../../src/features/blog/components/TableOfContent.tsx) | Anchor links and active-section state |

The current rendering follow-up is tracked in the [verification chapter](05-verification-and-follow-ups.md#4-heading-collection-is-shared-heading-rendering-still-needs-a-fix). The steps below describe the intended rendering contract and the integrations already present; they do not claim the complete flow has passed testing.

## Step 1: Configure local MDX rendering

Configure Next.js to compile local `.mdx` files and expose the existing custom Markdown elements globally.

### Why this step matters

Public posts should be normal compiled React components instead of runtime strings. This removes the need for `next-mdx-remote` in the local-file architecture.

### Follow the implementation

- `@next/mdx` integrates MDX compilation into Next.js.
- `remark-frontmatter` recognizes the existing YAML block so it is not rendered as article content.
- `remark-headings.mjs` assigns heading IDs during public compilation.
- `rehype-pretty-code` generates highlighted code markup.
- `src/mdx-components.tsx` supplies the required App Router component mapping.
- The public post loader dynamically imports the compiled file by slug.

### Design choices

- Local MDX is compiled as application code, so it must be trusted.
- A newly added post becomes part of the build module graph. Production publication requires a rebuild/redeployment.
- The file is also read with `gray-matter` for metadata and article content. Reading time is derived from the body; headings are collected from a parsed syntax tree using the shared heading helper.

### Read the focused example

```ts
// next.config.ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      resolve(process.cwd(), "src/features/admin/posts/lib/remark-headings.mjs"),
    ],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        { theme: "tokyo-night", keepBackground: false },
      ],
    ],
  },
});

export default withMDX(nextConfig);
```

Read the plugins in pipeline order. `remark-frontmatter` recognizes the YAML block so it is not treated as visible article text. The heading plugin works on the Markdown tree and adds heading properties. `rehype-pretty-code` works later on the HTML tree to prepare highlighted code markup.

The configuration refers to plugins by strings, including the resolved path to the local `.mjs` module. This keeps the build configuration serializable for Turbopack. Preview runs its compiler directly on the server and can import the plugin function instead; both paths still use the same implementation.

```tsx
// src/mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/features/blog/components/MDXComponents";

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
```

```ts
// Focused part of features/blog/lib/post.ts
export const getPostContent = async (
  slug: string,
): Promise<MDXContent | null> => {
  if (!postSlugPattern.test(slug)) return null;

  const filePath = path.join(postDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const postModule = (await import(
    `@/content/blog/${slug}.mdx`
  )) as PostMdxModule;

  return postModule.default;
};
```

The detail page loads metadata and compiled content in parallel:

```tsx
const [post, PostContent] = await Promise.all([
  getPostBySlug(slug),
  getPostContent(slug),
]);

if (!post || !PostContent) return notFound();

return (
  <MDXContentShell>
    <PostContent />
  </MDXContentShell>
);
```

Because the route already exports `generateStaticParams()`, existing post routes are statically generated during the production build. They are Server Components, but they are not request-time SSR pages.

### Follow one saved file through both loaders

Suppose the route is `/blog/my-first-post`. `getPostBySlug()` reads `my-first-post.mdx`, parses its frontmatter with `gray-matter`, and normalizes the metadata and body into a `Post`. It also calculates reading time and collects headings from the body. The reading-time estimate divides the whitespace-separated word count by 225 and rounds up; it is an estimate rather than a measurement of reading speed.

At the same time, `getPostContent()` loads the default export of the compiled `.mdx` module. The page renders that component inside `MDXContentShell`, alongside metadata from the first loader. `Promise.all` lets these independent loads start together.

This also explains why the post object can contain a raw `content` string even though the page renders `PostContent`: the string supports derived data, while the imported component supplies the visible article. The summaries used by the homepage and blog index omit the raw content.

The App Router mapping in `src/mdx-components.tsx` connects generated Markdown elements to the project's styled components. Those components should add presentation while preserving props such as heading IDs supplied by the compiler.

## Step 2: Share heading collection and IDs across rendering paths

Replace regular-expression heading extraction with `collectHeadings()` in `src/features/admin/posts/lib/remark-headings.mjs`. The same module exports the default `remarkHeadings` plugin used by both renderers.

### Why this step matters

The table of contents must link to the IDs actually assigned to article headings. A regular expression cannot distinguish a real heading from `## Example` inside a fenced code block, and independent slug generation cannot reliably handle repeated headings.

### Follow the implementation

1. Walk parsed nodes and process only nodes with `type: "heading"`.
2. Extract visible text recursively, including inline code, nested emphasis/link text, and image alt text.
3. Lowercase and trim the text, replace whitespace with hyphens, and remove characters outside `\w` and `-`.
4. Use `section` if the resulting base ID is empty.
5. Keep a fresh `usedIds` set for each document and add numeric suffixes until each ID is unique.
6. Store the ID in `node.data.hProperties.id` so the compiler passes it to the rendered element.
7. Return `{ text, slug, level }` entries for levels 2–6. Level 1 receives an ID and participates in collision detection but is omitted from the table of contents.

The three integration points are:

| Consumer | Integration |
| --- | --- |
| Public `.mdx` compilation | `next.config.ts` loads the default plugin through its resolved `.mjs` path |
| Unsaved preview | `compile-markdown-preview.tsx` imports `remarkHeadings` and adds it to `remarkPlugins` |
| Table-of-contents data | `post.ts` parses the body and calls the named `collectHeadings` export |

### Design choices

- The shared implementation prevents slug rules from drifting between the table of contents and renderers. It does not reuse one in-memory tree across all three paths.
- Parsed code blocks contain code text, not heading nodes, so heading-looking lines inside fences are excluded. Setext headings and headings with inline formatting are recognized by the parser.
- Duplicate `## Setup` headings receive `setup`, `setup-1`, and `setup-2`. The collision loop also accounts for headings whose text already contains a numeric suffix.
- The current slug rule removes non-ASCII letters. Such headings may fall back to `section`, `section-1`, and so on; Unicode-preserving IDs can be considered later.
- The helper currently lives under the admin feature even though public rendering imports it. Moving it to a shared content folder is optional cleanup, not required for this change.

### Read the focused example

The table-of-contents loader now uses the parser instead of a heading regex:

```ts
// features/blog/lib/post.ts
import { createProcessor } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import { collectHeadings } from "../../admin/posts/lib/remark-headings.mjs";

const headingParser = createProcessor({
  format: "mdx",
  remarkPlugins: [remarkFrontmatter],
});

const extractHeadings = (content: string): Heading[] => {
  const tree = headingParser.parse(content);
  return collectHeadings(tree);
};
```

Calling `headingParser.parse(content)` gives the loader a Markdown tree. The explicit `collectHeadings(tree)` call performs the heading walk for this path. During compilation, the default `remarkHeadings` plugin performs that same walk as a transform. The named export returns the collected list to the loader; the default export attaches IDs for rendering.

### Walk through a heading collision

Consider these headings in one article, with no earlier headings using the same IDs:

```md
## Setup
## Setup
## Setup-1
```

| Heading | First candidate | Assigned ID | Reason |
| --- | --- | --- | --- |
| First `Setup` | `setup` | `setup` | The ID is unused |
| Second `Setup` | `setup` | `setup-1` | `setup` is already used |
| `Setup-1` | `setup-1` | `setup-1-1` | The complete base is already used |

The loop checks the complete set of assigned IDs, not just how many times identical text appeared. Otherwise a literal `Setup-1` heading could collide with an automatically suffixed ID. The set is created inside `collectHeadings()`, so a second article starts fresh.

Level-one headings also reserve IDs even though the table of contents starts at level two. If `# Setup` appears first, a later `## Setup` receives `setup-1`. Both rendering and collection must follow that same rule.

### Connect parsed text to an actual anchor

For `## Install **Bun**`, the parser creates a heading with text and emphasis children. `headingText()` walks those children and collects `Install Bun`; it does not include Markdown punctuation in the label. The collector derives `install-bun` and attaches it to `node.data.hProperties.id`.

The complete chain is:

```text
Parsed heading: Install Bun
  -> assigned ID: install-bun
  -> rendered heading receives id="install-bun"
  -> collected entry has slug: "install-bun"
  -> table-of-contents link uses href="#install-bun"
```

The styled heading components must return their JSX and forward the supplied `id` through their props. They should not regenerate an ID from React children. See the [current renderer follow-up](05-verification-and-follow-ups.md#4-heading-collection-is-shared-heading-rendering-still-needs-a-fix) before treating this end-to-end contract as verified.

`TableOfContents` is a Client Component because it uses scrolling and DOM positions to track the active section. It receives the headings from the server; it does not need to parse the body again. Its local `activeId` state controls highlighting, while the browser's normal anchor behavior handles navigation. Missing rendered IDs break both linking and active-section lookup even when the heading list itself is correct.

## Check your understanding

Start with a real heading and compare its collected `slug`, rendered `id`, and link `href`. They must agree. Next, place a heading-looking line inside a code fence: the parser should leave it inside a code node, and it should produce no table-of-contents entry.

For repeatable edge-case examples and expected results, use the [heading checks in Chapter 5](05-verification-and-follow-ups.md#heading-fixture-and-expected-results). Checking only the collected list is insufficient; also verify that the target elements actually render.

---

[Overview](../building-post-editor.md) · [Previous chapter](02-validation-and-saving.md) · [Next chapter](04-markdown-preview.md)
