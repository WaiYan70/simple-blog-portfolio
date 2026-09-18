# 2. Validate Content and Save a Local Post

[Overview](../building-post-editor.md) · [Previous chapter](01-form-and-schema.md) · [Next chapter](03-rendering-and-headings.md)

Saving a post is a sequence of gates. First establish who is making the request, then validate the fields, check the article's syntax and authoring policy, and only then write the file. Navigation belongs at the end of a successful mutation.

This chapter explains both storage and orchestration. We inspect the repository first so you understand what the action calls, but at runtime the action must validate content before reaching that repository.

## Files to follow

| File | What to look for |
| --- | --- |
| [validate-post-content.ts](../../../src/features/admin/posts/lib/validate-post-content.ts) | MDX parsing and the Markdown-only tree walk |
| [post-file-repository.ts](../../../src/features/admin/posts/lib/post-file-repository.ts) | Path checks, frontmatter serialization, and exclusive creation |
| [actions.ts](../../../src/features/admin/posts/actions.ts) | Authorization, error mapping, route invalidation, and redirect |

The [form chapter](01-form-and-schema.md) owns the Zod field contract. Here we use its validated output rather than defining a second schema. Code examples are focused excerpts, not complete replacement files.

## Step 1: Create the local file repository

Create a server-only function that serializes validated post data and writes one new `.mdx` file.

### Why this step matters

The repository isolates filesystem details from the Server Action. Later, the action can call an update function, a delete function, or a database repository without putting storage logic inside the UI.

### Follow the implementation

- Resolve the canonical blog directory.
- Validate the slug again at the storage boundary.
- Confirm the resolved file belongs directly to the blog directory.
- Serialize metadata with `gray-matter`.
- Normalize the article body to one trailing newline.
- Use `flag: "wx"` so create never replaces an existing file.
- Convert the Node `EEXIST` error into a domain-specific error.

### Design choices

- Repeating slug validation is intentional defense in depth because repository functions may gain additional callers later.
- `gray-matter` remains useful even after moving rendering to `@next/mdx`; it owns frontmatter parsing and serialization, not rendering.
- `flag: "wx"` provides exclusive file creation, preventing an existing file from being overwritten. It does not make the entire content write transactional or provide production persistence.

### Read the focused example

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

### Why the write flag matters

Imagine two requests trying to create `my-first-post.mdx`. Checking whether the file exists and then writing it leaves a gap: both requests could observe that it does not exist. `flag: "wx"` moves the exclusive-create decision into the filesystem operation, so an existing file causes the write to fail.

The path checks solve a different problem. The slug pattern prevents path separators and traversal syntax, while the resolved-parent check confirms that the resulting file belongs directly to the blog directory. Keep both checks at the storage boundary even though the form schema already validates slugs.

`gray-matter` then serializes the metadata as YAML instead of relying on manually concatenated lines. That lets the serializer handle punctuation and quoting in titles and descriptions. The article body remains separate from the metadata object.

The repository assumes it receives a validated `CreatePostData` value. It checks the storage path, but it does not call the Markdown validator itself. A future caller must preserve the action's validation sequence before invoking it.

## Step 2: Orchestrate creation in the Server Action

Implement the server-side sequence from authorization through redirect.

### Why this step matters

The Server Action acts as the application boundary. It coordinates existing modules but does not own UI rendering details or low-level filesystem behavior.

### Follow the implementation

1. Authorize the current administrator.
2. Read values from `FormData`.
3. Validate and normalize them with Zod.
4. Compile-check the article body as MDX and reject MDX-specific nodes with `remarkMarkdownOnly`.
5. Return structured field errors when validation fails.
6. Ask the repository to create the file.
7. Convert expected repository errors into useful UI feedback.
8. Revalidate `/`, `/admin/posts`, `/blog`, and `/blog/<slug>` only after file creation succeeds.
9. Redirect after the mutation succeeds.

### Design choices

- Expected errors become user-facing state, while unexpected errors receive a generic message so internal details are not leaked.
- `redirect()` stays outside the `try/catch` because Next.js implements navigation by throwing a special internal signal.
- Revalidation refreshes route data, but it does not turn runtime filesystem writes into a durable production publishing workflow.

### Read the focused example

Keep the asynchronous content check in its own server-only helper. `remarkMarkdownOnly` walks the parsed tree recursively and rejects these node types:

| Node type | Rejected input outside code examples |
| --- | --- |
| `mdxjsEsm` | Imports and exports |
| `mdxFlowExpression` | Standalone JavaScript expressions |
| `mdxTextExpression` | Inline JavaScript expressions |
| `mdxJsxFlowElement` | Standalone JSX/HTML tags |
| `mdxJsxTextElement` | Inline JSX/HTML tags |

Fenced code blocks and inline code are ordinary code nodes, so examples containing these strings remain allowed. Compilation checks syntax and runs the validation plugins; it does not execute the submitted JavaScript.

### Understand the tree walk before reading the compiler call

An abstract syntax tree, or AST, represents what the parser thinks each piece of content means. A heading is a heading node; a code fence is a code node; an MDX expression has its own expression node type.

That is why this validator does not search the raw text for braces or the word `import`. The same characters can be an executable construct in one place and a harmless code example in another. Parse first, then inspect the meaning of each node.

Read `remarkMarkdownOnly` as this pseudocode:

```text
checkNode(node):
  if node.type is in the blocked set:
    reject the article
  for each child of node:
    checkNode(child)
```

The recursion matters because an expression can be nested inside a paragraph rather than sitting at the document root. A code node's source text is not recursively parsed as JavaScript by this walk, so examples in code fences remain allowed.

Try comparing these inputs: `The result is {1 + 1}.` should be rejected, while the expression written inside backticks should remain an example. Repeat with an import statement inside a fenced block. Both preview and create must apply this policy; otherwise the author could approve a preview that does not match the published behavior.

### Compile only after defining the policy

The focused helper below assumes the local `remarkMarkdownOnly` plugin and result type are defined in the same file:

```ts
import "server-only";

import { compile } from "@mdx-js/mdx";

export const validatePostContent = async (
  content: string,
): Promise<PostContentValidationResult> => {
  try {
    await compile(content, {
      format: "mdx",
      remarkPlugins: [remarkMarkdownOnly],
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

The generic catch message reflects the current implementation. The [validation-feedback follow-up](05-verification-and-follow-ups.md#1-markdown-only-validation-is-implemented-error-feedback-needs-refinement) explains how it differs from the plugin's more specific error message.

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

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${result.data.slug}`);

  redirect(`/blog/${result.data.slug}`);
}
```

The homepage reads `getAllPosts()` and displays the latest three posts. Invalidating only `/blog` does not explicitly invalidate that separate page, so the create action now includes `/`. Production-mode verification is listed in the [verification chapter](05-verification-and-follow-ups.md); route invalidation alone does not add new source modules to an existing production build.

### Separate failure from successful navigation

Use this table to trace which operations are allowed after each outcome:

| Outcome | What the action does | File creation and navigation |
| --- | --- | --- |
| Administrator check fails | Lets the auth helper enforce access | No file write |
| Field schema fails | Returns keyed field errors | No file write or success redirect |
| Content policy fails | Returns an error for `content` | No file write or success redirect |
| Filename already exists | Returns an error for `slug` | Existing file is preserved |
| Unexpected storage failure | Returns a generic form message | No success redirect; an interrupted write may need inspection |
| File creation succeeds | Invalidates the four affected routes | Redirects to the public post |

Keep `redirect()` outside the catch block. It signals navigation by throwing internally; treating that signal as an ordinary storage failure would turn a successful save into misleading error feedback.

The action invalidates `/` because the homepage also reads posts, not because it is a global reset for every route. Each literal route in this action identifies a page whose displayed content can change after creation.

## Check your understanding

Trace a draft with an invalid expression through the action: authorization passes, the field schema accepts a nonempty body, content validation rejects the expression, and the repository is never reached. Then trace a duplicate slug: both validation layers pass, exclusive creation fails, and the error returns to the slug field.

Those two failures look similar to the author but occur at different boundaries. Keeping their error paths explicit makes later edit and delete actions easier to build without putting storage logic in the form.

---

[Overview](../building-post-editor.md) · [Previous chapter](01-form-and-schema.md) · [Next chapter](03-rendering-and-headings.md)
