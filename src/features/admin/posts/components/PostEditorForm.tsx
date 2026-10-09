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
  PostRecovery,
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
import PostRecoveryPanel from "./PostRecoveryPanel";
import PostMetadataFields from "./PostMetadataFields";

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

type RecoveryState =
  | { status: "checking" }
  | { status: "ready" }
  | { status: "unavailable" }
  | {
      status: "found";
      raw: string;
      copy: PostRecovery | null;
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

  const [recovery, setRecovery] = useState<RecoveryState>({
    status: "checking",
  });
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  const recoveryBlocked =
    recovery.status === "checking" || recovery.status === "found";
  const editorDisabled: boolean = pending || recoveryBlocked;
  const recoveryCopy = recovery.status === "found" ? recovery.copy : null;
  const recoveryVersionMatches: boolean =
    recoveryCopy !== null && recoveryCopy.version === recoveryVersion;
  const recoverySlugMatches: boolean =
    recoveryCopy !== null &&
    (mode === "create" || recoveryCopy.fields.slug === values.slug);
  const canRestoreRecovery: boolean =
    recoveryVersionMatches && recoverySlugMatches;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let raw: string | null;
      try {
        raw = sessionStorage.getItem(recoveryKey);
      } catch {
        setRecovery({ status: "unavailable" });
        setRecoveryMessage(
          "Local recovery is unavailable. " +
            "You can edit, but keep a separate copy of your work.",
        );
        return;
      }

      if (raw === null) {
        setRecovery({ status: "ready" });
        return;
      }
      let copy: PostRecovery | null = null;

      try {
        const parsed = postRecoverySchema.safeParse(JSON.parse(raw));

        if (parsed.success) {
          copy = parsed.data;
        }
      } catch {
        // Preserve malformed JSON for manual inspection.
        console.warn(
          "The recovery copy contains invalid JSON. The original data has been preserved for manual review.",
        );
      }

      setRecovery({
        status: "found",
        raw,
        copy,
      });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [recoveryKey]);

  const saveRecovery = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    // An unsolved recovery copy must never be overwritten
    if (recovery.status !== "ready" || pending || saveCompleted.current) {
      return;
    }

    const formData = new FormData(event?.currentTarget);
    const result = recoveryFieldsSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!result.success) {
      setRecoveryMessage(
        "Your latest changes exceed the local recovery limits. " +
          "The previous recovery copy was kept. " +
          "Keep a separate copy of your latest work.",
      );
      return;
    }

    try {
      const serializedFields = JSON.stringify(result.data);
      if (serializedFields === initialSnapshot) {
        sessionStorage.removeItem(recoveryKey);
      } else {
        const nextCopy: PostRecovery = {
          version: recoveryVersion,
          fields: result.data,
        };
        sessionStorage.setItem(recoveryKey, JSON.stringify(nextCopy));
      }

      setRecoveryMessage(null);
    } catch {
      setRecoveryMessage(
        "Your latest changes could not be stored locally. " +
          "Keep a separate copy before leaving.",
      );
    }
  };

  const restoreRecovery = (): void => {
    if (
      pending ||
      recovery.status !== "found" ||
      !recovery.copy ||
      !canRestoreRecovery
    ) {
      return;
    }

    const fields = recovery.copy.fields;

    setTitle(fields.title);
    setSlug(fields.slug);
    setDescription(fields.description);
    setDate(fields.date);
    setTags(fields.tags);
    setContent(fields.content);
    setPublicationStatus(fields.status);

    // Ignore any earlier preview reponse.
    previewRequestId.current += 1;
    setView("write");
    setPreviewContent(null);
    setPreviewError(null);

    // Keep the stored copy until a successful save or later edit!
    setRecovery({ status: "ready" });

    setRecoveryMessage(
      "Recovery copy restored. " + "It has not been saved to the database.",
    );
  };

  const discardRecovery = (): void => {
    if (pending || recovery.status !== "found") {
      return;
    }

    const confirmed = window.confirm(
      "Discard this local recovery copy? " +
        "This cannot be undone. Your saved database post will not change.",
    );

    if (!confirmed) {
      return;
    }

    try {
      sessionStorage.removeItem(recoveryKey);
      setRecovery({ status: "ready" });
      setRecoveryMessage("Local recovery copy discarded. You can now edit.");
    } catch {
      // Stay blocked because the old copy has not been removed.
      setRecoveryMessage(
        "The recovery copy could not be discarded. " +
          "It has been preserved. Copy any needed text before leaving.",
      );
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
    <form
      action={formAction}
      onChange={saveRecovery}
      onSubmit={(event) => {
        if (recoveryBlocked) {
          event.preventDefault();
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit post" : "Create a new post"}</CardTitle>
          <CardDescription>
            Write the post metadata and Markdown content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {recovery.status === "checking" && (
            <p role="status" className="mb-4 text-sm text-muted-foreground">
              Checking for an unsaved recovery copy…
            </p>
          )}

          {recovery.status === "found" && (
            <PostRecoveryPanel
              raw={recovery.raw}
              copy={recovery.copy}
              versionMatches={recoveryVersionMatches}
              slugMatches={recoverySlugMatches}
              pending={pending}
              onRestore={restoreRecovery}
              onDiscard={discardRecovery}
            />
          )}
          <fieldset disabled={editorDisabled} className="min-w-0">
            <FieldGroup>

              <PostMetadataFields
                values={fields}
                fieldErrors={state.fieldErrors}
                isEditing={isEditing}
                onChange={updateFields}
              />

              {/* Content */}
              <Field data-invalid={Boolean(contentErrors?.length)}>
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel htmlFor="content">Markdown content</FieldLabel>

                  <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={handleViewChange}
                    disabled={editorDisabled}
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
          {recoveryMessage && (
            <p role="status" className="text-sm text-muted-foreground">
              {recoveryMessage}
            </p>
          )}
          <Button type="submit" disabled={editorDisabled}>
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
