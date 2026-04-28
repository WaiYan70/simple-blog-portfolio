import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Heading, Post } from "@/types/post";
import { slugifyHeading } from "@/features/blog/lib/heading";

const postDirectory = path.join(process.cwd(), "src/content/blog");

export type PostSummary = Omit<Post, "content">;

export const getAllPosts = async (): Promise<PostSummary[]> => {
  const files = fs
    .readdirSync(postDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const filePath = path.join(postDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = getSlugFromFile(file);
    const post = normalizePostFormatter(slug, data, content);

    return toSummary(post);
  });

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const filePath = path.join(postDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(fileContent);

  return normalizePostFormatter(slug, data, content);
};

// Core Normalization  (single truth of source)
const normalizePostFormatter = (
  slug: string,
  data: Record<string, unknown>,
  content: string,
): Post => {
  return {
    slug,
    title: getString(data.title),
    description: getString(data.description),
    date: getString(data.date),
    content,
    tags: getStringArray(data.tags),
    readingTime: calculateReadingTime(content),
    headings: extractHeadings(content),
  };
};

// Derived Transformation
const toSummary = (post: Post): PostSummary => {
  const { content: _content, ...summary } = post;
  return summary;
};

// Helpers
const getSlugFromFile = (file: string): string => {
  return path.parse(file).name;
};

const getString = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const getStringArray = (value: unknown): string[] => {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

const calculateReadingTime = (content: string): number => {
  if (!content.trim()) return 0;

  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 225);
};

const extractHeadings = (content: string) => {
  const regex = /^(#+)\s+(.*)/gm;

  const matches = content.matchAll(regex);

  const headings: Heading[] = [];

  for (const match of matches) {
    const level = match[1].length;
    const text = match[2];
    const slug = slugifyHeading(text);

    if (level >= 2) {
      headings.push({ level, text, slug });
    }
  }
  return headings;
};
