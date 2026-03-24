import { posts } from "@/content/testData";

export const getAllPosts = async () => {
  return posts;
};

export const getPostBySlug = async (slug: string) => {
  return posts.find((post) => post.slug === slug);
};
