import { BlogSection } from "@/components/home/BlogSection";
import { Contact } from "@/components/home/ContactMe";
import Hero from "@/components/home/Hero";
import { Highlight } from "@/components/home/HighLight";
import { HowIThink } from "@/components/home/HowIThink";
import { Journey } from "@/components/home/Journey";
import { ProjectSection } from "@/components/home/ProjectSection";
import { Skills } from "@/components/home/Skills";
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
