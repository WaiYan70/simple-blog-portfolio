import { z } from "zod";


const hasNoNullCharacter = (value: string): boolean => {
  return !value.includes("\u0000");
};

export const postContentSchema = z
  .string()
  .max(200_000, "Markdown content is too large")
  .refine(
    (content) => content.trim().length > 0,
    "Markdown content is required",
  )
  .refine(hasNoNullCharacter,
    "Content contains an unsupported null character"
  );

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer")
    .refine(hasNoNullCharacter, "Title contains an unsupported null character"),

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
    .max(300, "Description must be 300 characters or fewer")
    .refine(
      hasNoNullCharacter,
      "Description contains an unsupported null character",
    ),
  date: z.iso.date("Choose a valid publication date"),
  tags: z
    .string()
    .refine(hasNoNullCharacter, "Tags contain an unsupported null character")
    .transform((value) => {
      const tags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      return [...new Set(tags)];
    })
    .pipe(
      z
        .array(z.string().max(30, "Each tag must be 30 characters or fewer"))
        .max(10, "Use no more than 10 tags"),
    ),
  content: postContentSchema,
  status: z.enum(["draft", "published"]),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
