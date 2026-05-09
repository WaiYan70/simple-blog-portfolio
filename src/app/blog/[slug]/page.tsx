import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/features/blog/components/MDXContent";
import { getAllPosts, getPostBySlug } from "@/features/blog/lib/post";
import { TableOfContents } from "@/features/blog/components/TableOfContent";
import { ArrowLeft, Clock } from "lucide-react";
import { ScrollProgress } from "@/features/blog/components/ScrollProgress";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.khantwaiyan.cloud/blog/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <div className="mx-auto flex max-w-5xl gap-10 py-2">
      <ScrollProgress />
      <article className="flex-1 max-w-5xl overflow-hidden">
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <span aria-hidden="true">
            <ArrowLeft size={16} />
          </span>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition hover:text-primary"
          >
            Back to the Blog Page
          </Link>
        </div>

        <header className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <MDXContent content={post.content} />
      </article>

      <aside className="lg:block sticky top-20 hidden h-fit w-60 rounded-2xl border border-border bg-card p-4 text-left text-card-foreground">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          On this page
        </h3>
        <TableOfContents headings={post.headings} />
      </aside>
    </div>
  );
}
