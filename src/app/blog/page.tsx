import { BlogListClient } from "@/components/blog/BlogListClient";
import { getAllPosts } from "@/lib/post";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Journal
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Writing about systems,
          <span>decisions</span>, and tradeoffs
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          A collection of thoughs on building real-world system - from
          architecture decisions to implementation details and lessons learned
        </p>
      </div>

      {/* List */}
      <BlogListClient posts={posts} />
    </section>
  );
}
