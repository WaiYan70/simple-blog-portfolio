import { BaseCard } from "@/components/shared/BaseCard";
import { PostSummary } from "@/features/blog/lib/post";
import { ArrowRight, BookOpen, Dot } from "lucide-react";

type Props = {
  post: PostSummary;
};

export function BlogCard({ post }: Props) {
  return (
    <BaseCard href={`/blog/${post.slug}`} variant="outline" radius="xl">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {post.readingTime} min read <Dot className="h-4 w-4" /> {post.date}
          </p>

          <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
            {post.title}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {post.description}
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition group-hover:text-primary">
          <BookOpen className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </BaseCard>
  );
}
