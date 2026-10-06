import { notFound } from "next/navigation";
import { getAdminPostBySlug } from "@/features/admin/posts/queries";
import { updatePostAction } from "@/features/admin/posts/actions";
import { PostEditorForm } from "@/features/admin/posts/components/PostEditorForm";

type EditPageProps = {
  params: Promise<{ postId: string }>;
};

export default async function EditPostPage({ params }: EditPageProps) {
  const { postId: slug } = await params;
  const post = await getAdminPostBySlug(slug);

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
        recoveryKey={`post-editor:${post.id}`}
        recoveryVersion={post.version}
      />
    </main>
  );
}
