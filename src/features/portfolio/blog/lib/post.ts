import {
  findPublishedPostBySlug,
  listPublishedPosts,
  StoredPost,
} from "@/db/repositories/post-repository";
import { collectHeadings } from "@/features/admin/posts/lib/remark-headings.mjs";
import { Post, PostPageResult, PostSummary } from "@/types/post"
import { createProcessor } from "@mdx-js/mdx";
import { connection } from "next/server";
import "server-only"
import {
  publishedPostListSchema,
  PublishPostListInput,
} from "../schema/post-list-schema";
import { logServerError } from "@/lib/log-server-error";

const parser = createProcessor({ format: "md" })

export function toPost(row: StoredPost): Post {
  const words = row.content.trim().split(/\s+/).filter(Boolean);

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.date,
    tags: row.tags,
    content: row.content,
    readingTime: Math.ceil(words.length / 225),
    headings: collectHeadings(parser.parse(row.content)),
  };
}

export async function getPulbishedPostPage(
  input: PublishPostListInput,
): Promise<PostPageResult<PostSummary>> {
  const options = publishedPostListSchema.parse(input)
  await connection();
  try {
    return await listPublishedPosts(options);
  } catch (error) {
    const reference = logServerError("posts.list", error);
    throw new Error(`Unable to load posts. Reference: ${reference}`);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await connection();
  try {
    const row = await findPublishedPostBySlug(slug);
    return row ? toPost(row) : null;
  } catch (error) {
    const reference = logServerError("posts.read", error);
    throw new Error(`Unable to load the post. Reference ${reference}`);
  }

}
