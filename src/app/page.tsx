import { FadeIn } from "@/features/home/animation/FadeIn";
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
      <FadeIn delay={200}>
        <Hero />
      </FadeIn>

      <FadeIn delay={400}>
        <ProjectSection projects={lastThreeProjects} />
      </FadeIn>

      <FadeIn delay={400}>
        <BlogSection posts={lastThreePosts} />
      </FadeIn>

      <FadeIn delay={400}>
        <Highlight />
      </FadeIn>

      <FadeIn delay={400}>
        <Skills />
      </FadeIn>

      <FadeIn delay={400}>
        <HowIThink />
      </FadeIn>

      <FadeIn delay={400}>
        <Journey />
      </FadeIn>

      <FadeIn delay={400}>
        <Contact />
      </FadeIn>
    </>
  );
}
