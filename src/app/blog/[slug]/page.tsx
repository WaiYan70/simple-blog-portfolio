import { getPostBySlug } from "@/lib/post";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const BlogDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl py-10">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground mt-2">{post.description}</p>

      <div className="mt-6">{post.content}</div>
    </article>
  );
};

export default BlogDetailPage;
