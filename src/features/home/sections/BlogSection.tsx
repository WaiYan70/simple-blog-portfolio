import { PostSummary } from "@/features/blog/lib/post";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Section } from "@/components/shared/Section";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { StaggerReveal } from "../animation/StaggerReveal";

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  return (
    <Section>
      <SectionHeader
        title="Latest Writing"
        description="Short notes on architecture, implementation details, and the decisions behind the systems I build."
        action={
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary underline italic"
          >
            All Writing
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <StaggerReveal className="grid gap-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </StaggerReveal>
    </Section>
  );
}
