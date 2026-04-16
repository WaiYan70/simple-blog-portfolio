import { BlogCard } from "@/components/home/BlogCard";
import { CurrentBuild } from "@/components/home/CurrentBuild";
import Hero from "@/components/home/Hero";
import { Highlight } from "@/components/home/HighLight";
import { HowIThink } from "@/components/home/HowIThink";
import { Journey } from "@/components/home/Journey";
import { ProjectCard } from "@/components/home/ProjectCard";
import { Skills } from "@/components/home/Skills";
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
      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest Project
        </h2>
        <div className="flex gap-4">
          {latestProject.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest Writing
        </h2>
        <div className="flex flex-col gap-4">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <Highlight />
      <Skills />
      <CurrentBuild />
      <HowIThink />
      <Journey />
    </>
  );
}
