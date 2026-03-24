import { getAllPosts } from "@/lib/post";
import Link from "next/link";

const BlogPage = async () => {
  const posts = await getAllPosts();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-4">List of Blog Posts</h1>
      <div className="flex flex-col items-center justify-center gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div>
              <h2 className="font-medium">{post.title}</h2>
              <p className="text-sm">{post.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
