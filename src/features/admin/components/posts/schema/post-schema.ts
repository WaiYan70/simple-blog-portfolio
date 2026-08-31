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
    .max(300, "Description mut be 300 characters or fewer"),
  date: z.iso.date("Choose a valid publication date"),
  tags: z.string().transform((value) =>
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
  content: z
    .string()
    .refine(
      (content) => content.trim().length > 0,
      "Markdown content is required",
    ),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
