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
