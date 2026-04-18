import { ProjectSummary } from "@/lib/project";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProjectSection({ projects }: { projects: ProjectSummary[] }) {
  return (
    <section className="my-12 space-y-6">
      <div className="flex flex-col sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest Projects
        </h2>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          View all projects
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="flex sm:flex-row flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
