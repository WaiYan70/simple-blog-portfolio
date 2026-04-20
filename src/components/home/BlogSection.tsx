import { PostSummary } from "@/lib/post";
import { BlogCard } from "./BlogCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "../shared/Section";
import { SectionHeader } from "../shared/SectionHeader";

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  return (
    <Section>
      <SectionHeader
        title="Latest Writing"
        action={
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            All Writing{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-0.5" />
          </Link>
        }
        className="flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-between"
      />
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
