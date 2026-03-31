"use client";

import { useState } from "react";
import Link from "next/link";
import { PostSummary } from "@/lib/post";
import { Search } from "lucide-react";

type Props = {
  posts: PostSummary[];
};

export const BlogListClient = ({ posts }: Props) => {
  const [query, setQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const search = query.toLowerCase();

    return (
      post.title.toLowerCase().includes(search) ||
      post.description.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative group">
        <label htmlFor="search" className="sr-only">
          Search posts
        </label>

        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-foreground" />

        <input
          id="search"
          type="text"
          placeholder="Search posts by title, description, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm
          transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="p-4 border rounded-xl hover:bg-muted/50 transition">
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">
                {post.description}
              </p>

              <div className="flex gap-2 my-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs">
                {post.readingTime} mins to read, {post.date}
              </p>
            </div>
          </Link>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">No results found.</p>
        )}
      </div>
    </div>
  );
};
