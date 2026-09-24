import { findAdminPostBySlug } from "@/db/repositories/post-repository";
import { updatePostAction } from "@/features/admin/posts/actions";
import { PostEditorForm } from "@/features/admin/posts/components/PostEditorForm";
import { getPostBySlug } from "@/features/blog/lib/post";
import { requireAdmin } from "@/lib/auth/require-admin";
import { notFound } from "next/navigation";

type EditPageProps = {
  params: Promise<{ postId: string }>;
};

export default async function EditPostPage({ params }: EditPageProps) {
  await requireAdmin();

  const { postId } = await params;
  const post = await findAdminPostBySlug(postId);
  if (!post) {
    notFound();
  }

  const action = updatePostAction.bind(null, post.id, post.slug, post.version);

  return (
    <main>
      <header>
        <h1>Edit Post Page - {post.slug}</h1>
        <p>Update the meta and articel content.</p>
      </header>
      <PostEditorForm
        key={post.slug}
        mode="edit"
        action={action}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          description: post.description,
          date: post.date,
          tags: post.tags,
          content: post.content,
          status: post.status
        }}
      />
    </main>
  );
}
