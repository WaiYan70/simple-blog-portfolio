import type { ProjectTechIconKey } from "@/constants/project-tech-icons";

export type Project = {
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  techstack: ProjectTechIconKey[];
};
