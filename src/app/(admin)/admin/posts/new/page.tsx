import { PostEditorForm } from "@/features/admin/posts/components/PostEditorForm";

export default function CreateNewPostPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">New Post</h1>
        <p className="text-sm text-muted-foreground">
          Create a new Markdown blog post.
        </p>
      </header>
      <PostEditorForm mode="create" />
    </main>
  );
}
