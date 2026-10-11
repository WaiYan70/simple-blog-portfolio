import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReactNode } from "react";

export type PostEditorView = "write" | "preview";

type PostMarkdownEditorProps = {
  content: string;
  errors?: string[];
  disabled: boolean;
  view: PostEditorView;
  previewContent: ReactNode;
  previewError: string | null;
  previewPending: boolean;
  onContentChange: (content: string) => void;
  onViewChange: (view: string) => void;
};

export default function PostMarkdownEditor({
  content,
  errors,
  disabled,
  view,
  previewContent,
  previewError,
  previewPending,
  onContentChange,
  onViewChange,
}: PostMarkdownEditorProps) {
  return (
    <Field aria-invalid={Boolean(errors?.length)}>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel htmlFor="content">Markdown Content</FieldLabel>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={onViewChange}
          disabled={disabled}
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
            onContentChange(event.target.value);
          }}
          placeholder="# Introduction"
          className="min-h-128 resize-y"
          required
          aria-invalid={Boolean(errors?.length)}
        />
      ) : (
        <>
          <input type="hidden" name="content" value={content} />
          <div
            className="min-h-128 rounded-md border p-6"
            aria-busy={previewPending}
          >
            {previewPending && (
              <p
                role="status"
                aria-live="polite"
                className="text-sm text-muted-foreground"
              >
                Rendering Preview...
              </p>
            )}
            {!previewPending && previewError && (
              <p role="alert" className="text-sm text-destructive">
                {previewError}
              </p>
            )}
            {!previewPending && !previewError ? previewContent : null}
          </div>
        </>
      )}

      <FieldError errors={errors?.map((message) => ({ message }))} />
      <FieldDescription>
        Write the article body in Markdown. Metadata is saved separately.
      </FieldDescription>
    </Field>
  );
}
