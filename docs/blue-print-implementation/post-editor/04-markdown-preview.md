# 4. Preview Unsaved Markdown

[Overview](../building-post-editor.md) · [Previous chapter](03-rendering-and-headings.md) · [Next chapter](05-verification-and-follow-ups.md)

Preview is a temporary view of the current draft. It sends the article body to the server, applies the same authoring policy as saving, and returns rendered content without creating a file.

The subtle part is ownership: the textarea state owns the draft, the server owns validation and compilation, and the browser owns which asynchronous result is still relevant. Keeping those responsibilities separate makes view switching easier to reason about.

## Files to follow

| File | What to look for |
| --- | --- |
| [PostEditorForm.tsx](../../../src/features/admin/posts/components/PostEditorForm.tsx) | View state, request IDs, pending UI, and the hidden content input |
| [actions.ts](../../../src/features/admin/posts/actions.ts) | `previewPostAction` and its result union |
| [compile-markdown-preview.tsx](../../../src/features/admin/posts/lib/compile-markdown-preview.tsx) | Markdown evaluation and shared rendering components |
| [MDXContentShell.tsx](../../../src/features/blog/components/MDXContentShell.tsx) | The article container reused by public posts and preview |

Keep the [validation policy](02-validation-and-saving.md) and [heading algorithm](03-rendering-and-headings.md) in their respective chapters. This chapter focuses on how preview uses them. The examples are focused excerpts rather than complete replacement components.

## Step 1: Define the preview boundary

Add a Write/Preview toggle that sends the current textarea value to an authenticated Server Action and returns a rendered React preview.

### Why this step matters

The administrator can inspect headings, paragraphs, lists, links, and highlighted code before creating the file.

### Follow the implementation

- `PostEditorForm` owns the active view and preview request state.
- `previewPostAction` authorizes and validates every preview request.
- `validatePostContent` rejects malformed syntax and disallowed MDX nodes before either preview or saving.
- `compileMarkdownPreview` remains server-only.
- `@mdx-js/mdx` compiles the unsaved string.
- The public `mdxComponents` and `MDXContentShell` preserve visual consistency.
- `remarkHeadings` uses the same ID algorithm as the published post and table of contents.
- A request ID prevents an older asynchronous response from replacing a newer view state.
- Both returned validation failures and thrown preview request failures produce visible error feedback.

### Design choices

- Compilation happens only when Preview is selected, not after every keystroke. This avoids continuous server requests and expensive compilation while typing.
- Server Actions are queued and are primarily mutation-oriented, but an explicit, low-frequency preview request is reasonable for this local admin tool.
- `format: "md"` intentionally prevents imports, exports, JSX, expressions, and raw HTML from executing in the preview.
- The shared validation gate restricts both paths to the supported Markdown subset. Keep preview in `format: "md"`; enabling MDX execution is not needed to align authoring behavior.

## Step 2: Render validated Markdown on the server

Think of the compiler helper as the rendering half of preview. The action is responsible for deciding whether the current administrator may preview this particular input. Once those checks pass, the helper uses the existing JSX runtime, component mapping, heading plugin, and code highlighter to produce the preview.

`evaluate()` compiles and runs the generated rendering module, so its input mode is significant. Here `format: "md"` interprets the submitted body as Markdown, and the action first rejects MDX-specific constructs. Do not switch this to executable MDX merely to make arbitrary pasted expressions work.

### Read the focused example

```tsx
// compile-markdown-preview.tsx
import remarkHeadings from "./remark-headings.mjs";

export const compileMarkdownPreview = async (
  content: string,
): Promise<ReactNode> => {
  const { default: PreviewContent } = await evaluate(content, {
    ...runtime,
    format: "md",
    remarkPlugins: [remarkHeadings],
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

### Connect the action to the renderer

The preview action uses the body-only schema. An author can preview the article before completing its title, date, or slug. Saving still requires all metadata through `createPostSchema`.

The authorization call stays inside this action even though the form is on an admin page. Validation failures return a useful result without reaching the renderer; compiler failures become preview errors. Neither path calls the repository.

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

## Step 3: Give each piece of client state one job

The essential client-side state is:

```tsx
const [view, setView] = useState<"write" | "preview">("write");
const [previewContent, setPreviewContent] = useState<ReactNode>(null);
const [previewError, setPreviewError] = useState<string | null>(null);
const [previewPending, startPreviewTransition] = useTransition();
const previewRequestId = useRef(0);
```

| Value | Why the form keeps it |
| --- | --- |
| `content` | The draft body; switching views must not lose it |
| `view` | Whether the author sees the textarea or the preview panel |
| `previewContent` | The last accepted React preview result |
| `previewError` | Feedback for validation, rendering, or request failure |
| `previewPending` | Whether the preview transition is still in progress |
| `previewRequestId` | Which response is allowed to update the preview |

The request ID belongs in a ref because changing it should not itself trigger rendering. The selected view and displayed feedback belong in state because the UI must respond when they change. The separate create-action `pending` flag belongs to submission; it does not describe preview compilation.

Both toggle items need `type="button"`; otherwise a button inside the form could submit the create operation.

`handleViewChange` ignores empty or unknown toggle values. Selecting Write increments `previewRequestId` to invalidate any pending response. Selecting Preview increments it again, clears the previous preview and error, and starts a transition. Both the success path and the catch block check that the request ID is still current before updating the UI. A thrown request failure displays `Unable to render the preview` instead of leaving the error unhandled.

This request ID suppresses stale UI updates; it does not cancel server work already in progress. The pending message uses `role="status"` and `aria-live="polite"`, while preview failures use `role="alert"`. The create button is disabled while its own action is pending and displays `Validating...`.

### Follow an outdated response

Imagine the author requests preview A, then returns to Write before A finishes. Returning to Write changes the current request ID. When A eventually resolves, its captured ID no longer matches, so the handler ignores it.

Now the author edits the draft and requests preview B. B has a newer ID and captures the updated content. The same comparison protects both success and error updates: an old failure from A must not replace a valid result from B.

Starting a fresh preview also clears the previous content and error. This prevents the panel from showing an older article as though it were the result of the current request.

## Step 4: Preserve submission while changing views

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

There is exactly one form control named `content` in either view. Write mode submits the textarea; Preview mode submits the hidden input. Without that hidden control, unmounting the textarea would cause `formData.get("content")` to return no value even though React still holds the draft.

A hidden input is a transport mechanism, not trusted storage. The create action still validates its value on the server. The preview result itself is not saved; the original Markdown body is what becomes the post file.

## Check your understanding

Preview an unfinished draft before supplying metadata, then return to Write and confirm the body remains available. Next, submit a complete draft while Preview is visible and confirm the body still reaches the create action.

For error handling, distinguish a returned validation error from a rejected network request. The former comes through `result.success === false`; the latter reaches the client catch block. Both should display feedback, and both must respect the current request ID. Use the [full verification checklist](05-verification-and-follow-ups.md) when checking these interactions in the browser.

---

[Overview](../building-post-editor.md) · [Previous chapter](03-rendering-and-headings.md) · [Next chapter](05-verification-and-follow-ups.md)
