import { BlogCard } from "@/components/home/BlogCard";
import Hero from "@/components/home/Hero";
import { ProjectCard } from "@/components/home/ProjectCard";
import { getAllPosts } from "@/lib/post";
import { getAllProjects } from "@/lib/project";

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 3);

  const projects = await getAllProjects();
  const latestProject = projects.slice(0, 3);

  return (
    <>
      <Hero />
      <section>
        <h2>Latest Writing</h2>
        <div>
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <section>
        <h2>Latest Project</h2>
        <div>
          {latestProject.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
