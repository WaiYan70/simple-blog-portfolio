import type { ProjectTechIconKey } from "@/constants/project-tech-icons";

export type ProjectStatus = "in-progress" | "maintaining" | "completed";

export type Project = {
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  techstack: ProjectTechIconKey[];
  status: ProjectStatus;
};

export const statusStyles = {
  "in-progress": "bg-primary/10 text-primary",
  maintaining: "bg-yellow-500/10 text-yellow-600",
  completed: "bg-muted text-muted-foreground",
};
