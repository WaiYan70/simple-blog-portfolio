"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CreatePostData, createPostSchema } from "./schema/post-schema";
import z from "zod";

type PostField = keyof CreatePostData;

export type CreatePostState = {
  status: "idle" | "error" | "validated";
  fieldErrors: Partial<Record<PostField, string[]>>;
  message: string | null;
};

export async function createPostAction(
  _previousState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  await requireAdmin();
  const validationResult = createPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    date: formData.get("date"),
    tags: formData.get("tags") ?? "",
    content: formData.get("content"),
  });

  if (!validationResult.success) {
    const { fieldErrors } = z.flattenError(validationResult.error);
    return {
      status: "error",
      fieldErrors,
      message: "Check the highlighted fields",
    };
  }

  const post = validationResult.data;

  // Next step
  // await createPostFile(post)

  return {
    status: "validated",
    fieldErrors: {},
    message: `Validation passed for "${post.title}".`,
  };
}
