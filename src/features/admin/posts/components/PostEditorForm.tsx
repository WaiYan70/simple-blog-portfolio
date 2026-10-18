"use client";

import React, {
  useActionState,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { type PostEditorState } from "../actions";
import { RecoveryFields } from "../schema/post-recovery-schema";
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
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";
import PostRecoveryPanel from "./PostRecoveryPanel";
import PostMetadataFields from "./PostMetadataFields";
import PostMarkdownEditor from "./PostMarkdownEditor";
import usePostPreview from "../hooks/usePostPreview";
import usePostRecovery from "../hooks/usePostRecovery";
import useUnsavedChangesWarning from "../hooks/useUnsavedChangesWarning";

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

const initialPostEditorState: PostEditorState = {
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
  const router = useRouter();
  const saveCompleted = useRef(false);

  const [initialFields] = useState<RecoveryFields>(() => {
    const values = { ...emptyValues, ...defaultValues };
    return {
      title: values.title,
      slug: values.slug,
      description: values.description,
      date: values.date,
      tags: values.tags.join(", "),
      content: values.content,
      status: values.status,
    };
  });

  const [fields, setFields] = useState<RecoveryFields>(initialFields);
  const [initialSnapshot] = useState(() => JSON.stringify(initialFields));

  const isDirty = JSON.stringify(fields) !== initialSnapshot;

  const preview = usePostPreview(fields.content);

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
            "The Post was saved, but local recovery cleanup failed.",
          )
        }
        router.replace("/admin/posts")
      }
      return result;
    },
    initialPostEditorState,
  );

  const recovery = usePostRecovery({
    mode,
    recoveryKey,
    recoveryVersion,
    originalSlug: initialFields.slug,
    initialSnapshot,
    pending,
    saveCompleted,
  });

  useUnsavedChangesWarning(isDirty, saveCompleted);

  const updateFields = (changes: Partial<RecoveryFields>): void => {
    setFields((currentFields) => ({
      ...currentFields,
      ...changes,
    }));
  };

  const restoreRecovery = (): void => {
    const restoredFields = recovery.restoreRecovery();
    if (!restoredFields) {
      return;
    }
    setFields(restoredFields);
    preview.resetPreview();
  };

  const isEditing = mode === "edit";
  const editorDisabled = pending || recovery.recoveryBlocked;
  const wasPublished = defaultValues?.status === "published";
  const saveLabel =
    fields.status === "published"
      ? wasPublished
        ? "Update published post"
        : "Publish post"
      : wasPublished
        ? "Unpublish and save draft"
        : "Save draft"

  return (
    <form
      action={formAction}
      onChange={recovery.saveRecovery}
      onSubmit={(event) => {
        if (recovery.recoveryBlocked) {
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
          {recovery.recovery.status === "checking" && (
            <p role="status" className="mb-4 text-sm text-muted-foreground">
              Checking for an unsaved recovery copy…
            </p>
          )}

          {recovery.recovery.status === "found" && (
            <PostRecoveryPanel
              raw={recovery.recovery.raw}
              copy={recovery.recovery.copy}
              versionMatches={recovery.recoveryVersionMatches}
              slugMatches={recovery.recoverySlugMatches}
              pending={pending}
              onRestore={restoreRecovery}
              onDiscard={recovery.discardRecovery}
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
              <PostMarkdownEditor
                content={fields.content}
                errors={state.fieldErrors.content}
                disabled={editorDisabled}
                previewContent={preview.previewContent}
                previewError={preview.previewError}
                previewPending={preview.previewPending}
                onContentChange={(content) => updateFields({ content })}
                onRefreshPreview={preview.refreshPreview}
              />
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
          {recovery.recoveryMessage && (
            <p role="status" className="text-sm text-muted-foreground">
              {recovery.recoveryMessage}
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
