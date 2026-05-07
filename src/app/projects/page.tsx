import { StaggerReveal } from "@/features/home/animation/StaggerReveal";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { getAllProjects } from "@/features/projects/lib/project";

export default async function ProjectPage() {
  const projects = await getAllProjects();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Selected Work
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          A focused collection of product and engineering work, with decisions,
          constraints, and implementation details.
        </p>
      </div>

      <StaggerReveal className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </StaggerReveal>
    </section>
  );
}
