import { Project } from "@/types/project";
import { BaseCard } from "../shared/BaseCard";

type Props = {
  project: Project;
};

export const ProjectCard = ({ project }: Props) => {
  return (
    <BaseCard href={`/project/${project.slug}`}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </BaseCard>
  );
};
