"use client";

import { useEffect, useRef } from "react";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";

type JourneyItem = {
  period: string;
  title: string;
  context: string;
  stack: string;
  description: string;
  highlights: string[];
};

const journey: JourneyItem[] = [
  {
    period: "July 2025 - Present",
    title: "Freelance Software Engineer",
    context: "E-commerce platform with admin dashboard",
    stack: "MERN Stack, TypeScript, Redis",
    description:
      "Building a production-focused commerce system with customer flows, admin operations, payment review, automation, and deployment ownership.",
    highlights: [
      "Built commerce workflows for inventory, order administration, delivery fee calculation, and product classification.",
      "Implemented QR-based manual payment verification with proof uploads, admin review, resubmission requests, refunds, and cancellations.",
      "Delivered secure auth with HttpOnly JWT cookies, refresh token rotation, Google OAuth, RBAC, Brevo email verification, and password reset flows.",
      "Added SSE exchange-rate updates, product scraping for 100+ items from 3 brands, Cloudinary media storage, backend protections, and VPS deployment.",
    ],
  },
  {
    period: "August 2024 - Present",
    title: "Freelance Software Engineer",
    context: "Fleet management and expense tracking system",
    stack: "MERN Stack, TypeScript",
    description:
      "Developing an internal operations system for a taxi service business managing around 20 vehicles.",
    highlights: [
      "Centralized driver records, vehicle tracking, expense management, license expiration notifications, and repair scheduling.",
      "Implemented authentication and role-based authorization for owner-only financial and operations modules.",
      "Built responsive dashboards and reports to improve financial visibility and daily fleet management workflows.",
    ],
  },
  {
    period: "April 2023 - August 2023",
    title: "Freelance Web Developer",
    context: "Websites for local computer shops",
    stack: "Next.js, TypeScript",
    description:
      "Designed, developed, and deployed responsive business websites for 2 local computer shops in Myanmar.",
    highlights: [
      "Translated business requirements into clear frontend experiences for local customers.",
      "Improved online visibility and accessibility with responsive layouts and practical content structure.",
    ],
  },
  {
    period: "September 2022 - February 2023",
    title: "Junior Software Engineer",
    context: "MPT (Myanmar Posts and Telecommunications)",
    stack: "Spring Boot, Oracle SQL",
    description:
      "Worked on internal financial tracking features and backend integrations in a production engineering environment.",
    highlights: [
      "Developed Spring Boot API features that helped streamline financial data workflows and reduce manual reporting time by 30%.",
      "Optimized Oracle SQL queries, improving data retrieval performance by 25% and supporting more accurate financial reporting.",
      "Collaborated on backend testing, debugging, API integration, and issue resolution to improve application stability.",
    ],
  },
  {
    period: "Before",
    title: "Discovering software engineering",
    context: "University",
    stack: "HTML, CSS, JavaScript, Java, Python, C#",
    description:
      "Worked on internal financial tracking features and backend integrations in a production engineering environment.",
    highlights: [
      "Developed Spring Boot API features that helped streamline financial data workflows and reduce manual reporting time by 30%.",
      "Optimized Oracle SQL queries, improving data retrieval performance by 25% and supporting more accurate financial reporting.",
      "Collaborated on backend testing, debugging, API integration, and issue resolution to improve application stability.",
    ],
  },
];

const getCardVariants = (isLeft: boolean): Variants => ({
  initial: {
    x: isLeft ? -96 : 96,
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.78,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const textVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12,
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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

const JourneyCardContent = ({ item }: { item: JourneyItem }) => (
  <motion.div variants={textVariants}>
    <h3 className="font-semibold tracking-tight">{item.title}</h3>
    <p className="mt-1 text-sm font-medium text-foreground/80">
      {item.context}
    </p>

    <div className="mt-3 flex flex-wrap gap-2">
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
        {item.period}
      </span>
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
        {item.stack}
      </span>
    </div>

    <p className="mt-4 text-sm leading-6 text-muted-foreground">
      {item.description}
    </p>

    <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
      {item.highlights.map((highlight) => (
        <li key={highlight} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export function Journey() {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineProgress = useMotionValue(0);
  const timelineScaleY = useSpring(timelineProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      timelineProgress.set(1);
      return;
    }

    const updateTimelineProgress = () => {
      const timeline = timelineRef.current;

      if (!timeline) return;

      const rect = timeline.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const progress = (viewportCenter - rect.top) / rect.height;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      timelineProgress.set(clampedProgress);
    };

    updateTimelineProgress();
    window.addEventListener("scroll", updateTimelineProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateTimelineProgress);

    return () => {
      window.removeEventListener("scroll", updateTimelineProgress);
      window.removeEventListener("resize", updateTimelineProgress);
    };
  }, [shouldReduceMotion, timelineProgress]);

  return (
    <Section>
      <SectionHeader
        title="Journey"
        description="A short timeline of my experience and how I got here"
      />

      <div ref={timelineRef} className="relative my-12">
        <div className="absolute bottom-7 left-4 top-7 w-0.5 overflow-hidden bg-border sm:left-1/2 sm:-translate-x-1/2">
          <motion.div
            className="h-full w-full origin-top bg-primary"
            style={{ scaleY: shouldReduceMotion ? 1 : timelineScaleY }}
          />
        </div>

        <div className="space-y-6">
          {journey.map((item, index) => {
            const isLeft = index % 2 === 0;
            const cardVariants = shouldReduceMotion
              ? undefined
              : getCardVariants(isLeft);

            return (
              <motion.div
                key={item.period}
                className="relative flex items-start"
                initial={shouldReduceMotion ? false : "initial"}
                whileInView={shouldReduceMotion ? undefined : "animate"}
                viewport={{ once: true, amount: 0.35 }}
              >
                <div className="hidden w-1/2 sm:block sm:pr-8 sm:text-right">
                  {isLeft && (
                    <motion.div
                      variants={cardVariants}
                      className="inline-block w-full rounded-xl border border-border bg-card p-5 text-left transition hover:bg-muted/40"
                    >
                      <JourneyCardContent item={item} />
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className="absolute top-7 left-2.75 sm:left-1/2 sm:-translate-x-1/2"
                  variants={shouldReduceMotion ? undefined : dotVariants}
                >
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </motion.div>

                <div className="w-full pl-10 sm:w-1/2 sm:pl-8">
                  {!isLeft && (
                    <motion.div
                      variants={cardVariants}
                      className="hidden sm:block rounded-xl border border-border bg-card p-5 transition hover:bg-muted/40"
                    >
                      <JourneyCardContent item={item} />
                    </motion.div>
                  )}

                  <div className="sm:hidden">
                    <motion.div
                      variants={
                        shouldReduceMotion ? undefined : getCardVariants(false)
                      }
                      className="rounded-xl border border-border bg-card p-5 transition hover:bg-muted/40"
                    >
                      <JourneyCardContent item={item} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
