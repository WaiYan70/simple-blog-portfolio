import { getAdminPostBySlug } from "@/features/admin/posts/queries";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { postId: slug } = await params;
  const post = await getAdminPostBySlug(slug);

  if (!post) {
    notFound();
  }

  redirect(`/admin/posts/${post.slug}/edit`);
}
