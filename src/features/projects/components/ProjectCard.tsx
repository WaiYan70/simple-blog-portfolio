import { BaseCard } from "@/components/shared/BaseCard";
import type { ProjectSummary } from "@/features/projects/lib/project";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { projectTechIcons } from "@/constants/project-tech-icons";
import { statusStyles } from "@/types/project";
import { cn } from "@/lib/utils";

type Props = {
  project: ProjectSummary;
  variant?: "default" | "featured";
};

export function ProjectCard({ project, variant = "default" }: Props) {
  const isFeatured = variant === "featured";

  return (
    <BaseCard
      href={`/projects/${project.slug}`}
      className="overflow-hidden"
      radius="xl"
      variant="outline"
    >
      <div
        className={cn(
          "space-y-4",
          isFeatured &&
            "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:space-y-0 ",
        )}
      >
        {/* Image or preview Placeholder */}
        {project.image ? (
          <div
            className={cn(
              "relative aspect-video w-full bg-muted",
              isFeatured && "sm:h-full sm:min-h-80 sm:aspect-auto",
            )}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              loading="eager"
              sizes={
                isFeatured
                  ? "(max-width: 640px) 100vw, 430px"
                  : "(max-width: 640px) 100vw, 50vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div
            className={cn(
              "aspect-video w-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground gap-2",
              isFeatured &&
                "sm:h-full sm:min-h-64 sm:aspect-auto sm:rounded-none",
            )}
          >
            <Terminal /> <span>Preview</span>
          </div>
        )}

        {/* Content */}
        <div className={cn("m-4 space-y-2", isFeatured && "sm:m-0 sm:p-6")}>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.75 mb-2 text-xs font-medium ${
              statusStyles[project.status]
            }`}
          >
            {project.status === "in-progress" && "In Progress"}
            {project.status === "maintaining" && "Maintaining"}
            {project.status === "completed" && "Completed"}
          </span>
          <h3
            className={cn(
              "font-semibold tracking-tight transition group-hover:text-primary",
              isFeatured ? "text-xl sm:text-2xl" : "text-lg truncate",
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "text-sm text-muted-foreground leading-6",
              isFeatured ? "line-clamp-3" : "line-clamp-2",
            )}
          >
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
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 p-1 text-xs text-primary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 fill-current"
                      aria-hidden="true"
                    >
                      <path d={icon.path} />
                    </svg>
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
