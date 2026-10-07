import { Bento } from "@/features/portfolio/home/sections/Bento";
import { BlogSection } from "@/features/portfolio/home/sections/BlogSection";
import { ProjectSection } from "@/features/portfolio/home/sections/ProjectSection";
import { Skills } from "@/features/portfolio/home/sections/Skills";
import { EngineeringFocus } from "@/features/portfolio/home/sections/EngineeringFocus";
import { Journey } from "@/features/portfolio/home/sections/Journey";
import { ContactMe } from "@/features/portfolio/home/sections/ContactMe";

import { getPublishedPostPage } from "@/features/portfolio/blog/lib/post";
import { getAllProjects } from "@/features/portfolio/projects/lib/project";

export default async function Home() {
  const [{ posts: lastThreePosts }] = await Promise.all([
    getPublishedPostPage({ pageSize: 3 }),
  ]);

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
