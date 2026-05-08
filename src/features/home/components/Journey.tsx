"use client";

import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion, useReducedMotion, type Variants } from "motion/react";

const journey = [
  {
    year: "2025",
    title: "Blog-based portfolio",
    description:
      "Crafting my blog-based portfolio using Next.js with Bun, managing and presenting content through MDX files.",
  },
  {
    year: "2024",
    title: "Building full-stack systems",
    description:
      "Developing a real-world e-commerce platform with authentication, admin tools, and scalable backend architecture.",
  },
  {
    year: "2023",
    title: "Freelance & independent projects",
    description:
      "Built multiple applications including a bookkeeping system, audio streaming app, and business websites.",
  },
  {
    year: "2022",
    title: "Backend engineering at MPT",
    description:
      "Worked on Spring Boot systems, database optimization, and API integrations in a production environment.",
  },
  {
    year: "Before",
    title: "Discovering software engineering",
    description:
      "Started from curiosity about building systems and gradually developed a focus on backend engineering and architecture.",
  },
];

const timelineListVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const timelineItemVariants: Variants = {
  initial: {},
  animate: {},
};

const getCardVariants = (isLeft: boolean): Variants => ({
  initial: {
    x: isLeft ? -28 : 28,
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const dotVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.16,
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Journey() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section>
      <SectionHeader
        title="Journey"
        description="A short timeline of my experience and how i got here"
      />

      {/* Timeline */}
      <div className="relative my-12">
        {/* Vertical line */}
        <div className="absolute top-7 left-4 sm:left-1/2 sm:-translate-x-1/2 h-[82%] w-0.5 bg-border" />

        <motion.div
          className="space-y-6"
          variants={shouldReduceMotion ? undefined : timelineListVariants}
          initial={shouldReduceMotion ? false : "initial"}
          whileInView={shouldReduceMotion ? undefined : "animate"}
          viewport={{ once: true, amount: 0.2 }}
        >
          {journey.map((item, index) => {
            const isLeft = index % 2 === 0;
            const cardVariants = shouldReduceMotion
              ? undefined
              : getCardVariants(isLeft);

            return (
              <motion.div
                key={item.title}
                className="relative flex items-start"
                variants={timelineItemVariants}
              >
                {/* LEFT (desktop only) */}
                <div className="hidden w-1/2 sm:block sm:pr-8 sm:text-right">
                  {isLeft && (
                    <motion.div
                      variants={cardVariants}
                      className="inline-block rounded-xl border border-border bg-card p-5 transition hover:bg-muted/40"
                    >
                      <h3 className="font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.year}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* DOT */}
                <motion.div
                  className="absolute top-7 left-2.75 sm:left-1/2 sm:-translate-x-1/2"
                  variants={shouldReduceMotion ? undefined : dotVariants}
                >
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </motion.div>

                {/* RIGHT (mobile + desktop) */}
                <div className="w-full pl-10 sm:w-1/2 sm:pl-8">
                  {/* Desktop right */}
                  {!isLeft && (
                    <motion.div
                      variants={cardVariants}
                      className="hidden sm:block rounded-xl border border-border bg-card p-5 transition hover:bg-muted/40"
                    >
                      <h3 className="font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.year}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {item.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Mobile (always right side) */}
                  <div className="sm:hidden">
                    <motion.div
                      variants={
                        shouldReduceMotion ? undefined : getCardVariants(false)
                      }
                      className="rounded-xl border border-border bg-card p-5 transition hover:bg-muted/40"
                    >
                      <h3 className="font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.year}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
