"use client";

import { useState } from "react";
import { PostSummary } from "@/lib/post";
import { Search } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { StaggerContainer } from "@/features/home/animation/StaggerContainer";

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
      <div className="relative group mb-4">
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
        <StaggerContainer>
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </StaggerContainer>

        {filteredPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">No results found.</p>
        )}
      </div>
    </div>
  );
}
