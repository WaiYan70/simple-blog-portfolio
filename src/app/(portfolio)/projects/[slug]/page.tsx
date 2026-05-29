import { MDXContent } from "@/features/blog/components/MDXContent";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/features/projects/lib/project";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Terminal } from "lucide-react";
import { projectTechIcons } from "@/constants/project-tech-icons";
import { statusStyles, type ProjectStatus } from "@/types/project";

const projectStatusLabels: Record<ProjectStatus, string> = {
  "in-progress": "In Progress",
  maintaining: "Maintaining",
  completed: "Completed",
};

export type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://www.khantwaiyan.cloud/projects/${slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  return (
    <article className="space-y-8 mt-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <header className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
        {project.image ? (
          <div className="relative aspect-video w-full border-b border-border bg-muted">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center gap-2 border-b border-border bg-muted text-sm text-muted-foreground">
            <Terminal className="h-5 w-5" />
            <span>Preview unavailable</span>
          </div>
        )}

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[project.status]
              }`}
            >
              {projectStatusLabels[project.status]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Case Study
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {project.description}
            </p>
          </div>

          {project.techstack.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techstack.map((tech) => {
                  const icon = projectTechIcons[tech];

                  return (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 fill-current"
                        aria-hidden="true"
                      >
                        <path d={icon.path} />
                      </svg>
                      {icon.title}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <MDXContent content={project.content} />
    </article>
  );
}
