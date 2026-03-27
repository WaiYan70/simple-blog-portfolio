import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/MDXContent";
import { getAllPosts, getPostBySlug } from "@/lib/post";
import { ArrowLeft } from "lucide-react";

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
    <article>
      <div className="flex items-center mb-4">
        <span>
          <ArrowLeft size={16} />
        </span>
        <Link href="/blog" className="text-sm">
          Back to the Blog Page
        </Link>
      </div>

      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <MDXContent content={post.content} />
    </article>
  );
}
