import type { ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type PostMarkdownEditorProps = {
  content: string;
  errors?: string[];
  disabled: boolean;
  previewContent: ReactNode;
  previewError: string | null;
  previewPending: boolean;
  onContentChange: (content: string) => void;
  onRefreshPreview: () => void;
};

export default function PostMarkdownEditor({
  content,
  errors,
  disabled,
  previewContent,
  previewError,
  previewPending,
  onContentChange,
  onRefreshPreview,
}: PostMarkdownEditorProps) {
  const hasErrors = Boolean(errors?.length);
  return (
    <FieldGroup className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <Field
        className="min-w-0"
        data-invalid={hasErrors}
        data-disable={disabled}
      >
        <div className="flex min-h-8 items-center">
          <FieldLabel>Write</FieldLabel>
        </div>
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={(event) => {
            onContentChange(event.target.value)
          }}
          placeholder="# Introduction"
          className="h-128 resize-none field-sizing-fixed font-mono"
          disabled={disabled}
          required
          aria-invalid={hasErrors}
          aria-describedby={
            hasErrors
              ? "content-description content-error"
              : "content-description"
          }
        />
        <FieldError
          id="content-error"
          errors={errors?.map((message) => ({ message }))}
        />
        <FieldDescription id="content-description">
          Write the article body in Markdown. Metadata is saved separately
        </FieldDescription>
      </Field>
      <Field className="min-w-0" data-disabled={disabled}>
        <div className="flex min-h-8 items-center justify-between gap-3">
          <FieldTitle id="post-preview-title">Preview</FieldTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefreshPreview}
          >
            {previewPending ? "Rendering..." : "Refresh preview"}
          </Button>
        </div>
        <div
          role="region"
          aria-labelledby="post-preview-title"
          aria-busy={previewPending}
          className="h-128 min-w-0 overflow-auto rounded-md border p-4"
        >
          {previewPending && (
            <p role="status" className="text-sm text-muted-foreground">
              Rendering preview
            </p>
          )}
          <FieldError>{previewError}</FieldError>
          {previewContent}
          {previewContent === null && !previewPending && !previewError && (
            <FieldDescription>
              Write some Markdown, then click Refresh preview.
            </FieldDescription>
            )}
        </div>
        <FieldDescription>
          Preview shows the last rendered version. Refresh after editing.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
