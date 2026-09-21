import "server-only";

import { CreatePostData } from "@/features/admin/posts/schema/post-schema";
import { sql } from "../client";

export type StoredPost = CreatePostData & {
  id: string;
  version: number;
};

const postColumns = `
    id,
    slug,
    title,
    description,
    content_markdown as content,
    tags,
    status,
    to_char(publication_date, 'YYYY-MM-DD') as date,
    version
  `;

export async function findPublishedPostBySlug(
  slug: string,
): Promise<StoredPost | null> {
  const rows = (await sql.query(
    `select ${postColumns}
    from posts
    where slug = $1 and status = 'published'
    limit 1`,
    [slug],
  )) as StoredPost[];

  return rows[0] ?? null;
}

export async function listPublishedPosts(): Promise<StoredPost[]> {
  return (await sql.query(
    `select ${postColumns} from posts where status = 'published' order by publication_date desc, id desc`,
  )) as StoredPost[];
}

export async function findAdminPostBySlug(
  slug: string,
): Promise<StoredPost | null> {
  const rows = (await sql.query(
    `select ${postColumns} from posts where slug = $1 limit 1`,
    [slug],
  )) as StoredPost[];

  return rows[0] ?? null;
}

export async function listAdminPosts(): Promise<StoredPost[]> {
  return (await sql.query(
    `select ${postColumns} from posts order by updated_at desc, id desc`,
  )) as StoredPost[];
}
