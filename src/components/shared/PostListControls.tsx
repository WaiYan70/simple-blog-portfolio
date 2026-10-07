import Link from "next/link";
import { Button } from "../ui/button";

type SearchProps = {
  pathname: string;
  query: string;
};

export function PostSearch({ pathname, query }: SearchProps) {
  return (
    <form action={pathname} method="get">
      <div>
        <label htmlFor="post-search">Search Posts</label>
        <input
          key={query}
          id="post-search"
          name="q"
          type="search"
          defaultValue={query}
          maxLength={100}
          placeholder="Search by title, description, or tag..."
          className="h-11 w-full rounder-xl border border-border bg-background px-3 text-sm"
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

type PaginationProps = {
  pathname: string;
  page: number;
  query: string;
  hasNext: boolean;
};

export function PostPagination({
  pathname,
  page,
  query,
  hasNext,
}: PaginationProps) {
  const createPageHref = (targetPage: number): string => {
    const params = new URLSearchParams();

    params.set("page", String(targetPage));

    if (query) {
      params.set("q", query);
    }

    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav>
      {page > 1 ? (
        <Link
          href={createPageHref(page - 1)}
          rel="previous"
          className="text-sm underline"
        >
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span aria-current="page" className="text-sm text-muted-foreground">
        Page {page}
      </span>
      {hasNext && page < 10_000 ? (
        <Link
          href={createPageHref(page + 1)}
          rel="next"
          className="text-sm underline"
        >
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
