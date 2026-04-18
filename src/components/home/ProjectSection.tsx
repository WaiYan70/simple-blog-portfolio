import { ProjectSummary } from "@/lib/project";
import { ProjectCard } from "./ProjectCard";

export function ProjectSection({ projects }: { projects: ProjectSummary[] }) {
  return (
    <section className="my-12 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Latest Projects</h2>
      <div className="flex sm:flex-row flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
