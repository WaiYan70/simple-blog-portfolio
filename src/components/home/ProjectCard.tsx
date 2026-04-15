import { BaseCard } from "../shared/BaseCard";
import { ProjectSummary } from "@/lib/project";
import Image from "next/image";
import { Terminal } from "lucide-react";

type Props = {
  project: ProjectSummary;
};

export const ProjectCard = ({ project }: Props) => {
  return (
    <BaseCard href={`/project/${project.slug}`}>
      <div className="space-y-4">
        {project.image ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-40 w-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground space-x-2">
            <Terminal /> <span>Preview</span>
          </div>
        )}

        {/* Image */}
        {/*<div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        </div>*/}

        {/* Preview */}
        {/*<div className="h-40 w-full rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground space-x-2">
          <Terminal /> <span>Preview</span>
        </div>*/}

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
};
