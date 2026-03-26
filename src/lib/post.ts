import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postDirectory = path.join(process.cwd(), "src/content/blog");

export const getAllPosts = async () => {
  const files = fs.readdirSync(postDirectory);

  return files.map((file) => {
    const filePath = path.join(postDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug: file.replace(".mdx", ""),
      title: data.title,
      description: data.description,
      date: data.date,
    };
  });
};

export const getPostBySlug = async (slug: string) => {
  const filePath = path.join(postDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    content,
  };
};
