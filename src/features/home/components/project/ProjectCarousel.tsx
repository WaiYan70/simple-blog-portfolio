"use client";

import { ProjectCard } from "@/features/projects/components/ProjectCard";
import type { ProjectSummary } from "@/features/projects/lib/project";
import { motion, PanInfo } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectCarouselProps = {
  projects: ProjectSummary[];
};

const swipeConfidenceThreshold = 6000;

const getSwipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

const getWrappedIndex = (index: number, total: number) =>
  (index + total) % total;

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleProjects = projects.length > 1;

  if (projects.length === 0) {
    return null;
  }

  const gotoProject = (index: number) => {
    setActiveIndex(getWrappedIndex(index, projects.length));
  };

  const gotoPreviousProject = () => {
    setActiveIndex((currentIndex) =>
      getWrappedIndex(currentIndex - 1, projects.length),
    );
  };

  const gotoNextProject = () => {
    setActiveIndex((currentIndex) =>
      getWrappedIndex(currentIndex + 1, projects.length),
    );
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipe = getSwipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      gotoNextProject();
      return;
    }

    if (swipe > swipeConfidenceThreshold) {
      gotoPreviousProject();
    }
  };

  return (
    <div className="space-y-2">
      <div className="overflow-hidden">
        <motion.div
          drag={hasMultipleProjects ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          animate={{ x: `${activeIndex * -100}%` }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {projects.map((project) => (
            <div key={project.slug} className="min-w-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>

      {hasMultipleProjects && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                aria-label={`Show project ${index + 1}`}
                aria-current={activeIndex === index}
                onClick={() => gotoProject(index)}
                className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="show previous project"
              onClick={gotoPreviousProject}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="show next project"
              onClick={gotoNextProject}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
