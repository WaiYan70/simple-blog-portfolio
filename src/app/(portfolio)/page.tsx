import { Bento } from "@/features/portfolio/home/sections/Bento";
import { BlogSection } from "@/features/portfolio/home/sections/BlogSection";
import { ProjectSection } from "@/features/portfolio/home/sections/ProjectSection";
import { Skills } from "@/features/portfolio/home/sections/Skills";
import { EngineeringFocus } from "@/features/portfolio/home/sections/EngineeringFocus";
import { Journey } from "@/features/portfolio/home/sections/Journey";
import { ContactMe } from "@/features/portfolio/home/sections/ContactMe";

import { getAllPosts } from "@/features/portfolio/blog/lib/post";
import { getAllProjects } from "@/features/portfolio/projects/lib/project";

export default async function Home() {
  const posts = await getAllPosts();
  const lastThreePosts = posts.slice(0, 3);
  const projects = await getAllProjects();
  const lastThreeProjects = projects.slice(0, 3);

  return (
    <>
      <Bento />
      <ProjectSection projects={lastThreeProjects} />
      <BlogSection posts={lastThreePosts} />
      <EngineeringFocus />
      <Skills />
      <Journey />
      <ContactMe />
    </>
  );
}
