"use client";

import Link from "next/link";
import { createPostAction, type CreatePostState } from "../actions";
import { useActionState } from "react";
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

export function PostEditorForm({ mode, defaultValues }: PostEditorFormProps) {

  const values = {
    ...emptyValues,
    ...defaultValues,
  };

  const initialState: CreatePostState = {
    status: "idle",
    fieldErrors: {},
    message: null,
  };

  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialState,
  );

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
                placeholder="Next.js, TypeScript, Secuirty"
                aria-invalid={Boolean(tagsErrors?.length)}
              />
              <FieldError
                errors={tagsErrors?.map((message) => ({ message }))}
              />
              <FieldDescription>Separate tags using commas</FieldDescription>
            </Field>

            {/* Content */}
            <Field data-invalid={Boolean(contentErrors?.length)}>
              <FieldLabel htmlFor="content">Markdown content</FieldLabel>
              <Textarea
                id="content"
                name="content"
                defaultValue={values.content}
                placeholder="# Introduction"
                className="min-h-128 resize-y"
                required
                aria-invalid={Boolean(contentErrors?.length)}
              />
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

          {state.status === "validated" && state.message ? (
            <p className="text-sm text-muted-foreground">{state.message}</p>
          ) : null}
        </div>
      </Card>
    </form>
  );
}
