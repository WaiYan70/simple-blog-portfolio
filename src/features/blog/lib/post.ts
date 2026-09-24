import {
  findPublishedPostBySlug,
  listPublishedPosts,
  StoredPost,
} from "@/db/repositories/post-repository";
import { collectHeadings } from "@/features/admin/posts/lib/remark-headings.mjs";
import { Post, PostSummary } from "@/types/post"
import { createProcessor } from "@mdx-js/mdx";
import { connection } from "next/server";
import "server-only"

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

export function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    readingTime: post.readingTime,
    headings: post.headings,
  };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  await connection();
  const rows = await listPublishedPosts();
  return rows.map((row) => toSummary(toPost(row)));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await connection();
  const row = await findPublishedPostBySlug(slug);
  return row ? toPost(row) : null;
}
