import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { RecoveryFields } from "../schema/post-recovery-schema";
import { PostEditorState } from "../actions";
import { Input } from "@/components/ui/input";

type MetadataValues = Omit<RecoveryFields, "content">;

type PostMetadataFieldsProps = {
  values: MetadataValues;
  fieldErrors: PostEditorState["fieldErrors"];
  isEditing: boolean;
  onChange: (changes: Partial<MetadataValues>) => void;
};

export default function PostMetadataFields({
  values,
  fieldErrors,
  isEditing,
  onChange,
}: PostMetadataFieldsProps) {
  return (
    <>
      <Field data-invalid={Boolean(fieldErrors.status?.length)}>
        <FieldLabel htmlFor="status">Visibility</FieldLabel>
        <select
          name="status"
          id="status"
          value={values.status}
          onChange={(event) => {
            const status = event.target.value;
            if (status === "draft" || status === "published") {
              onChange({ status });
            }
          }}
          className="rounded-md border bg-background px-3 py-2"
          aria-invalid={Boolean(fieldErrors.status?.length)}
          aria-describedby={
            fieldErrors?.status?.length ? "status-error" : undefined
          }
        >
          <option value="draft">Draft - only visible in admin</option>
          <option value="published">Published - visible publicly</option>
        </select>
      </Field>

      {/* Title */}
      <Field data-invalid={Boolean(fieldErrors.title?.length)}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="e.g Build a secure admin dashboard"
          required
          aria-invalid={Boolean(fieldErrors.title?.length)}
        />
        <FieldError
          errors={fieldErrors.title?.map((message) => ({ message }))}
        />
      </Field>

      {/* Slug */}
      <Field aria-invalid={Boolean(fieldErrors.slug?.length)}>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <Input
          id="slug"
          name="slug"
          type="text"
          value={values.slug}
          onChange={(event) => onChange({ slug: event.target.value })}
          readOnly={isEditing}
          placeholder="building-a-secure-admin-dashboard"
          required
          aria-invalid
        />
        <FieldError
          errors={fieldErrors.slug?.map((message) => ({ message }))}
        />
      </Field>

      {/* Description */}
      <Field aria-invalid={Boolean(fieldErrors.description?.length)}>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Input
          id="description"
          name="description"
          type="text"
          value={values.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="A short summary of the article"
          required
          aria-invalid={Boolean(fieldErrors.description?.length)}
        />
        <FieldError
          errors={fieldErrors.description?.map((message) => ({ message }))}
        />
      </Field>

      {/* Publication Date */}
      <Field aria-invalid={Boolean(fieldErrors.date?.length)}>
        <FieldLabel htmlFor="date">Publication Date</FieldLabel>
        <Input
          id="date"
          name="date"
          type="date"
          value={values.date}
          onChange={(event) => onChange({ date: event.target.value })}
          required
          aria-invalid={Boolean(fieldErrors.date?.length)}
        />
        <FieldError
          errors={fieldErrors.date?.map((message) => ({ message }))}
        />
      </Field>

      {/* Tags */}
      <Field aria-invalid={Boolean(fieldErrors.tags?.length)}>
        <FieldLabel htmlFor="tags">Tags</FieldLabel>
        <Input
          id="tags"
          name="tags"
          value={values.tags}
          onChange={(event) => onChange({ tags: event.target.value })}
          placeholder="Next.js, TypeScript, Security"
          required
          aria-invalid={Boolean(fieldErrors.tags?.length)}
        />
        <FieldError
          errors={fieldErrors.tags?.map((message) => ({ message }))}
        />
        <FieldDescription>Separate tags using commas</FieldDescription>
      </Field>
    </>
  );
}
