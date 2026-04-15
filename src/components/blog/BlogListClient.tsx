"use client";

import { useState } from "react";
import Link from "next/link";
import { PostSummary } from "@/lib/post";
import { Search } from "lucide-react";

type Props = {
  posts: PostSummary[];
};

export function BlogListClient({ posts }: Props) {
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
      <div className="relative group mb-2">
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
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-border bg-card p-5 transition hover:bg-muted/40 hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {post.description}
            </p>

            <div className="my-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {post.readingTime} min read · {post.date}
            </p>
          </Link>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">No results found.</p>
        )}
      </div>
    </div>
  );
}
