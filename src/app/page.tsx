import { Bento } from "@/features/home/components/Bento";
import { BlogSection } from "@/features/home/components/BlogSection";
import { ProjectSection } from "@/features/home/components/ProjectSection";
import { Skills } from "@/features/home/components/Skills";
import { EngineeringFocus } from "@/features/home/components/EngineeringFocus";
import { Journey } from "@/features/home/components/Journey";
import { ContactMe } from "@/features/home/components/ContactMe";

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
