import { BaseCard } from "../shared/BaseCard";
import { PostSummary } from "@/lib/post";

type Props = {
  post: PostSummary;
};

export const BlogCard = ({ post }: Props) => {
  return (
    <BaseCard href={`/blog/${post.slug}`}>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </BaseCard>
  );
};
