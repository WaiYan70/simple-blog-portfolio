# 1. Build the Form and Define Its Schema

[Overview](../building-post-editor.md) · [Next chapter](02-validation-and-saving.md)

Think of the form as a translator between what the author types and what the server needs. The browser collects text; the schema gives that text a trusted shape. Neither the page nor the form should decide how a file is written.

In this chapter, follow the data from an input's `name` through `FormData`, Zod, and the action result displayed beside that input. By the end, you should be able to explain which component owns state and why the server validates the same fields again.

## Files to follow

| File | What to look for |
| --- | --- |
| [Create page](<../../../src/app/(admin)/admin/posts/new/page.tsx>) | Server-rendered page layout and the form boundary |
| [PostEditorForm.tsx](../../../src/features/admin/posts/components/PostEditorForm.tsx) | Input names, content state, field errors, and submission |
| [post-schema.ts](../../../src/features/admin/posts/schema/post-schema.ts) | Normalization, limits, transformations, and inferred data types |
| [actions.ts](../../../src/features/admin/posts/actions.ts) | `CreatePostState` and the create action signature |

These are reading targets, not files to replace with the snippets below. The snippets focus on individual concepts and omit surrounding imports or implementation where appropriate.

## Step 1: Define the content contract

Define the fields that the editor collects and how those fields map to a local post file.

### Why this step matters

A clear contract prevents the form, schema, Server Action, and file repository from inventing different names or shapes for the same data.

### Follow the implementation

- `title`, `description`, `date`, and `tags` become frontmatter.
- `slug` becomes `<slug>.mdx` and `/blog/<slug>`.
- `content` becomes the article body.
- The form collects `tags` as comma-separated text, while validated application data uses `string[]`.

### Design choices

- A slug is read-only during future editing because renaming it also renames the file and public URL.
- Storing posts as files keeps the first version simple but requires a rebuild for production deployments.
- The output extension remains `.mdx`, but browser-authored content follows a Markdown-only policy. Literal braces and tags may need escaping or code formatting because validation still uses the MDX parser; this is not unrestricted CommonMark support.

### Read the focused example

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

### Trace a concrete draft

Suppose the author enters `My First Post` as the title, `My-First-Post` as the slug, and `Next.js, TypeScript` as the tags. The browser submits three strings. Zod lowercases the slug to `my-first-post` and converts the tags to `["Next.js", "TypeScript"]`. The repository later writes `my-first-post.mdx`; the slug does not need to be duplicated in frontmatter.

Notice what normalization does not do: it does not turn `My First Post` into a valid slug by replacing spaces. The schema rejects internal spaces. This keeps the author in control of the final URL instead of silently inventing one.

Before moving on, identify each field's destination: frontmatter, filename, or article body. If a field has no clear destination, its contract is not yet defined.

## Step 2: Create the admin page boundary

Create a small App Router page that renders the editor form.

### Why this step matters

The route page owns routing and page-level layout. It should not contain form state or filesystem logic.

### Follow the implementation

- The page remains a Server Component.
- The page renders headings and the interactive editor.
- `PostEditorForm` becomes the Client Component boundary because it uses state, transitions, refs, and event handlers.

### Design choices

- Moving only the form into a Client Component keeps the browser bundle smaller than marking the whole page as client-side.
- The page currently relies on the admin layout/auth system to protect the route, while every Server Action performs its own authorization again.

The page receives no editor interaction state. `PostEditorForm` owns the draft body, the selected view, and request feedback because those values change as the author interacts. Its initial values come from `defaultValues` merged with empty defaults; the create page supplies only `mode="create"`. No shared context or global store is necessary.

Importing a Server Action into the Client Component connects the form to a server operation; it does not move filesystem helpers into the browser. Keep repository imports inside server modules.

### Read the focused example

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

## Step 3: Build the editor UI before connecting persistence

Build an accessible form from the existing shadcn/ui `Card`, `Field`, `Input`, `Textarea`, `ToggleGroup`, and `Button` components.

### Why this step matters

Separating the initial UI work from filesystem writes makes it easier to verify field names, labels, defaults, and responsive behavior before any mutation can occur.

### Follow the implementation

- `FieldGroup` groups the related fields.
- Every control has a stable `name` because `FormData` uses these names.
- `FieldLabel` connects to its input through `htmlFor` and `id`.
- `data-invalid` styles the field wrapper.
- `aria-invalid` describes the individual invalid control.
- The Markdown textarea uses controlled state because its current value is also needed for preview.
- Metadata fields use `defaultValue` because they do not need per-keystroke React state.

### Design choices

- A plain textarea has no toolbar, autocomplete, or advanced keyboard shortcuts, but it has almost no bundle cost and is easy to understand.
- Controlling only `content` avoids unnecessary re-renders for every metadata field.
- The `mode` prop changes labels and slug behavior, but it does not implement updating by itself.

### Read the focused example

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

### Checkpoint: distinguish `id` from `name`

An input's `id` connects it to its label. Its `name` controls the key submitted in `FormData`. A field can look correct and still fail on the server if it is named `postTitle` while the action reads `title`.

Trace the title input through three matching names: `name="title"`, `formData.get("title")`, and `state.fieldErrors.title`. Then repeat for the content field. This simple check catches a common integration problem before any file is written.

The textarea is controlled because preview needs its current value without waiting for submission. Metadata inputs use `defaultValue`, which initializes the browser's input value without asking React to update state on every keystroke. That choice is simple, but it makes retention after an action error something to verify explicitly.

## Step 4: Define the trusted input with Zod

Create a server-side schema that converts untrusted `FormData` values into a typed `CreatePostData` object.

### Why this step matters

HTML attributes improve the user experience, but browser validation can be bypassed. The Server Action must validate every field again before using it in a path or writing it to disk.

### Follow the implementation

- Trim human-readable text.
- Limit field and content sizes.
- Normalize the slug to lowercase.
- Restrict the slug to lowercase letters, numbers, and internal hyphens.
- Validate the date as an ISO date.
- Convert the comma-separated tags string into `string[]`.
- Reject empty Markdown after trimming.
- Infer `CreatePostData` from the schema instead of maintaining a duplicate interface.

### Design choices

- Zod adds runtime validation and clear field errors at the cost of a small dependency and schema code.
- Zod validates the value's shape, size, and basic rules. The asynchronous compiler check separately validates syntax and rejects disallowed MDX nodes at the content-processing boundary.

### Read the focused example

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

### Read the schema as a data pipeline

For tags, read the methods in order: accept a string, split it at commas, trim each item, remove empty items, and validate the resulting array. For example, `Next.js, , TypeScript` becomes two tags. The current schema does not deduplicate repeated tags.

The body uses a different rule: it checks `content.trim().length` to reject whitespace-only drafts but keeps the original body string. That distinction matters because indentation and whitespace can affect Markdown. The storage layer later normalizes the end of the body to a single trailing newline.

`CreatePostData` describes the schema's output, not the browser's raw input. Its `tags` field is therefore an array even though the form submits a string. Use that inferred type after successful validation so later functions do not have to guess whether transformation has happened.

Try reading an invalid submission in this order: what raw value arrived, which schema rule rejected it, and which field key should receive the error? The compiler's Markdown policy check comes later, in [Chapter 2](02-validation-and-saving.md).

## Step 5: Define the Server Action result and connect the form

Connect the Client Component to `createPostAction()` with React's `useActionState()`.

### Why this step matters

The action result gives the form a predictable way to display field errors and a form-level message without manually creating an API route or managing a separate fetch request.

### Follow the implementation

- The state uses a discriminated status.
- `fieldErrors` uses the same keys as `CreatePostData`.
- `useActionState` supplies the action to the form.
- The submit button uses the pending state to prevent repeated submissions.
- Field errors are shown beside their controls, and form-level errors are announced through an `aria-live="polite"` region.
- Content stays in React state. Metadata uses uncontrolled inputs; verify its retention after a returned action error rather than assuming `useActionState` preserves those values.

### Design choices

- This action signature is designed for `useActionState`, so it receives `_previousState` even though create currently does not need the previous value.
- The form currently imports `createPostAction` directly. When update support is added, the cleaner design is to pass the appropriate create/update action into the reusable form.

### Read the focused example

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

### Follow one failed submission back to the screen

The author submits the form, `pending` becomes true, and the action receives the previous state followed by `FormData`. If the slug fails validation, the action returns an error state whose `fieldErrors.slug` contains the message. React supplies that result as the new `state`, and the slug's `FieldError` renders it.

A successful create does not need a `status: "success"` branch in this result type because the action redirects to the post. That explains why the current status values are only `idle` and `error`.

Disabling the submit button reduces accidental repeated clicks. It is a UI convenience, not the guarantee against overwriting: the repository provides that guarantee with exclusive file creation. We will inspect it next.

## Check your understanding

Before continuing, you should be able to answer these questions from the source:

1. Which values belong to React state, and which are read through the browser's form controls?
2. Why must input names, schema fields, and field-error keys agree?
3. How does `tags` change shape between the browser and `CreatePostData`?
4. Why does a protected admin page still need authorization inside its actions?

For a manual checkpoint, enter a draft and trigger a validation failure. Verify that the relevant error is shown, the body remains available, and metadata retention behaves as expected. The complete test procedure is in [Chapter 5](05-verification-and-follow-ups.md).

---

[Overview](../building-post-editor.md) · [Next chapter](02-validation-and-saving.md)
