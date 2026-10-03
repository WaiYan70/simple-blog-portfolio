import Link from "next/link";
import { Button } from "../ui/button";

type SearchProps = {
  pathname: string;
  query: string;
};

export function PostSearch({ pathname, query }: SearchProps) {
  return (
    <form>
      <div>
        <label>Search Posts</label>
        <input
          key={query}
          id="post-search"
          name="q"
          type="search"
          defaultValue={query}
          maxLength={100}
          placeholder="Search by title, description, or tag..."
          className="h-11 w-full rounder"
        />
      </div>
      <Button type="submit">Search</Button>
      {query && (
        <Link
          href={pathname}
          className="inline-flex h-11 items-center text-sm underline"
        >
          Clear Search
        </Link>
      )}
    </form>
  );
}
