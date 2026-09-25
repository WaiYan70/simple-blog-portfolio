import { findAdminPostBySlug } from "@/db/repositories/post-repository";
import { updatePostAction } from "@/features/admin/posts/actions";
import { PostEditorForm } from "@/features/admin/posts/components/PostEditorForm";
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
        <h1 className="mx-2 font-semibold text-xl">
          Edit Post Page - {post.slug} | Version - {post.version}
        </h1>
      </header>
      <PostEditorForm
        key={`${post.id}:${post.version}`}
        mode="edit"
        action={action}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          description: post.description,
          date: post.date,
          tags: post.tags,
          content: post.content,
          status: post.status,
        }}
      />
    </main>
  );
}
