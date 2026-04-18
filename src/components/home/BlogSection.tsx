import { PostSummary } from "@/lib/post";
import { BlogCard } from "./BlogCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  return (
    <section className="mt-12 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest Writing
        </h2>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          All writing
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
