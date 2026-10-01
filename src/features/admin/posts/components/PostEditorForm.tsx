"use client";

import React, {
  type ReactNode,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import {
  previewPostAction, type PostEditorState } from "../actions";
import {
  postRecoverySchema,
  recoveryFieldsSchema,
} from "../schema/post-recovery-schema";
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
import { useRouter } from "next/navigation";

type PostEditorValues = {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  status: "draft" | "published";
};

type PostEditorFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<PostEditorValues>;
  action: (
    previousState: PostEditorState,
    formData: FormData,
  ) => Promise<PostEditorState>;
  recoveryKey: string;
  recoveryVersion: number | null;
};

const emptyValues: PostEditorValues = {
  title: "",
  slug: "",
  description: "",
  date: "",
  tags: [],
  content: "",
  status: "draft",
};

const initialCreatePostState: PostEditorState = {
  status: "idle",
  fieldErrors: {},
  message: null,
};

export function PostEditorForm({
  mode,
  defaultValues,
  action,
  recoveryKey,
  recoveryVersion
}: PostEditorFormProps) {
  const values = {
    ...emptyValues,
    ...defaultValues,
  };

  const router = useRouter();
  const saveCompleted = useRef(false);

  const [state, formAction, pending] = useActionState(
    async (
      previousState: PostEditorState,
      formData: FormData,
    ): Promise<PostEditorState> => {
      const result = await action(previousState, formData);
      if (result.status === "success") {
        saveCompleted.current = true;
        try {
          sessionStorage.removeItem(recoveryKey);
        } catch {
          console.warn(
            "The post was saved, but local recovery cleanup failed.",
          );
        }
        router.replace("/admin/posts");
      }
      return result;
    },
    initialCreatePostState,
  );

  // states for title, slug, description, date, tags
  const [title, setTitle] = useState(values.title);
  const [slug, setSlug] = useState(values.slug);
  const [description, setDescription] = useState(values.description);
  const [date, setDate] = useState(values.date);
  const [tags, setTags] = useState(values.tags.join(", "));

  // states for content
  const [content, setContent] = useState(values.content);
  const [view, setView] = useState<"write" | "preview">("write");
  const [previewContent, setPreviewContent] = useState<ReactNode>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPending, startPreviewTransition] = useTransition();

  const [publicationStatus, setPublicationStatus] = useState(values.status);

  const snapshot = {
    title,
    slug,
    description,
    date,
    tags,
    content,
    status: publicationStatus,
  };

  const [initialSnapshot] = useState(() => JSON.stringify(snapshot));

  const isDirty = JSON.stringify(snapshot) !== initialSnapshot;

  // Add the warning effect here.
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      if (saveCompleted.current) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  const saveRecovery = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    const formData = new FormData(event?.currentTarget);
    const result = recoveryFieldsSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!result.success) {
      setRecoveryMessage(
        "This recovery copy exceeds the local recovery limits. " +
          "Keep a separate copy of your work",
      );
      return;
    }

    try {
      if (JSON.stringify(result.data) === initialSnapshot) {
        sessionStorage.removeItem(recoveryKey);
      } else {
        sessionStorage.setItem(
          recoveryKey,
          JSON.stringify({
            version: recoveryVersion,
            fields: result.data,
          }),
        );
      }

      setRecoveryMessage(null);
    } catch {
      setRecoveryMessage(
        "Local recovery is unavailable. Save your work before leaving.",
      );
    }
  };

  const restoreRecovery = () => {
    try {
      const raw = sessionStorage.getItem(recoveryKey);
      if (!raw) {
        setRecoveryMessage("No recovery copy exists in this tab.");
        return;
      }
      const result = postRecoverySchema.safeParse(JSON.parse(raw));
      if (!result.success) {
        setRecoveryMessage("The recovery copy could not be read.");
        return;
      }
      if (result.data?.version !== recoveryVersion) {
        setRecoveryMessage(
          "This recovery copy belongs to an older saved version. " +
            "Review it separately before replacing the current post.",
        );
        return;
      }
      if (
        !window.confirm("Replace the editor fields with the recovery copy?")
      ) {
        return;
      }
      const field = result.data.fields;
      setTitle(field.title);
      setSlug(field.slug);
      setDescription(field.description);
      setDate(field.date);
      setTags(field.tags);
      setContent(field.content);
      setPublicationStatus(field.status);

      previewRequestId.current += 1;
      setView("write");

      setRecoveryMessage(
        "Recovery copy restored. It has not been saved to the database.",
      );
    } catch {
      setRecoveryMessage("Unable to read the recovery copy.");
    }
  };

  const wasPublished = defaultValues?.status === "published";
  const saveLabel =
    publicationStatus === "published"
      ? wasPublished
        ? "Update published post"
        : "Publish post"
      : wasPublished
        ? "Unpublish and save draft"
        : "Save draft";

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
    <form action={formAction} onChange={saveRecovery}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit post" : "Create a new post"}</CardTitle>
          <CardDescription>
            Write the post metadata and Markdown content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <fieldset disabled={pending} className="min-w-0">
            <FieldGroup>
              {/* Status */}
              <Field data-invalid={Boolean(state.fieldErrors.status?.length)}>
                <FieldLabel htmlFor="status">Visibility</FieldLabel>
                <select
                  name="status"
                  id="status"
                  value={publicationStatus}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "draft" || value === "published") {
                      setPublicationStatus(value);
                    }
                  }}
                  className="rounded-md border bg-background px-3 py-2"
                  aria-invalid={Boolean(state.fieldErrors.status?.length)}
                  aria-describedby={
                    state.fieldErrors?.status?.length
                      ? "status-error"
                      : undefined
                  }
                >
                  <option value="draft">Draft - only visible in admin</option>
                  <option value="published">
                    Published - visible publicly
                  </option>
                </select>
                <FieldError
                  id="status-error"
                  errors={state.fieldErrors.status?.map((message) => ({
                    message,
                  }))}
                />
              </Field>

              {/* Title */}
              <Field data-invalid={Boolean(titleErrors?.length)}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
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
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
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
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
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
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
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
                    disabled={pending}
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
                  Write the article body in Markdown. Metadata is saved
                  separately.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </fieldset>
        </CardContent>

        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link
              href="/admin/posts"
              onNavigate={(event) => {
                if (pending) {
                  event.preventDefault();
                  return;
                }
                if (
                  isDirty &&
                  !window.confirm(
                    "Leave without saving changes to the database?",
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              Cancel
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={restoreRecovery}
          >
            Restore unsaved copy
          </Button>
          {recoveryMessage && (
            <p role="status" className="text-sm text-muted-foreground">
              {recoveryMessage}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : saveLabel}
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
