import { ProjectSummary } from "@/lib/project";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { Section } from "../shared/Section";

export function ProjectSection({ projects }: { projects: ProjectSummary[] }) {
  return (
    <Section>
      <SectionHeader
        title="Latest Projects"
        action={
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            View all projects
            <ArrowRight className="h-3.5 w-3.5 transitiontransition-transform group-hover:translate-x-0.5" />
          </Link>
        }
        className="flex flex-col sm:gap-2 sm:flex-row sm:items-center sm:justify-between"
      />
      <div className="flex sm:flex-row flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
