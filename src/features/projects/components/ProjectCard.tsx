"use client";

import { BaseCard } from "@/components/shared/BaseCard";
import { ProjectSummary } from "@/lib/project";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { projectTechIcons } from "@/constants/project-tech-icons";
import { statusStyles } from "@/types/project";

type Props = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: Props) {
  return (
    <BaseCard
      href={`/projects/${project.slug}`}
      className="overflow-hidden p-0"
      radius="lg"
    >
      <div className="space-y-4">
        {/* Image or preview Placeholder */}
        {project.image ? (
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={project.image}
              alt={project.title}
              fill
              loading="eager"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Terminal /> <span>Preview</span>
          </div>
        )}

        {/* Content */}
        <div className="m-4 space-y-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.75 mb-2 text-xs font-medium ${
              statusStyles[project.status]
            }`}
          >
            {project.status === "in-progress" && "In Progress"}
            {project.status === "maintaining" && "Maintaining"}
            {project.status === "completed" && "Completed"}
          </span>
          <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary truncate">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-6 line-clamp-2">
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
