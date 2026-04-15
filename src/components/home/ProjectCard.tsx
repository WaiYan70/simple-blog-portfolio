import { BaseCard } from "../shared/BaseCard";
import { ProjectSummary } from "@/lib/project";

type Props = {
  project: ProjectSummary;
};

export const ProjectCard = ({ project }: Props) => {
  return (
    <BaseCard href={`/project/${project.slug}`}>
      <h3 className="text-lg font-semibold tracking-tight tratransition group-hover:text-primary">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {project.description}
      </p>
    </BaseCard>
  );
};
