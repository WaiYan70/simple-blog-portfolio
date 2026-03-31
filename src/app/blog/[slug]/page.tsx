import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/MDXContent";
import { getAllPosts, getPostBySlug } from "@/lib/post";
import { ArrowLeft } from "lucide-react";
import { TableOfContents } from "@/components/blog/TableOfContent";

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
    <div className="mx-auto flex max-w-5xl gap-10 px-4 py-2">
      <article className="flex-1 max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <span aria-hidden="true">
            <ArrowLeft size={16} />
          </span>
          <Link
            href="/blog"
            className="text-sm transition hover:text-foreground"
          >
            Back to the Blog Page
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {post.description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <MDXContent content={post.content} />
      </article>

      <aside className="sticky top-20 hidden h-fit w-60 rounded-2xl border border-border bg-card p-4 text-left text-card-foreground lg:block">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          On this page
        </h3>
        <TableOfContents headings={post.headings} />
      </aside>
    </div>
  );
}
