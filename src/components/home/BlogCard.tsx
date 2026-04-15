import { BaseCard } from "../shared/BaseCard";
import { PostSummary } from "@/lib/post";

type Props = {
  post: PostSummary;
};

export const BlogCard = ({ post }: Props) => {
  return (
    <BaseCard href={`/blog/${post.slug}`}>
      <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {post.readingTime} min read · {post.date}
      </p>
    </BaseCard>
  );
};
