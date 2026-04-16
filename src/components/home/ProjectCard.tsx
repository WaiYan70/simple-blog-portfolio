import { BaseCard } from "../shared/BaseCard";
import { ProjectSummary } from "@/lib/project";
import Image from "next/image";
import { Terminal } from "lucide-react";

type Props = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: Props) {
  return (
    <BaseCard href={`/project/${project.slug}`} className="overflow-hidden">
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
        </div>
      </div>
    </BaseCard>
  );
}
