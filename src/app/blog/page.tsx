import { BlogListClient } from "@/components/blog/BlogListClient";
import { getAllPosts } from "@/lib/post";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Journal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Blog posts
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Notes on projects, architecture decisions, implementation details, and
          the lessons behind them.
        </p>
      </div>
      <BlogListClient posts={posts} />
    </section>
  );
}
