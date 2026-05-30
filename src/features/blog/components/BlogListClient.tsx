"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/features/blog/lib/post";
import { Search, X } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { Button } from "@/components/ui/button";

type Props = {
  posts: PostSummary[];
};

export function BlogListClient({ posts }: Props) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.description.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [normalizedQuery, posts]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="relative group">
          <label htmlFor="search" className="sr-only">
            Search posts
          </label>

          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-foreground" />

          <input
            id="search"
            type="search"
            placeholder="Search by title, description, or tag..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} posts
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No posts match your search.
            <Button
              type="button"
              variant="link"
              className="ml-1 h-auto p-0 text-sm"
              onClick={() => setQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
