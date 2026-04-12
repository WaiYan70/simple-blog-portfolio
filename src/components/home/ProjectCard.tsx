import { BaseCard } from "../shared/BaseCard";
import { ProjectSummary } from "@/lib/project";

type Props = {
  project: ProjectSummary;
};

export const ProjectCard = ({ project }: Props) => {
  return (
    <BaseCard href={`/project/${project.slug}`}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </BaseCard>
  );
};
