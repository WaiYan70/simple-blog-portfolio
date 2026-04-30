import { Project, ProjectStatus } from "@/types/project";
import {
  isProjectTechIconKey,
  type ProjectTechIconKey,
} from "@/constants/project-tech-icons";
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

    const { data, content } = matter(fileContent);

    const slug = getSlugFromFile(file);

    const project = normalizeProjectFormatter(slug, data, content);

    return toSummary(project);
  });
};

export const getProjectBySlug = async (slug: string) => {
  const filePath = path.join(projectDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(fileContent);

  return normalizeProjectFormatter(slug, data, content);
};

// Core Normalization (single truth of source)
const normalizeProjectFormatter = (
  slug: string,
  data: Record<string, unknown>,
  content: string,
) => {
  return {
    slug,
    title: getString(data.title),
    description: getString(data.description),
    image: getString(data.image),
    techstack: normalizeTechStack(data.techStack),
    status: normalizeProjectStatus(data.status),
    content,
  };
};

// Derived Transformation
const toSummary = (project: Project): ProjectSummary => {
  const { content: _content, ...summary } = project;
  return summary;
};

// Helpers
const getSlugFromFile = (file: string): string => {
  return path.parse(file).name;
};

const getString = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const normalizeTechStack = (value: unknown): ProjectTechIconKey[] => {
  if (!Array.isArray(value)) return [];

  const techStack = value.filter(
    (item): item is ProjectTechIconKey =>
      typeof item === "string" && isProjectTechIconKey(item),
  );

  return [...new Set(techStack)];
};

const normalizeProjectStatus = (value: unknown): ProjectStatus => {
  if (
    value === "in-progress" ||
    value === "maintaining" ||
    value === "completed"
  ) {
    return value;
  }
  return "in-progress";
};
