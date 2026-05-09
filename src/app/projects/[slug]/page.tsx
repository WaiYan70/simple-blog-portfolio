import { MDXContent } from "@/features/blog/components/MDXContent";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/features/projects/lib/project";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { projectTechIcons } from "@/constants/project-tech-icons";

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
      url: `https://www.khantwaiyan11@gmail.com/projects/${slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  return (
    <article className="space-y-4">
      <div className="rounded-lg border border-border bg-card  text-card-foreground">
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
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
        {project.techstack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {project.techstack.map((tech) => {
              const icon = projectTechIcons[tech];
              return (
                <span
                  key={tech}
                  title={icon.title}
                  className="flex items-center gap-1.5 bg-primary/10 rounded-full p-1 text-primary text-xs"
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
          </div>
        )}
      </div>

      <MDXContent content={project.content} />
    </article>
  );
}
