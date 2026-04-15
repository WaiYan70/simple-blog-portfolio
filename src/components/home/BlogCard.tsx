import { BaseCard } from "../shared/BaseCard";
import { PostSummary } from "@/lib/post";
import { ArrowRight } from "lucide-react";

type Props = {
  post: PostSummary;
};

export const BlogCard = ({ post }: Props) => {
  return (
    <BaseCard href={`/blog/${post.slug}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {post.description}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {post.readingTime} min read · {post.date}
          </p>
        </div>
        <ArrowRight />
      </div>
    </BaseCard>
  );
};
