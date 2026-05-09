import { BlogListClient } from "@/features/blog/components/BlogListClient";
import { getAllPosts } from "@/features/blog/lib/post";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Journal
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Writing about systems, decisions, and tradeoffs
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          A collection of thoughts on building real-world systems, from
          architecture decisions to implementation details and lessons learned.
        </p>
      </div>

      <BlogListClient posts={posts} />
    </section>
  );
}
