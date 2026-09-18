# 5. Verify the Editor and Plan Follow-up Work

[Overview](../building-post-editor.md) · [Previous chapter](04-markdown-preview.md)

Verification should follow the same journey as an author: enter a draft, preview it, handle a mistake, save it, and read the published result. Then repeat that journey with inputs that previously broke the contract.

This chapter is the single place for test expectations, known bugs, and future work. An implemented code path is not the same as a verified user flow. The checks below are instructions to perform, not a report that they passed during this documentation change.

## Files to follow

| File | What to inspect |
| --- | --- |
| [package.json](../../../package.json) | Existing verification scripts |
| [PostEditorForm.tsx](../../../src/features/admin/posts/components/PostEditorForm.tsx) | Author-visible states and interactions |
| [actions.ts](../../../src/features/admin/posts/actions.ts) | Which branches may write a file or invalidate a route |
| [MDXComponents.tsx](../../../src/features/blog/components/MDXComponents.tsx) | The outstanding heading renderer issue |
| [Homepage](<../../../src/app/(portfolio)/page.tsx>) | Latest-three-post selection |

## Step 1: Verify the complete create flow

Build confidence that all boundaries work together, not just that individual files compile.

### Why this step matters

The highest-risk problems occur between modules: `FormData` names may not match the schema, validation may not map to the correct field, or the generated file may fail to render.

### Follow the implementation

- Run the repository's actual static checks.
- Verify success, validation failure, duplicate slug, and preview behavior.
- Confirm generated frontmatter can be read by the existing public blog repository.
- Confirm the public route renders highlighted code and table-of-contents headings.
- Check Markdown-only rejection, repeated heading IDs, and homepage invalidation separately from the happy path.

### Design choices

- Manual checks are appropriate for this first local UI, but repository and action tests should be added before the storage layer becomes more complex.
- A passing production build verifies existing MDX files; it does not prove every future input is accepted or rejected correctly, or that cache invalidation behaves as intended.

### Run the checks

```bash
bun run lint
bun run build
```

Use `bun run start` after a successful build for the production-mode checks below. The project has no dedicated `typecheck` or test script in `package.json`; the build includes Next.js TypeScript checking. These are verification steps to run, not a record of checks passing during this documentation update.

Run these commands from the repository root. Begin with lint, then build, and address relevant failures before attempting production-mode browser checks. A heading component that returns no JSX can fail type checking as well as prevent the heading from appearing; do not treat a blocked build as evidence that route or cache checks passed.

Use a disposable local post with a unique slug for create scenarios. Record its slug and original contents so you can compare the file after a duplicate submission. These instructions involve creating local content when you perform them; the documentation update itself does not create test posts.

### Check the author's journey

Manual scenarios:

1. Submit an empty form and verify the browser's required-field feedback. Separately check server-side validation with invalid input that reaches the action, such as a nonempty slug containing spaces; browser validation alone does not exercise Zod's error mapping.
2. Enter a slug containing uppercase characters or spaces and verify normalization/error behavior.
3. Preview headings, lists, links, inline code, and a fenced code block.
4. Switch back to Write while preview compilation is pending, edit the body, and request another preview. Verify that older successes or errors do not replace the current result.
5. Simulate a failed preview request and verify error feedback. Submit while Preview is selected and confirm the hidden `content` input preserves the body.
6. Attempt preview and save with inline and standalone expressions, imports, exports, and JSX/HTML tags outside code. Verify both actions reject them and no file is created. Repeat those examples inside inline code and fenced blocks; they should remain displayable code examples.
7. Create a valid post and inspect `src/content/blog/<slug>.mdx`. Try the same slug again and verify the duplicate-slug error; also check whether metadata inputs retain their values after the error.
8. Include repeated headings, formatted headings, a Setext heading, a heading that already ends in `-1`, non-ASCII-only headings, and heading-looking text inside code fences. Verify unique IDs, correct heading text, and exclusion of code examples from the table of contents.
9. Open `/blog/<slug>` and verify metadata, body styles, syntax highlighting, and every table-of-contents link against a visible heading. This check currently requires fixing the missing returns in `MDXComponents.tsx` first.
10. Run a production build after creating a local fixture and confirm its route is generated. In production mode, confirm the homepage shows the latest three posts in date order.
11. Separately verify cache invalidation with a successful save in a writable local production-mode instance: visit `/` first to populate its cache, save a post whose date places it among the latest three, and revisit `/` and `/blog`. Check the list refresh separately from the new detail route, because a new `.mdx` source module may still require rebuilding. A rebuild showing the new post does not by itself prove the save action invalidated the homepage.

### Content-policy cases and expected results

Run each rejected example through both Preview and Create. A disabled or hidden button is not evidence of server-side validation; the actions themselves must reject the input.

| Body input | Expected result |
| --- | --- |
| Ordinary paragraphs, lists, and headings | Pass the content policy |
| `The result is {1 + 1}.` | Reject the inline MDX expression |
| `{1 + 1}` on its own line | Reject the standalone expression |
| `import Thing from './thing.js'` at the start of the body | Reject the import |
| `export const answer = 42` at the start of the body | Reject the export |
| `<Widget />` or `<div>HTML</div>` | Reject JSX/HTML elements |
| An unclosed expression such as `{` | Reject malformed MDX syntax |
| Those examples enclosed in inline code or fenced blocks | Allow them as displayed examples |
| Whitespace-only body | Reject through the body schema |

For rejected Create requests, confirm no new post file exists. For duplicate-slug requests, confirm the existing file's contents are unchanged. These assertions protect behavior at the storage boundary rather than merely checking that an error message appeared.

Also verify authorization: unauthenticated attempts to create or preview must not reach file creation or return a compiled preview. Use the existing sign-out/login flow for that check without changing the authentication setup.

### Heading fixture and expected results

Use this body to exercise several heading cases in one article. The outer block below is just documentation formatting; copy the Markdown inside it into the editor.

~~~~md
# Guide

## Setup

First section.

## Setup

Repeated heading.

## Setup-1

A heading whose text already ends in a suffix.

## Install **Bun**

Overview
--------

```text
## Not a real heading
```

## 🚀

## 🚀
~~~~

| Visible heading text | Expected ID | Included in the table of contents? |
| --- | --- | --- |
| Guide | `guide` | No; level one still reserves the ID |
| Setup | `setup` | Yes |
| Setup | `setup-1` | Yes |
| Setup-1 | `setup-1-1` | Yes |
| Install Bun | `install-bun` | Yes; formatting is excluded from the label |
| Overview | `overview` | Yes; the underline produces a level-two Setext heading |
| Not a real heading | None | No; it is code content |
| 🚀 | `section` | Yes; the slug's base is empty after filtering |
| 🚀 | `section-1` | Yes; the fallback also participates in deduplication |

After the renderer follow-up below is fixed, compare these IDs in preview and the saved article. Click every table-of-contents link and verify that it reaches a visible heading. Inspect the generated IDs as well as the scroll behavior: a missing heading can make a correct-looking list misleading.

Preview the same body again and check that the IDs stay the same. Then use a second document beginning with `## Setup`; its first ID should be `setup`, demonstrating that IDs are tracked per document rather than globally.

### Record evidence before marking a check complete

For each scenario, record the input, expected behavior, actual behavior, and whether it ran in development or production mode. Keep failures distinct from checks you could not run.

For homepage freshness, record what the cached homepage showed before the save and what it showed afterward. Choose a publication date that places the fixture within the latest three posts; otherwise its absence from the homepage can be correct behavior. Test without rebuilding between those two observations, because a rebuild would hide whether the action invalidated the page.

If the local production setup cannot write source files or load the new module, record that limitation separately. A successful filesystem write, a refreshed listing, and a successfully rendered detail route are three different outcomes.

## Known limitations and next hardening work

### 1. Markdown-only validation is implemented; error feedback needs refinement

Both create and preview call `validatePostContent()`. The helper uses `format: "mdx"` plus `remarkMarkdownOnly`, so valid MDX-specific input is rejected as well as malformed syntax. For example, this formerly accepted expression now fails validation:

```mdx
The result is {1 + 1}.
```

The same text is allowed inside inline code or a fenced block, where it is rendered as an example. Preview continues to use `format: "md"` and does not evaluate MDX expressions.

The remaining usability issue is the catch block: it hides the specific `UnsupportedMarkdownError` guidance behind `This content contains invalid MDX syntax`. A future small change can return the policy-specific message for this expected error and retain a generic fallback for other failures.

This policy is enforced at the editor actions, not globally by `next.config.ts`. Manually authored local `.mdx` files remain trusted application modules. The editor also accepts only Markdown that parses under the MDX grammar; it does not promise support for every CommonMark construct.

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

For reuse, the form could eventually receive its mutation action instead of importing only the create action. This is a future design sketch, not the current interface; `PostEditorState` would be a shared result type introduced during that work:

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

Build that next phase in small steps: first load an existing post into the form, then add an update operation that preserves its slug, and finally add deletion with explicit confirmation. Reuse the existing validation and heading contract instead of creating separate content rules for edits. None of those operations is implemented by the `mode` prop alone.

### 3. Local writes are not production persistence

The local workflow is useful for learning and development. On many deployment platforms, the deployed filesystem is read-only or ephemeral, and a newly written source file is not automatically added to the already-built JavaScript module graph.

When posts move to Neon PostgreSQL, choose one of these architectures deliberately:

- store Markdown and render it with a safe runtime Markdown pipeline, or
- materialize database content into repository files and trigger a rebuild.

`@next/mdx` by itself is a local build-time integration; it is not a runtime renderer for arbitrary database strings.

### 4. Heading collection is shared; heading rendering still needs a fix

`remark-headings.mjs` replaces the regex approach, excludes fenced code examples, and deduplicates IDs per document. Public compilation, preview, and table-of-contents extraction now use this shared logic.

However, `MDXComponents.tsx` currently defines `h2`, `h3`, and `h4` with block-bodied arrow functions containing JSX but no `return`. They return `undefined`, so those headings do not render and their table-of-contents anchors cannot resolve. Restore a JSX return while preserving the compiler-supplied `id` before calling the heading flow complete.

The previous `extractTextFromNode` and `slugifyHeading` imports in `MDXComponents.tsx`, and the `slugifyHeading` import in `post.ts`, are also unused after moving ID generation into the plugin. Removing those imports is a small follow-up. None of these application files were changed as part of this documentation update.

The smallest repair is to return the existing heading JSX and retain `{...props}`. Do not introduce another slug generator in the components: that would reintroduce disagreement with the shared collector. After the repair, run lint/build and the heading fixture above in both preview and the public page.

### 5. Homepage invalidation is implemented; production verification remains required

The successful create path now calls `revalidatePath("/")` alongside the admin list, blog index, and detail route. This addresses the missing homepage invalidation in the action.

Confirm the resulting behavior in production mode using the production-mode checklist above. Development rendering and a fresh production rebuild can both conceal a missing invalidation. Keep the separate source-module limitation in mind: refreshing a post list does not guarantee a newly written `.mdx` file can be imported by an already-built application.

## Definition of done for the create-post feature

The create-post phase is operational when:

- the admin can enter all required post fields
- Zod returns field-level validation errors
- preview renders on explicit request
- preview compilation is authenticated and server-only
- malformed syntax and MDX expressions, imports, exports, and JSX/HTML are rejected before preview or file creation
- fenced and inline code examples containing those constructs remain allowed
- a valid submission creates one new `.mdx` file
- an existing file cannot be overwritten
- public posts render through `@next/mdx`
- the successful create action invalidates the homepage, admin post list, blog index, and new post route
- metadata remains readable and table-of-contents entries share the renderer's heading ID algorithm
- heading renderers return visible elements with the supplied IDs, including unique IDs for repeated headings
- heading-looking text inside code fences is excluded from the table of contents
- lint and production build pass
- manual preview, heading-link, and production cache checks pass

Markdown-only validation, homepage invalidation, and parsed heading collection are implemented. The missing heading returns must be fixed and the verification checklist completed before marking the create-post feature fully done. Clearer validation feedback and edit/delete support remain follow-up work.

---

[Overview](../building-post-editor.md) · [Previous chapter](04-markdown-preview.md)
