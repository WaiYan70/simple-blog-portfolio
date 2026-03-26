import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/MDXContent";
import { getAllPosts, getPostBySlug } from "@/lib/post";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

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
};

const BlogDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl py-10">
      <div className="flex items-center mb-4">
        <span>
          <ArrowLeft size={16} />
        </span>
        <Link href="/blog" className="text-sm">
          Back to the Blog Page
        </Link>
      </div>

      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2">{post.description}</p>
      <MDXContent content={post.content} />
    </article>
  );
};

export default BlogDetailPage;
