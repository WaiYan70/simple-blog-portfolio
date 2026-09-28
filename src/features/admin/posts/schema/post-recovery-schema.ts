import z from "zod";

export const recoveryFieldsSchema = z.object({
  title: z.string().max(10_000),
  slug: z.string().max(10_000),
  description: z.string().max(10_000),
  date: z.string().max(100),
  tags: z.string().max(10_000),
  content: z.string().max(200_000),
  status: z.enum(["draft", "published"]),
});

export const postRecoverySchema = z.object({
  version: z.number().int().positive().nullable(),
  fields: recoveryFieldsSchema,
});
