import { PostSummary } from "@/lib/post";
import { BlogCard } from "./BlogCard";

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  return (
    <section className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Latest Writing</h2>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
