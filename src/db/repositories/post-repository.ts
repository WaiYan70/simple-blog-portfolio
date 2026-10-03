import "server-only";

import { CreatePostData } from "@/features/admin/posts/schema/post-schema";
import { sql } from "../client";
import { randomUUID } from "node:crypto";
import {
  AdminPostListItem,
  PostListOptions,
  PostPageResult,
  PostSummary,
} from "@/types/post";

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

export async function listPublishedPosts(
  options: PostListOptions,
): Promise<PostPageResult<PostSummary>> {
  const { page, pageSize, query } = options;
  const offset = (page - 1) * pageSize;

  const rows = (await sql.query(
    `
      select
        slug,
        title,
        description,
        tags,
        to_char(publication_date, 'YYYY-MM-DD') as date,
        case
          when content_markdown ~ '^[[:space:]]*$' then 0
          else ceil(
            cardinality(
              regexp_split_to_array(
                regexp_replace(
                  content_markdown,
                  '^[[:space:]]+|[[:space:]]+$',
                  '',
                  'g'
                ),
                '[[:space:]]+'
              )
            ) / 225.0
          )::integer
        end as "readingTime"
      from posts
      where
        status = 'published'
        and (
          $1::text = ''
          or strpos(lower(title), lower($1)) > 0
          or strpos(lower(description), lower($1)) > 0
          or exists (
            select 1
            from unnest(tags) as tag(value)
            where strpos(lower(tag.value), lower($1)) > 0
          )
        )
      order by publication_date desc, id desc
      limit $2
      offset $3
    `,
    [query, pageSize + 1, offset],
  )) as PostSummary[];
  return {
    posts: rows.slice(0, pageSize),
    hasNext: rows.length > pageSize,
  }
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

export async function listAdminPosts(
  options: PostListOptions,
): Promise<PostPageResult<AdminPostListItem>> {
  const { page, pageSize, query } = options;
  const offset = (page - 1) * pageSize;

  const rows = (await sql.query(
    `
      select
        id,
        slug,
        title,
        status,
        to_char(publication_date, 'YYYY-MM-DD') as date
      from posts
      where
        (
          $1::text = ''
          or strpos(lower(title), lower($1)) > 0
          or strpos(lower(description), lower($1)) > 0
          or exists (
            select 1
            from unnest(tags) as tag(value)
            where strpos(lower(tag.value), lower($1)) > 0
          )
        )
      order by updated_at desc, id desc
      limit $2
      offset $3
    `,
    [query, pageSize + 1, offset],
  )) as AdminPostListItem[];

  return {
    posts: rows.slice(0, pageSize),
    hasNext: rows.length > pageSize,
  }
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
        ${post.date}::date,
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
        version = version + 1,
        updated_at = now()
      where id = ${id}::uuid
        and slug = ${post.slug}
        and version = ${expectedVersion}
      returning id
    `;
  return rows.length === 1;
}
