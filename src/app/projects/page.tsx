import { getAllProjects } from "@/lib/project";
import Link from "next/link";

export default async function ProjectPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`}>
          <div className="font-medium">{project.title}</div>
          <div className="text-sm">{project.description}</div>
        </Link>
      ))}
    </div>
  );
}
