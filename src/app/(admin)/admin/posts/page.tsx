import {
  PostPagination,
  PostSearch,
} from "@/components/shared/PostListControls";
import { getAdminPostPage } from "@/features/admin/posts/queries";
import { adminPostListSchema } from "@/features/admin/posts/schema/post-list-schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PostPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const parsed = adminPostListSchema.safeParse({
    page:
      params.page === undefined
        ? undefined
        : typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
          ? Number(params.page)
          : Number.NaN,
    query: params.q,
  });

  if (!parsed.success) {
    return (
      <main className="space-y-4 p-6">
        {" "}
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p>
          Invalid search options. Use a page between 1 and 10,000 and a search
          of at most 100 characters
        </p>
        <Link href="/admin/posts" className="underline">
          Reset filters
        </Link>
      </main>
    );
  }

  const options = parsed.data;
  const { posts, hasNext } = await getAdminPostPage(options);

  let emptyMessage = "No post yet.";
  if (options.page > 1) {
    emptyMessage = "No posts found on this page.";
  } else if (options.query) {
    emptyMessage = "No posts found matching your search";
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/admin/posts/new" className="underline">
          Create post
        </Link>
      </header>

      <PostSearch pathname="/admin/posts" query={options.query} />

      <p>
        Showing {posts.length} {posts.length === 1 ? "post" : "posts"} on this
        page
      </p>

      {posts.length === 0 ? (
        <p> {emptyMessage} </p>
      ) : (
        <ul className="divide-y">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {post.date} · {post.status}
                </p>
              </div>
              <div className="flex gap-4">
                {post.status === "published" && (
                  <Link href={`/blog/${post.slug}`} className="underline">
                    View
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.slug}/edit`}
                  className="underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PostPagination
        pathname="/admin/posts"
        page={options.page}
        query={options.query}
        hasNext={hasNext}
      />

    </main>
  );
}
