"use server";

import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  CreatePostData,
  createPostSchema,
  postContentSchema,
} from "./schema/post-schema";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { compileMarkdownPreview } from "./lib/compile-markdown-preview";
import { validatePostContent } from "./lib/validate-post-content";
import { insertPost, updatePost } from "@/db/repositories/post-repository";
import { NeonDbError } from "@neondatabase/serverless";
import { logServerError } from "@/lib/log-server-error";

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
      error.constraint === "posts_slug_unique"
    ) {
      return {
        status: "error",
        fieldErrors: {
          slug: ["A post with this slug already exists."],
        },
        message: "Choose a different slug",
      };
    }

    const reference = logServerError("posts.create", error);

    return {
      status: "error",
      fieldErrors: {},
      message: `Unable to create the post. Reference: ${reference}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  redirect(`/admin/posts`);
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
  } catch (error) {
    const reference = logServerError("posts.preview", error);
    return {
      success: false,
      message: `Unable to render the preview. Reference ${reference}`,
    };
  }
}

// update post action
export async function updatePostAction(
  postId: string,
  originalSlug: string,
  expectedVersion: number,
  _previousState: PostEditorState,
  formData: FormData,
): Promise<PostEditorState> {
  await requireAdmin();

  const target = z
    .object({
      postId: z.uuid(),
      expectedVersion: z.number().int().positive(),
    })
    .safeParse({
      postId,
      expectedVersion,
    });

  if (!target.success) {
    return {
      status: "error",
      fieldErrors: {},
      message: "Invalid edit request. Reopen the post and try again.",
    };
  }

  const result = createPostSchema.safeParse({
    status: formData.get("status"),
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
        message: "Fix the article content before saving",
      };
    }

    const updated = await updatePost(
      target.data.postId,
      target.data.expectedVersion,
      post,
    );

    if (!updated) {
      return {
        status: "error",
        fieldErrors: {},
        message:
          "This post changed or was removed after you opened it. " +
          "Copy your unsaved changes before reloading.",
      };
    }
  } catch (error) {
    const reference = logServerError("posts.update", error);
    return {
      status: "error",
      fieldErrors: {},
      message: `Unable to update the post. Reference: ${reference}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath(`/blog/${post.slug}/opengraph-image`)
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${post.slug}/edit`);

  redirect("/admin/posts");
}
