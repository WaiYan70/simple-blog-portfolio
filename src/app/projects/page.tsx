import { getAllProjects } from "@/lib/project";
import Link from "next/link";

export default async function ProjectPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`}>
          <h2 className="font-medium">{project.title}</h2>
          <p className="text-sm">{project.description}</p>
        </Link>
      ))}
    </div>
  );
}
