import { getAllPosts } from "@/lib/post";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          <h2 className="font-medium">{post.title}</h2>
          <p className="text-sm">{post.description}</p>
          <p>{post.date}</p>
        </Link>
      ))}
    </div>
  );
}
