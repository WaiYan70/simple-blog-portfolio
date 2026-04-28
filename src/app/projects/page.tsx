import { getAllProjects } from "@/features/projects/lib/project";
import Link from "next/link";

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

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="rounded-2xl border border-border bg-card p-5 text-card-foreground transition-colors hover:bg-muted/40"
          >
            <h2 className="font-medium">{project.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
