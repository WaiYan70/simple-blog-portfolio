import { BaseCard } from "../shared/BaseCard";
import { ProjectSummary } from "@/lib/project";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { projectTechIcons } from "@/constants/project-tech-icons";

type Props = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: Props) {
  return (
    <BaseCard href={`/projects/${project.slug}`} className="overflow-hidden">
      <div className="space-y-4">
        {/* Image or preview Placeholder */}
        {project.image ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-40 w-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Terminal /> <span>Preview</span>
          </div>
        )}

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary">
            {project.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {project.description}
          </p>

          {project.techstack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techstack.slice(0, 6).map((techKey) => {
                const icon = projectTechIcons[techKey];

                return (
                  <span
                    key={techKey}
                    title={icon.title}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 fill-current"
                      aria-hidden="true"
                    >
                      <path d={icon.path} />
                    </svg>
                    <span>{icon.title}</span>
                  </span>
                );
              })}

              {project.techstack.length > 6 && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  +{project.techstack.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
