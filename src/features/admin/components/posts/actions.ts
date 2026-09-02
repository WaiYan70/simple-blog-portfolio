"use server";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote/rsc";
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
} from "./lib/post-file-repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";

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
  try {
    await createPostFile(post);
  } catch (error) {
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

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  redirect(`/blog/${post.slug}`);
}

export type PostPreviewResult =
  | {
      success: true;
      source: MDXRemoteSerializeResult;
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
    const source = await serialize(validationResult.data, {
      blockJS: true,
      blockDangerousJS: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "tokyo-night",
              keepBackground: false,
            },
          ],
        ],
      },
    });
    return {
      success: true,
      source,
    };
  } catch {
    return {
      success: false,
      message: "The Markdown contains invalid MDX syntax.",
    };
  }
}
