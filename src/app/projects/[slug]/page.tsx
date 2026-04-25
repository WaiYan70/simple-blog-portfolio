import { MDXContent } from "@/features/blog/components/MDXContent";
import { getAllProjects, getProjectBySlug } from "@/lib/project";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

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
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ viewTransitionName: `image-${project.slug}` }}
          />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
      </div>
      <MDXContent content={project.content} />
    </article>
  );
}
