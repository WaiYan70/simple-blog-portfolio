import "server-only";

import path from "node:path";
import type { CreatePostData } from "../schema/post-schema";
import matter from "gray-matter";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const postDirectory = path.resolve(process.cwd(), "src/content/blog");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Handling Error
export class PostFileAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`A post with the slug "${slug}" already exists.`);
    this.name = "PostFileAlreadyExistsError";
  }
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && "code" in error;
};

// Create Post
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

// Update Post File (Edit Mode)
// Handling Error
export class PostFileNotFoundError extends Error {
  constructor() {
    super("This post no longer exists.");
    this.name = "PostFileNotFoundError";
  }
}

// Update Post
export async function updatePostFile(post: CreatePostData): Promise<void> {
  if (!slugPattern.test(post.slug)) {
    throw new Error("Invalid post slug");
  }

  const filePath = path.resolve(postDirectory, `${post.slug}.mdx`);

  if (path.dirname(filePath) !== postDirectory) {
    throw new Error("post file path is outside the content directory");
  }

  let existingSource: string;

  try {
    existingSource = await readFile(filePath, "utf-8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new PostFileNotFoundError();
    }
    throw error;
  }

  const { data: existingMetadata } = matter(existingSource);

  const serializedPost = matter.stringify(`${post.content.trimEnd()}\n`, {
    ...existingMetadata,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
  });

  const temporaryPath = path.join(
    postDirectory,
    `.${post.slug}.${randomUUID()}.tmp`,
  );

  try {
    await writeFile(temporaryPath, serializedPost, {
      encoding: "utf-8",
      flag: "wx",
    });
    await rename(temporaryPath, filePath);
  } finally {
    await unlink(temporaryPath).catch((error: unknown) => {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        throw error;
      }
    });
  }
}
