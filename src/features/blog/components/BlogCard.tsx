"use client";

import { BaseCard } from "@/components/shared/BaseCard";
import { PostSummary } from "@/lib/post";
import { ArrowRight, Dot } from "lucide-react";

type Props = {
  post: PostSummary;
};

export function BlogCard({ post }: Props) {
  return (
    <BaseCard href={`/blog/${post.slug}`} variant="ghost" radius="md">
      <div className="flex flex-col items-start justify-between">
        <h3
          style={{ viewTransitionName: `title-${post.slug}` }}
          className="text-lg font-semibold tracking-tight transition group-hover:text-primary"
        >
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
        <p className="mt-1 text-xs text-muted-foreground inline-flex items-center">
          {post.readingTime} min read <Dot /> {post.date}
        </p>
        <div className="mt-1 flex items-center text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 duration-300">
          Read
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 duration-500" />
        </div>
      </div>
    </BaseCard>
  );
}
