import { getAllPosts } from "@/features/blog/lib/post";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";

export default async function PostPage() {
  await requireAdmin();
  const posts = await getAllPosts();

  return (
    <main className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/admin/posts/new" className="underline">
          Create post
        </Link>
      </header>

      {posts.length === 0 ? (
        <p> No posts yet.</p>
      ) : (
        <ul className="divide-y">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
              <div className="flex gap-4">
                <Link href={`/blog/${post.slug}`} className="underline">
                  View
                </Link>
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
    </main>
  );
}
