import { BlogSection } from "@/features/home/components/BlogSection";
import { Contact } from "@/features/home/components/ContactMe";
import Hero from "@/features/home/components/Hero";
import { Highlight } from "@/features/home/components/HighLight";
import { HowIThink } from "@/features/home/components/HowIThink";
import { Journey } from "@/features/home/components/Journey";
import { ProjectSection } from "@/features/home/components/ProjectSection";
import { Skills } from "@/features/home/components/Skills";
import { getAllPosts } from "@/lib/post";
import { getAllProjects } from "@/lib/project";

export default async function Home() {
  const posts = await getAllPosts();
  const lastThreePosts = posts.slice(0, 3);
  const projects = await getAllProjects();
  const lastThreeProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />
      <ProjectSection projects={lastThreeProjects} />
      <BlogSection posts={lastThreePosts} />
      <Highlight />
      <Skills />
      <HowIThink />
      <Journey />
      <Contact />
    </>
  );
}
