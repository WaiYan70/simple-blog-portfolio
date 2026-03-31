import { BlogListClient } from "@/components/blog/BlogListClient";
import { getAllPosts } from "@/lib/post";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">List of Blog</h1>
      <BlogListClient posts={posts} />
    </div>
  );
}
