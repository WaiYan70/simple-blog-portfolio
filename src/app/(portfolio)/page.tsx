import { Bento } from "@/features/home/sections/Bento";
import { BlogSection } from "@/features/home/sections/BlogSection";
import { ProjectSection } from "@/features/home/sections/ProjectSection";
import { Skills } from "@/features/home/sections/Skills";
import { EngineeringFocus } from "@/features/home/sections/EngineeringFocus";
import { Journey } from "@/features/home/sections/Journey";
import { ContactMe } from "@/features/home/sections/ContactMe";

import { getAllPosts } from "@/features/blog/lib/post";
import { getAllProjects } from "@/features/projects/lib/project";

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
