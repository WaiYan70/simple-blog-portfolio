import { Project } from "@/types/project";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

const projectDirectory = path.join(process.cwd(), "src/content/projects");

export type ProjectSummary = Omit<Project, "content">;

export const getAllProjects = async (): Promise<ProjectSummary[]> => {
  const files = fs.readdirSync(projectDirectory);

  return files.map((file) => {
    const filePath = path.join(projectDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug: file.replace(".mdx", ""),
      title: typeof data.title === "string" ? data.title : "",
      description: typeof data.description === "string" ? data.description : "",
      image: typeof data.image === "string" ? data.image : "",
    };
  });
};

export const getProjectBySlug = async (slug: string) => {
  const filePath = path.join(projectDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    image: typeof data.image === "string" ? data.image : "",
    content,
  };
};
