import "server-only";

import path from "node:path";
import type { CreatePostData } from "../schema/post-schema";
import matter from "gray-matter";
import { writeFile } from "node:fs/promises";

const postDirectory = path.resolve(process.cwd(), "src/content/blog");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class PostFileAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`A post with the slug "${slug}" already exists.`);
    this.name = "PostFileAlreadyExistsError";
  }
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && "code" in error;
};

export const createPostFile = async (post: CreatePostData): Promise<void> => {
  if (!slugPattern.test(post.slug)) {
    throw new Error("invalid post slug");
  }

  const filePath = path.resolve(postDirectory, `${post.slug}.mdx`);

  if (path.dirname(filePath) !== postDirectory) {
    throw new Error("Post file path is outside the content directory");
  }

  const frontmatter = {
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
  };

  const content = `${post.content.trimEnd()}\n`;

  const serializedPost = matter.stringify(content, frontmatter);

  try {
    await writeFile(filePath, serializedPost, {
      encoding: "utf-8",
      flag: "wx",
    });
  } catch (error) {
    if (isNodeError(error) && error.code === "EEXIST") {
      throw new PostFileAlreadyExistsError(post.slug);
    }
    throw error;
  }
}
