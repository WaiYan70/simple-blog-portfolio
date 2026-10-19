export type Heading = {
  text: string;
  slug: string;
  level: number;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
  readingTime: number;
  headings: Heading[];
};

export type PostSummary = Omit<Post, "content" | "headings">;

export type AdminPostListItem = Pick<Post, "slug" | "title" | "date"> & {
  id: string;
  status: "draft" | "published";
};

export type PostListOptions = {
  page: number;
  pageSize: number;
  query: string;
};

export type PostPageResult<T> = {
  posts: T[];
  hasNext: boolean;
}
