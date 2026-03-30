import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Heading, Post } from "@/types/post";

const postDirectory = path.join(process.cwd(), "src/content/blog");

export type PostSummary = Omit<Post, "content">;

export const getAllPosts = async (): Promise<PostSummary[]> => {
  const files = fs.readdirSync(postDirectory);

  const posts = files.map((file) => {
    const filePath = path.join(postDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const readingTime = calculateReadingTime(content);
    const headings = extractHeaders(content);

    return {
      slug: file.replace(".mdx", ""),
      title: typeof data.title === "string" ? data.title : "",
      description: typeof data.description === "string" ? data.description : "",
      date: typeof data.date === "string" ? data.date : "",
      readingTime: readingTime,
      headings: headings,
    };
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

  const readingTime = calculateReadingTime(content);

  const headings = extractHeaders(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "",
    content,
    readingTime: readingTime,
    headings: headings,
  };
};

const calculateReadingTime = (content: string): number => {
  if (!content.trim()) return 0;

  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 225);
};

const extractHeaders = (content: string) => {
  const regex = /^(#+)\s+(.*)/gm;

  const matches = content.matchAll(regex);

  const headings: Heading[] = [];

  for (const match of matches) {
    const level = match[1].length;
    const text = match[2];
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    if (level >= 2) {
      headings.push({ level, text, slug });
    }
  }
  return headings;
};
