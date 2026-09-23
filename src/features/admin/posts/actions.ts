"use server";

import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  CreatePostData,
  createPostSchema,
  postContentSchema,
} from "./schema/post-schema";
import z from "zod";
import {
  createPostFile,
  PostFileAlreadyExistsError,
  PostFileNotFoundError,
  updatePostFile,
} from "./lib/post-file-repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { compileMarkdownPreview } from "./lib/compile-markdown-preview";
import { validatePostContent } from "./lib/validate-post-content";
import { insertPost } from "@/db/repositories/post-repository";
import { NeonDbError } from "@neondatabase/serverless";

type PostField = keyof CreatePostData;

export type PostEditorState = {
  status: "idle" | "error";
  fieldErrors: Partial<Record<PostField, string[]>>;
  message: string | null;
};

export async function createPostAction(
  _previousState: PostEditorState,
  formData: FormData,
): Promise<PostEditorState> {
  await requireAdmin();
  const validationResult = createPostSchema.safeParse({
    status: formData.get("status"),
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
  try {
    const postContentValidation = await validatePostContent(post.content);
    if (!postContentValidation.success) {
      return {
        status: "error",
        fieldErrors: {
          content: [postContentValidation.message],
        },
        message: "Fix the article content before saving",
      };
    }
    await insertPost(post);
  } catch (error) {
    if (
      error instanceof NeonDbError &&
      error.code === "23505" &&
      error.constraint === "post_slug_unique"
    ) {
      return {
        status: "error",
        fieldErrors: {
          slug: ["A post with this slug already exists."],
        },
        message: "Choose a different slug",
      };
    }
    if (error instanceof PostFileAlreadyExistsError) {
      return {
        status: "error",
        fieldErrors: {
          slug: ["A post with this slug already exists."],
        },
        message: "Choose a different slug",
      };
    }

    return {
      status: "error",
      fieldErrors: {},
      message: "Unable to create the post. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  redirect(`/blog/${post.slug}`);
}

export type PostPreviewResult =
  | {
      success: true;
      preview: ReactNode;
    }
  | {
      success: false;
      message: string;
    };

export async function previewPostAction(
  content: string,
): Promise<PostPreviewResult> {
  await requireAdmin();
  const validationResult = postContentSchema.safeParse(content);
  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ?? "Invalid Markdown Content",
    };
  }

  try {
    const contentValidation = await validatePostContent(validationResult.data);
    if (!contentValidation.success) {
      return contentValidation;
    }
    const preview = await compileMarkdownPreview(validationResult.data);
    return {
      success: true,
      preview,
    };
  } catch {
    return {
      success: false,
      message: "The Markdown could not be compiled for preview.",
    };
  }
}

// update post action
export async function updatePostAction(
  originalSlug: string,
  _previousState: PostEditorState,
  formData: FormData,
): Promise<PostEditorState> {
  await requireAdmin();

  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    slug: originalSlug,
    description: formData.get("description"),
    date: formData.get("date"),
    tags: formData.get("tags") ?? "",
    content: formData.get("content"),
  });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      status: "error",
      fieldErrors,
      message: "Check the highlighted fields",
    };
  }

  const post = result.data;

  try {
    const contentValidation = await validatePostContent(post.content);
    if (!contentValidation.success) {
      return {
        status: "error",
        fieldErrors: {
          content: [contentValidation.message],
        },
        message: "Fix the articel content before saving",
      };
    }
    await updatePostFile(post);
  } catch (error) {
    return {
      status: "error",
      fieldErrors: {},
      message:
        error instanceof PostFileNotFoundError
          ? "This post no longer exist. Return to the post list."
          : "Unable to update the post. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${post.slug}/edit`);

  redirect("/admin/posts");
}
