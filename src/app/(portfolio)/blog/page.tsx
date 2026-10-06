import Link from "next/link";
import { getPulbishedPostPage } from "@/features/portfolio/blog/lib/post";
import { publishedPostListSchema } from "@/features/portfolio/blog/schema/post-list-schema";
import { BlogCard } from "@/features/portfolio/blog/components/BlogCard";
import {
  PostPagination,
  PostSearch,
} from "@/components/shared/PostListControls";
import { Section } from "@/components/shared/Section";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;

  const parsed = publishedPostListSchema.safeParse({
    page:
      params.page === undefined
        ? undefined
        : typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
          ? Number(params.page)
          : Number.NaN,
    query: params.q,
  });

  if (!parsed.success) {
    return (
      <Section>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Journal</h1>
          <p>
            Invalid search options. Use a page between 1 and 10,000 and a search
            of at most 100 characters
          </p>
          <Link href="/blog" className="underline">
            Reset filters
          </Link>
        </div>
      </Section>
    );
  }

  const options = parsed.data;
  const { posts, hasNext } = await getPulbishedPostPage(options)

  return (
    <Section>
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Journal
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Writing about systems, decisions, and tradeoffs
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          A collection of thoughts on building real-world systems, from
          architecture decisions to implementation details and lessons learned.
        </p>
      </div>
      <div>
        <PostSearch pathname="/blog" query={options.query} />
        <p>Showing {posts.length} posts on this page</p>
        {posts.length === 0 ? (
          <div>No posts found on this page</div>
        ) : (
          <div>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <PostPagination
          pathname="/blog"
          page={options.page}
          query={options.query}
          hasNext={hasNext}
        />
      </div>
    </Section>
  );
}
