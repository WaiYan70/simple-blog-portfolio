import "server-only";

import { CreatePostData } from "@/features/admin/posts/schema/post-schema";
import { sql } from "../client";
import { randomUUID } from "node:crypto";

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

export async function insertPost(post: CreatePostData) {
  await sql`
      insert into posts (
        id,
        slug,
        title,
        description,
        content_markdown,
        tags,
        status,
        publication_date,
        published_at
      )
      values (
        ${randomUUID()},
        ${post.slug},
        ${post.title},
        ${post.description},
        ${post.content},
        ${post.tags}::text[],
        ${post.status},
        ${post.date}::date
        case
            when ${post.status} = 'published' then now()
            else null
        end
    )
  `;
}

export async function updatePost(
  id: string,
  expectedVersion: number,
  post: CreatePostData,
): Promise<boolean> {
  const rows = await sql`
      update posts
      set
        title = ${post.title},
        description= ${post.description},
        content_markdown = ${post.content},
        tags = ${post.tags}::text[],
        status = ${post.status},
        publication_date = ${post.date}::date,
        published_at = case
          when ${post.status} = 'published'
            then coalesce(published_at, now())
          else published_at
        end,
        version = version + 1
        updated_at = now()
      where id = ${id}::uuid
        and slug = ${post.slug}
        and version = ${expectedVersion}
      returning id
    `;
  return rows.length === 1;
}
