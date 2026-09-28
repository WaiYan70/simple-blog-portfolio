import { findAdminPostBySlug } from "@/db/repositories/post-repository";
import { requireAdmin } from "@/lib/auth/require-admin";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  await requireAdmin();

  const { postId } = await params;
  const post = await findAdminPostBySlug(postId);

  if (!post) {
    notFound();
  }

  redirect(`/admin/posts/${post.slug}/edit`);
}
