import z from "zod";

export const publishedPostListSchema = z.object({
  page: z.number().int().min(1).max(10_000).default(1),
  pageSize: z.number().int().min(1).max(50).default(10),
  query: z.string().trim().max(100).default(""),
});

export type PublishPostListInput = z.input<typeof publishedPostListSchema>;
