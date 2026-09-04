"use client";

import {
  type ReactNode,
  useActionState,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import {
  createPostAction,
  previewPostAction,
  type CreatePostState,
} from "../actions";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const emptyValues: PostEditorValues = {
  title: "",
  slug: "",
  description: "",
  date: "",
  tags: [],
  content: "",
};

const initialCreatePostState: CreatePostState = {
  status: "idle",
  fieldErrors: {},
  message: null,
};

export function PostEditorForm({ mode, defaultValues }: PostEditorFormProps) {
  const values = {
    ...emptyValues,
    ...defaultValues,
  };

  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialCreatePostState,
  );

  const [content, setContent] = useState(values.content);
  const [view, setView] = useState<"write" | "preview">("write");
  const [previewContent, setPreviewContent] = useState<ReactNode>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPending, startPreviewTransition] = useTransition();

  const previewRequestId = useRef(0);
  const handleViewChange = (nextView: string): void => {
    if (nextView !== "write" && nextView !== "preview") {
      return;
    }

    if (nextView === "write") {
      previewRequestId.current += 1;
      setView("write");
      return;
    }

    const requestId = ++previewRequestId.current;

    setView("preview");
    setPreviewContent(null);
    setPreviewError(null);

    startPreviewTransition(async () => {
      try {
        const result = await previewPostAction(content);
        if (requestId !== previewRequestId.current) {
          return;
        }
        if (result.success) {
          setPreviewContent(result.preview);
          return;
        }
        setPreviewError(result.message);
      } catch {
        if (requestId !== previewRequestId.current) {
          return;
        }
        setPreviewError("Unable to render the preview");
      }
    });
  };

  const isEditing = mode === "edit";

  const titleErrors = state.fieldErrors.title;
  const slugErrors = state.fieldErrors.slug;
  const descriptionErrors = state.fieldErrors.description;
  const dateErrors = state.fieldErrors.date;
  const tagsErrors = state.fieldErrors.tags;
  const contentErrors = state.fieldErrors.content;

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit post" : "create a new post"}</CardTitle>
          <CardDescription>
            Write the post metadata and Markdown content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            {/* Title */}
            <Field data-invalid={Boolean(titleErrors?.length)}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                defaultValue={values.title}
                placeholder="e.g Build a secure admin dashboard"
                required
                aria-invalid={Boolean(titleErrors?.length)}
              />
              <FieldError
                errors={titleErrors?.map((message) => ({ message }))}
              />
            </Field>

            {/* Slug */}
            <Field data-invalid={Boolean(slugErrors?.length)}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                name="slug"
                defaultValue={values.slug}
                placeholder="building-a-secure-admin-dashboard"
                readOnly={isEditing}
                required
                aria-invalid={Boolean(slugErrors?.length)}
              />
              <FieldError
                errors={slugErrors?.map((message) => ({ message }))}
              />
            </Field>

            {/* Description */}
            <Field data-invalid={Boolean(descriptionErrors?.length)}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                name="description"
                defaultValue={values.description}
                placeholder="A short summary of the article"
                required
                aria-invalid={Boolean(descriptionErrors?.length)}
              />
              <FieldError
                errors={descriptionErrors?.map((message) => ({ message }))}
              />
            </Field>

            {/* Date */}
            <Field data-invalid={Boolean(dateErrors?.length)}>
              <FieldLabel htmlFor="date">Publication Date</FieldLabel>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={values.date}
                required
                aria-invalid={Boolean(dateErrors?.length)}
              />
              <FieldError
                errors={dateErrors?.map((message) => ({ message }))}
              />
            </Field>

            {/* Tags */}
            <Field data-invalid={Boolean(tagsErrors?.length)}>
              <FieldLabel htmlFor="tags">Tags</FieldLabel>
              <Input
                id="tags"
                name="tags"
                defaultValue={values.tags.join(", ")}
                placeholder="Next.js, TypeScript, Security"
                aria-invalid={Boolean(tagsErrors?.length)}
              />
              <FieldError
                errors={tagsErrors?.map((message) => ({ message }))}
              />
              <FieldDescription>Separate tags using commas</FieldDescription>
            </Field>

            {/* Content */}
            <Field data-invalid={Boolean(contentErrors?.length)}>
              <div className="flex items-center justify-between gap-4">
                <FieldLabel htmlFor="content">Markdown content</FieldLabel>

                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={handleViewChange}
                  variant="outline"
                  spacing={0}
                  aria-label="Markdown editor view"
                >
                  <ToggleGroupItem
                    type="button"
                    value="write"
                    aria-label="Write Markdown"
                  >
                    Write
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    type="button"
                    value="preview"
                    aria-label="Preview Markdown"
                  >
                    Preview
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {view === "write" ? (
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
                  }}
                  placeholder="# Introduction"
                  className="min-h-128 resize-y"
                  required
                  aria-invalid={Boolean(contentErrors?.length)}
                />
              ) : (
                <>
                  <input type="hidden" name="content" value={content} />
                  <div
                    className="min-h-128 rounded-md border p-6"
                    aria-busy={previewPending}
                  >
                    {previewPending ? (
                      <p
                        role="status"
                        aria-live="polite"
                        className="text-sm text-muted-foreground"
                      >
                        Rendering Preview...
                      </p>
                    ) : null}
                    {!previewPending && previewError ? (
                      <p role="alert" className="text-sm text-destructive">
                        {previewError}
                      </p>
                    ) : null}
                    {!previewPending && !previewError ? previewContent : null}
                  </div>
                </>
              )}

              <FieldError
                errors={contentErrors?.map((message) => ({ message }))}
              />
              <FieldDescription>
                Write only the article body here. The form will generate the
                frontmatter later
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending
              ? "Validating..."
              : isEditing
                ? "Save changes"
                : "Create a new post"}
          </Button>
        </CardFooter>

        <div aria-live="polite">
          {state.status === "error" && state.message ? (
            <FieldError errors={[{ message: state.message }]} />
          ) : null}
        </div>
      </Card>
    </form>
  );
}
