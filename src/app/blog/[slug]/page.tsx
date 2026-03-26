import type { Metadata } from "next";
import { MDXContent } from "@/components/blog/MDXContent";
import { getAllPosts, getPostBySlug } from "@/lib/post";
import { notFound } from "next/navigation";

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
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2">{post.description}</p>
      <MDXContent content={post.content} />
    </article>
  );
};

export default BlogDetailPage;
