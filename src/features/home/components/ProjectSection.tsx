import { ProjectSummary } from "@/features/projects/lib/project";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Section } from "@/components/shared/Section";
import { ProjectCarousel } from "./ProjectCarousel";
import { StaggerReveal } from "../animation/StaggerReveal";

export function ProjectSection({ projects }: { projects: ProjectSummary[] }) {
  return (
    <Section>
      <SectionHeader
        title="Latest Projects"
        action={
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            View all projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="sm:hidden">
        <ProjectCarousel projects={projects} />
      </div>

      <StaggerReveal className="hidden sm:grid sm:grid-cols-2 gap-8 [&>*:first-child]:sm:col-span-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant={index === 0 ? "featured" : "default"}
          />
        ))}
      </StaggerReveal>
    </Section>
  );
}
