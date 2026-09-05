# Building a Local Markdown Post Editor

This document explains how the first version of the admin post editor was built. It uses the current codebase and the decisions made while implementing the feature as its source of truth.

The completed scope in this chapter is:

- display the create-post page
- collect post metadata and Markdown content
- validate submitted form data with Zod
- verify that the article body is valid MDX syntax before saving it
- preview unsaved Markdown on the server
- serialize metadata as YAML frontmatter with `gray-matter`
- create a new local `.mdx` file without overwriting an existing post
- render local `.mdx` posts with `@next/mdx`

Editing and deleting posts are not implemented yet. They are later phases that can reuse the form, schema, and repository boundaries introduced here.

## 1. What situation are we in?

The public blog originally read local `.mdx` files from `src/content/blog`. Each file contained two kinds of information:

1. YAML frontmatter for metadata such as `title`, `description`, `date`, and `tags`.
2. Markdown content for the article body.

An example post looks like this:

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

Before the editor existed, creating a post meant manually creating and formatting this file. The admin dashboard needed a simpler interface that could produce the same file structure.

For the first version, local files remain the source of truth. Supabase or another database is intentionally deferred until the local content workflow is understood and working.

### Current constraints

- Only an authenticated administrator may create or preview posts.
- The browser must never receive direct filesystem access.
- Server-only modules perform validation, compilation, and file writes.
- A slug becomes both a filename and a URL, so it must be strictly validated.
- Existing files must never be overwritten by the create operation.
- This filesystem workflow is intended for local development. A deployed serverless application cannot depend on durable writes to its source directory.

## 2. Goal and purpose

The goal is to build the smallest useful post-authoring workflow without introducing a full CMS or a large editor dependency.

The create flow should allow the administrator to:

1. Enter the post metadata.
2. Write the article body in a normal `<textarea>`.
3. Preview the Markdown with the same visual components used by public posts.
4. Submit the form to a Server Action.
5. Receive field-level validation errors when the input is invalid.
6. Reject article content that would produce an invalid `.mdx` file.
7. Create `src/content/blog/<slug>.mdx` when the input is valid.
8. Navigate to the newly created public post.

The architecture should also prepare for edit and delete functionality without implementing those operations prematurely.

## 3. Mental model

Keep the browser, server orchestration, filesystem, and public renderer as separate responsibilities.

```text
Create page (Server Component)
        |
        v
PostEditorForm (Client Component)
        |
        | form submission
        v
createPostAction (Server Action)
        |
        +--> requireAdmin()
        +--> createPostSchema.safeParse()
        +--> validatePostContent()
        +--> createPostFile()
                  |
                  v
          src/content/blog/<slug>.mdx
                  |
                  v
        @next/mdx compiles the file
                  |
                  v
          Public blog Server Component
```

Previewing follows a separate path because the content has not been saved as a file yet:

```text
Textarea content
      |
      v
previewPostAction()
      |
      +--> requireAdmin()
      +--> postContentSchema.safeParse()
      +--> validatePostContent()
      +--> @mdx-js/mdx evaluates Markdown on the server
      |
      v
Serializable React preview returned to the Client Component
```

The important distinction is:

- `@next/mdx` compiles trusted local files as application modules.
- `@mdx-js/mdx` checks MDX syntax before saving and compiles the unsaved preview string on the server.
- `gray-matter` parses and serializes YAML frontmatter. It is not the content renderer.

## 4. Files and folder structure

This is the structure used by the current implementation:

```text
next.config.ts

src/
├── mdx-components.tsx
├── content/
│   └── blog/
│       └── <slug>.mdx
├── app/
│   ├── (admin)/
│   │   └── admin/posts/new/page.tsx
│   └── (portfolio)/
│       └── blog/[slug]/page.tsx
└── features/
    ├── admin/posts/
    │   ├── actions.ts
    │   ├── components/
    │   │   └── PostEditorForm.tsx
    │   ├── lib/
    │   │   ├── compile-markdown-preview.tsx
    │   │   ├── post-file-repository.ts
    │   │   └── validate-post-content.ts
    │   └── schema/
    │       └── post-schema.ts
    └── blog/
        ├── components/
        │   ├── MDXComponents.tsx
        │   └── MDXContentShell.tsx
        └── lib/
            └── post.ts
```

### Responsibility map

| File | Responsibility |
| --- | --- |
| `PostEditorForm.tsx` | Interactive form state, Write/Preview toggle, pending and error UI |
| `post-schema.ts` | Trusted shape of incoming form data |
| `actions.ts` | Authentication, orchestration, error mapping, revalidation, redirect |
| `post-file-repository.ts` | Safe local path construction and file creation |
| `compile-markdown-preview.tsx` | Server-only compilation of unsaved Markdown |
| `validate-post-content.ts` | Server-only check that content is syntactically valid MDX |
| `next.config.ts` | Build-time MDX and syntax-highlighting configuration |
| `mdx-components.tsx` | Required App Router MDX component mapping |
| `post.ts` | Read frontmatter, calculate derived data, and load compiled post components |
| `blog/[slug]/page.tsx` | Render the public post page |

## 5. Step-by-step implementation

### Step 1: Define the content contract

#### What are we building?

Define the fields that the editor collects and how those fields map to a local post file.

#### Purpose

A clear contract prevents the form, schema, Server Action, and file repository from inventing different names or shapes for the same data.

#### Responsibilities

- `title`, `description`, `date`, and `tags` become frontmatter.
- `slug` becomes `<slug>.mdx` and `/blog/<slug>`.
- `content` becomes the article body.
- The form collects `tags` as comma-separated text, while validated application data uses `string[]`.

#### Tradeoffs

- A slug is read-only during future editing because renaming it also renames the file and public URL.
- Storing posts as files keeps the first version simple but requires a rebuild for production deployments.
- The current editor is described as a Markdown editor even though its output file uses `.mdx`; the consistency implications are documented under [Known limitations](#known-limitations-and-next-hardening-work).

#### Focused code snippet

```ts
type PostEditorValues = {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
};

type PostEditorFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<PostEditorValues>;
};
```

The `mode` and `defaultValues` properties make the UI reusable later. In the current feature, only `mode="create"` is connected to persistence.

### Step 2: Create the admin page boundary

#### What are we building?

Create a small App Router page that renders the editor form.

#### Purpose

The route page owns routing and page-level layout. It should not contain form state or filesystem logic.

#### Responsibilities

- The page remains a Server Component.
- The page renders headings and the interactive editor.
- `PostEditorForm` becomes the Client Component boundary because it uses state, transitions, refs, and event handlers.

#### Tradeoffs

- Moving only the form into a Client Component keeps the browser bundle smaller than marking the whole page as client-side.
- The page currently relies on the admin layout/auth system to protect the route, while every Server Action performs its own authorization again.

#### Focused code snippet

```tsx
import { PostEditorForm } from "@/features/admin/posts/components/PostEditorForm";

export default function CreateNewPostPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">New Post</h1>
        <p className="text-sm text-muted-foreground">
          Create a new Markdown blog post.
        </p>
      </header>

      <PostEditorForm mode="create" />
    </main>
  );
}
```

### Step 3: Build the editor UI before connecting persistence

#### What are we building?

Build an accessible form from the existing shadcn/ui `Card`, `Field`, `Input`, `Textarea`, `ToggleGroup`, and `Button` components.

#### Purpose

Separating the initial UI work from filesystem writes makes it easier to verify field names, labels, defaults, and responsive behavior before any mutation can occur.

#### Responsibilities

- `FieldGroup` groups the related fields.
- Every control has a stable `name` because `FormData` uses these names.
- `FieldLabel` connects to its input through `htmlFor` and `id`.
- `data-invalid` styles the field wrapper.
- `aria-invalid` describes the individual invalid control.
- The Markdown textarea uses controlled state because its current value is also needed for preview.
- Metadata fields use `defaultValue` because they do not need per-keystroke React state.

#### Tradeoffs

- A plain textarea has no toolbar, autocomplete, or advanced keyboard shortcuts, but it has almost no bundle cost and is easy to understand.
- Controlling only `content` avoids unnecessary re-renders for every metadata field.
- The `mode` prop changes labels and slug behavior, but it does not implement updating by itself.

#### Focused code snippet

```tsx
"use client";

const [content, setContent] = useState(values.content);

<Field data-invalid={Boolean(contentErrors?.length)}>
  <FieldLabel htmlFor="content">Markdown content</FieldLabel>

  <Textarea
    id="content"
    name="content"
    value={content}
    onChange={(event) => setContent(event.target.value)}
    placeholder="# Introduction"
    className="min-h-128 resize-y"
    required
    aria-invalid={Boolean(contentErrors?.length)}
  />

  <FieldError
    errors={contentErrors?.map((message) => ({ message }))}
  />
</Field>
```

### Step 4: Define the trusted input with Zod

#### What are we building?

Create a server-side schema that converts untrusted `FormData` values into a typed `CreatePostData` object.

#### Purpose

HTML attributes improve the user experience, but browser validation can be bypassed. The Server Action must validate every field again before using it in a path or writing it to disk.

#### Responsibilities

- Trim human-readable text.
- Limit field and content sizes.
- Normalize the slug to lowercase.
- Restrict the slug to lowercase letters, numbers, and internal hyphens.
- Validate the date as an ISO date.
- Convert the comma-separated tags string into `string[]`.
- Reject empty Markdown after trimming.
- Infer `CreatePostData` from the schema instead of maintaining a duplicate interface.

#### Tradeoffs

- Zod adds runtime validation and clear field errors at the cost of a small dependency and schema code.
- Zod validates the value's shape, size, and basic rules. MDX compilation is a separate semantic check because it is asynchronous and belongs to the content-processing boundary.

#### Focused code snippet

```ts
import { z } from "zod";

export const postContentSchema = z
  .string()
  .max(200_000, "Markdown content is too large")
  .refine(
    (content) => content.trim().length > 0,
    "Markdown content is required",
  );

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(300),
  date: z.iso.date("Choose a valid publication date"),
  tags: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(30)).max(10)),
  content: postContentSchema,
});

export type CreatePostData = z.infer<typeof createPostSchema>;
```

The production schema includes descriptive messages for every rule; the shortened snippet emphasizes the transformation pipeline.

### Step 5: Define the Server Action result and connect the form

#### What are we building?

Connect the Client Component to `createPostAction()` with React's `useActionState()`.

#### Purpose

The action result gives the form a predictable way to display field errors and a form-level message without manually creating an API route or managing a separate fetch request.

#### Responsibilities

- The state uses a discriminated status.
- `fieldErrors` uses the same keys as `CreatePostData`.
- `useActionState` supplies the action to the form.
- The submit button uses the pending state to prevent repeated submissions.
- The browser retains the entered uncontrolled fields when validation fails.

#### Tradeoffs

- This action signature is designed for `useActionState`, so it receives `_previousState` even though create currently does not need the previous value.
- The form currently imports `createPostAction` directly. When update support is added, the cleaner design is to pass the appropriate create/update action into the reusable form.

#### Focused code snippet

```ts
type PostField = keyof CreatePostData;

export type CreatePostState = {
  status: "idle" | "error";
  fieldErrors: Partial<Record<PostField, string[]>>;
  message: string | null;
};
```

```tsx
const initialCreatePostState: CreatePostState = {
  status: "idle",
  fieldErrors: {},
  message: null,
};

const [state, formAction, pending] = useActionState(
  createPostAction,
  initialCreatePostState,
);

return <form action={formAction}>{/* editor fields */}</form>;
```

### Step 6: Create the local file repository

#### What are we building?

Create a server-only function that serializes validated post data and writes one new `.mdx` file.

#### Purpose

The repository isolates filesystem details from the Server Action. Later, the action can call an update function, a delete function, or a database repository without putting storage logic inside the UI.

#### Responsibilities

- Resolve the canonical blog directory.
- Validate the slug again at the storage boundary.
- Confirm the resolved file belongs directly to the blog directory.
- Serialize metadata with `gray-matter`.
- Normalize the article body to one trailing newline.
- Use `flag: "wx"` so create never replaces an existing file.
- Convert the Node `EEXIST` error into a domain-specific error.

#### Tradeoffs

- Repeating slug validation is intentional defense in depth because repository functions may gain additional callers later.
- `gray-matter` remains useful even after moving rendering to `@next/mdx`; it owns frontmatter parsing and serialization, not rendering.
- `writeFile()` creates one file atomically for this use case, but local filesystem writes are not a production CMS strategy.

#### Focused code snippet

```ts
import "server-only";

const postDirectory = path.resolve(process.cwd(), "src/content/blog");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createPostFile = async (post: CreatePostData): Promise<void> => {
  if (!slugPattern.test(post.slug)) {
    throw new Error("invalid post slug");
  }

  const filePath = path.resolve(postDirectory, `${post.slug}.mdx`);

  if (path.dirname(filePath) !== postDirectory) {
    throw new Error("Post file path is outside the content directory");
  }

  const serializedPost = matter.stringify(
    `${post.content.trimEnd()}\n`,
    {
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
    },
  );

  await writeFile(filePath, serializedPost, {
    encoding: "utf-8",
    flag: "wx",
  });
};
```

The real repository catches `EEXIST` and throws `PostFileAlreadyExistsError`, allowing the action to attach the error to the slug field.

### Step 7: Orchestrate creation in the Server Action

#### What are we building?

Implement the server-side sequence from authorization through redirect.

#### Purpose

The Server Action acts as the application boundary. It coordinates existing modules but does not own UI rendering details or low-level filesystem behavior.

#### Responsibilities

1. Authorize the current administrator.
2. Read values from `FormData`.
3. Validate and normalize them with Zod.
4. Compile-check the article body as MDX.
5. Return structured field errors when validation fails.
6. Ask the repository to create the file.
7. Convert expected repository errors into useful UI feedback.
8. Revalidate affected routes.
9. Redirect after the mutation succeeds.

#### Tradeoffs

- Expected errors become user-facing state, while unexpected errors receive a generic message so internal details are not leaked.
- `redirect()` stays outside the `try/catch` because Next.js implements navigation by throwing a special internal signal.
- Revalidation refreshes route data, but it does not turn runtime filesystem writes into a durable production publishing workflow.

#### Focused code snippet

Keep the asynchronous MDX syntax check in its own server-only helper:

```ts
import "server-only";

import { compile } from "@mdx-js/mdx";

export const validatePostContent = async (
  content: string,
): Promise<PostContentValidationResult> => {
  try {
    await compile(content, {
      format: "mdx",
      rehypePlugins: [
        [
          rehypePrettyCode,
          { theme: "tokyo-night", keepBackground: false },
        ],
      ],
    });

    return { success: true };
  } catch {
    return {
      success: false,
      message: "This content contains invalid MDX syntax",
    };
  }
};
```

The action then composes authentication, both validation layers, persistence, and navigation:

```ts
export async function createPostAction(
  _previousState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  await requireAdmin();

  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    date: formData.get("date"),
    tags: formData.get("tags") ?? "",
    content: formData.get("content"),
  });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      status: "error",
      fieldErrors,
      message: "Check the highlighted fields",
    };
  }

  try {
    const contentValidation = await validatePostContent(result.data.content);
    if (!contentValidation.success) {
      return {
        status: "error",
        fieldErrors: { content: [contentValidation.message] },
        message: "Fix the article content before saving",
      };
    }

    await createPostFile(result.data);
  } catch (error) {
    if (error instanceof PostFileAlreadyExistsError) {
      return {
        status: "error",
        fieldErrors: { slug: ["A post with this slug already exists."] },
        message: "Choose a different slug",
      };
    }

    return {
      status: "error",
      fieldErrors: {},
      message: "Unable to create the post. Please try again.",
    };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${result.data.slug}`);

  redirect(`/blog/${result.data.slug}`);
}
```

### Step 8: Configure local MDX rendering

#### What are we building?

Configure Next.js to compile local `.mdx` files and expose the existing custom Markdown elements globally.

#### Purpose

Public posts should be normal compiled React components instead of runtime strings. This removes the need for `next-mdx-remote` in the local-file architecture.

#### Responsibilities

- `@next/mdx` integrates MDX compilation into Next.js.
- `remark-frontmatter` recognizes the existing YAML block so it is not rendered as article content.
- `rehype-pretty-code` generates highlighted code markup.
- `src/mdx-components.tsx` supplies the required App Router component mapping.
- The public post loader dynamically imports the compiled file by slug.

#### Tradeoffs

- Local MDX is compiled as application code, so it must be trusted.
- A newly added post becomes part of the build module graph. Production publication requires a rebuild/redeployment.
- The same metadata file is currently read separately with `gray-matter` to calculate summaries, reading time, and headings.

#### Focused code snippet

```ts
// next.config.ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter"],
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

### Step 9: Add server-side Markdown preview

#### What are we building?

Add a Write/Preview toggle that sends the current textarea value to an authenticated Server Action and returns a rendered React preview.

#### Purpose

The administrator can inspect headings, paragraphs, lists, links, and highlighted code before creating the file.

#### Responsibilities

- `PostEditorForm` owns the active view and preview request state.
- `previewPostAction` authorizes and validates every preview request.
- `validatePostContent` catches malformed MDX before either preview or saving.
- `compileMarkdownPreview` remains server-only.
- `@mdx-js/mdx` compiles the unsaved string.
- The public `mdxComponents` and `MDXContentShell` preserve visual consistency.
- A request ID prevents an older asynchronous response from replacing a newer view state.

#### Tradeoffs

- Compilation happens only when Preview is selected, not after every keystroke. This avoids continuous server requests and expensive compilation while typing.
- Server Actions are queued and are primarily mutation-oriented, but an explicit, low-frequency preview request is reasonable for this local admin tool.
- `format: "md"` intentionally prevents imports, exports, JSX, expressions, and raw HTML from executing in the preview.
- This safe preview mode does not completely match the `.mdx` publishing grammar. See [Known limitations](#known-limitations-and-next-hardening-work).

#### Focused code snippet

```tsx
// compile-markdown-preview.tsx
export const compileMarkdownPreview = async (
  content: string,
): Promise<ReactNode> => {
  const { default: PreviewContent } = await evaluate(content, {
    ...runtime,
    format: "md",
    rehypePlugins: [
      [
        rehypePrettyCode,
        { theme: "tokyo-night", keepBackground: false },
      ],
    ],
  });

  return (
    <MDXContentShell>
      <PreviewContent components={mdxComponents} />
    </MDXContentShell>
  );
};
```

```ts
// actions.ts
export async function previewPostAction(
  content: string,
): Promise<PostPreviewResult> {
  await requireAdmin();

  const result = postContentSchema.safeParse(content);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid Markdown content",
    };
  }

  try {
    const contentValidation = await validatePostContent(result.data);
    if (!contentValidation.success) {
      return contentValidation;
    }

    return {
      success: true,
      preview: await compileMarkdownPreview(result.data),
    };
  } catch {
    return {
      success: false,
      message: "The Markdown could not be compiled for preview.",
    };
  }
}
```

The essential client-side state is:

```tsx
const [view, setView] = useState<"write" | "preview">("write");
const [previewContent, setPreviewContent] = useState<ReactNode>(null);
const [previewError, setPreviewError] = useState<string | null>(null);
const [previewPending, startPreviewTransition] = useTransition();
const previewRequestId = useRef(0);
```

Both toggle items need `type="button"`; otherwise a button inside the form could submit the create operation.

When the textarea is replaced by the preview, preserve its value in the submitted form:

```tsx
{view === "write" ? (
  <Textarea
    name="content"
    value={content}
    onChange={(event) => setContent(event.target.value)}
  />
) : (
  <>
    <input type="hidden" name="content" value={content} />
    <div aria-busy={previewPending}>
      {previewPending ? <p role="status">Rendering Preview...</p> : null}
      {!previewPending && previewError ? (
        <p role="alert">{previewError}</p>
      ) : null}
      {!previewPending && !previewError ? previewContent : null}
    </div>
  </>
)}
```

### Step 10: Verify the complete create flow

#### What are we building?

Build confidence that all boundaries work together, not just that individual files compile.

#### Purpose

The highest-risk problems occur between modules: `FormData` names may not match the schema, validation may not map to the correct field, or the generated file may fail to render.

#### Responsibilities

- Run the repository's actual static checks.
- Verify success, validation failure, duplicate slug, and preview behavior.
- Confirm generated frontmatter can be read by the existing public blog repository.
- Confirm the public route renders highlighted code and table-of-contents headings.

#### Tradeoffs

- Manual checks are appropriate for this first local UI, but repository and action tests should be added before the storage layer becomes more complex.
- A passing production build verifies existing MDX files; it does not prove that every future textarea value is valid MDX.

#### Focused commands and checklist

```bash
bun run lint
bun run build
rg -n "next-mdx-remote" src package.json bun.lock
```

Manual scenarios:

1. Submit an empty form and verify field errors.
2. Enter a slug containing uppercase characters or spaces and verify normalization/error behavior.
3. Preview headings, lists, links, inline code, and a fenced code block.
4. Switch back to Write while preview compilation is pending and verify that a stale result does not replace the editor.
5. Create a valid post and inspect `src/content/blog/<slug>.mdx`.
6. Try the same slug again and verify the duplicate-slug error.
7. Open `/blog/<slug>` and verify metadata, body styles, heading links, and syntax highlighting.
8. Run a production build and confirm the slug appears in the generated route list.

## Known limitations and next hardening work

### 1. Preview Markdown and published MDX are not the same grammar

The create action now calls `validatePostContent()`, so malformed MDX is rejected before a file is written. The validator uses `format: "mdx"`, matching the grammar of the published file.

However, preview and publication can still behave differently for valid MDX-specific input. For example:

```mdx
The result is {1 + 1}.
```

This is valid MDX and passes `validatePostContent()`. The safe preview uses `format: "md"`, so it treats the expression as text, while the published MDX module evaluates it and renders `2`.

The next hardening decision is to choose an explicit authoring policy. For a Markdown-only editor, the recommended policy is:

1. Treat browser-authored content as Markdown only.
2. Parse it as MDX before saving.
3. Reject MDX-specific AST nodes such as imports, exports, expressions, and JSX.
4. Continue using `format: "md"` for safe preview rendering.

If trusted custom MDX components are added later, introduce a deliberate component allowlist instead of enabling arbitrary JavaScript evaluation.

### 2. Edit and delete are still placeholders

The form's `mode` property prepares the UI for editing, but the form always uses `createPostAction`. The admin list, detail, and edit pages are also placeholders.

The next CRUD phase needs:

- `getEditablePostBySlug()`
- `updatePostFile()`
- `deletePostFile()`
- `updatePostAction()`
- `deletePostAction()`
- an admin post list
- a populated edit page
- a deletion confirmation dialog

For reuse, the form should eventually receive its mutation action instead of importing only the create action:

```ts
type PostEditorAction = (
  state: PostEditorState,
  formData: FormData,
) => Promise<PostEditorState>;

type PostEditorFormProps = {
  mode: "create" | "edit";
  action: PostEditorAction;
  defaultValues?: Partial<PostEditorValues>;
};
```

### 3. Local writes are not production persistence

The local workflow is useful for learning and development. On many deployment platforms, the deployed filesystem is read-only or ephemeral, and a newly written source file is not automatically added to the already-built JavaScript module graph.

When posts move to Supabase, choose one of these architectures deliberately:

- store Markdown and render it with a safe runtime Markdown pipeline, or
- materialize database content into repository files and trigger a rebuild.

`@next/mdx` by itself is a local build-time integration; it is not a runtime renderer for arbitrary database strings.

### 4. Heading extraction is intentionally simple

The current table of contents uses a regular expression to find Markdown headings. It can mistakenly find heading-looking text inside fenced code blocks and does not deduplicate repeated heading IDs.

This is acceptable for the first version. A later improvement should extract headings from the Markdown syntax tree so the table of contents and rendered document share the same interpretation.

## Definition of done for this chapter

The create-post phase is operational when:

- the admin can enter all required post fields
- Zod returns field-level validation errors
- preview renders on explicit request
- preview compilation is authenticated and server-only
- malformed MDX is rejected before file creation
- a valid submission creates one new `.mdx` file
- an existing file cannot be overwritten
- public posts render through `@next/mdx`
- metadata and table-of-contents data continue to work
- lint and production build pass

The feature is usable for the local-file learning phase. Aligning the preview and publishing grammars is the first remaining hardening decision before beginning edit and delete operations.
