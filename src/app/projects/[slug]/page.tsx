import { MDXContent } from "@/components/blog/MDXContent";
import { getAllProjects, getProjectBySlug } from "@/lib/project";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <article>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <MDXContent content={project.content} />
    </article>
  );
}
