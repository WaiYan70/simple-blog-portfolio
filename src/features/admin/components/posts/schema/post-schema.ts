import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or fewer")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(300, "Description must be 300 characters or fewer"),
  date: z.iso.date("Choose a valid publication date"),
  tags: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().max(30, "Each tag must be 30 characters or fewer"))
        .max(10, "Use no more than 10 tags"),
    ),
  content: z
    .string()
    .refine(
      (content) => content.trim().length > 0,
      "Markdown content is required",
    ),
});

export type CreatePostData = z.infer<typeof createPostSchema>;

export const postContentSchema = z
  .string()
  .max(200_000, "Markdown content is too large")
  .refine(
    (content) => content.trim().length > 0,
    "Markdown content is required",
  );
