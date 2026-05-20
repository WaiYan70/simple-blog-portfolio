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
  label: string;
  stage: string;
  role: string;
  context: string;
  stack: string[];
  summary: string;
  growth: string;
  highlights: string[];
};

const journey: JourneyItem[] = [
  {
    period: "July 2025 - Present",
    label: "Current Focus",
    stage: "Production Systems",
    role: "Freelance Software Engineer",
    context: "E-commerce platform with admin dashboard",
    stack: ["MERN", "TypeScript", "Redis", "Cloudinary", "Stripe"],
    summary:
      "Building a production-focused commerce system with customer flows, admin operations, payment review, automation, and deployment ownership.",
    growth:
      "This project helped me connect backend architecture, authentication, admin workflows, deployment, and security into one real-world system.",
    highlights: [
      "Built commerce workflows for inventory, order administration, delivery fee calculation, and product classification.",
      "Implemented QR-based manual payment verification with proof uploads, admin review, resubmission requests, refunds, and cancellations.",
      "Delivered secure auth with HttpOnly JWT cookies, refresh token rotation, Google OAuth, RBAC, Brevo email verification, and password reset flows.",
      "Added SSE exchange-rate updates, product scraping for 100+ items from 3 brands, Cloudinary media storage, backend protections, and VPS deployment.",
    ],
  },
  {
    period: "August 2024 - Present",
    label: "Client Operations",
    stage: "Internal Tools",
    role: "Freelance Software Engineer",
    context: "Fleet management and expense tracking system",
    stack: ["MERN", "TypeScript", "JWT", "Charts"],
    summary:
      "Developing an internal operations system for a taxi service business managing around 20 vehicles.",
    growth:
      "This work strengthened how I model real business workflows, protect owner-only modules, and turn operational data into useful dashboards.",
    highlights: [
      "Centralized driver records, vehicle tracking, expense management, license expiration notifications, and repair scheduling.",
      "Implemented authentication and role-based authorization for owner-only financial and operations modules.",
      "Built responsive dashboards and reports to improve financial visibility and daily fleet management workflows.",
    ],
  },
  {
    period: "April 2023 - August 2023",
    label: "Freelance Start",
    stage: "Business Websites",
    role: "Freelance Web Developer",
    context: "Websites for local computer shops",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    summary:
      "Designed, developed, and deployed responsive business websites for two local computer shops in Myanmar.",
    growth:
      "These projects helped me practice translating business needs into clear frontend structure, readable content, and practical deployment decisions.",
    highlights: [
      "Translated business requirements into clear frontend experiences for local customers.",
      "Improved online visibility and accessibility with responsive layouts and practical content structure.",
    ],
  },
  {
    period: "September 2022 - February 2023",
    label: "First Engineering Role",
    stage: "Backend Systems",
    role: "Junior Software Engineer",
    context: "MPT (Myanmar Posts and Telecommunications)",
    stack: ["Spring Boot", "Oracle SQL", "REST APIs"],
    summary:
      "Worked on internal financial tracking features and backend integrations in a production engineering environment.",
    growth:
      "This role gave me early exposure to production code, backend debugging, database performance, and cross-team delivery habits.",
    highlights: [
      "Developed Spring Boot API features that helped streamline financial data workflows and reduce manual reporting time by 30%.",
      "Optimized Oracle SQL queries, improving data retrieval performance by 25% and supporting more accurate financial reporting.",
      "Collaborated on backend testing, debugging, API integration, and issue resolution to improve application stability.",
    ],
  },
  {
    period: "Before",
    label: "Foundation",
    stage: "Learning Core Skills",
    role: "Software Engineering Student",
    context: "University and self-study",
    stack: ["HTML", "CSS", "JavaScript", "Java", "Python", "C#"],
    summary:
      "Built the fundamentals across frontend, backend, programming languages, and problem solving before moving into production projects.",
    growth:
      "This period shaped my interest in full-stack engineering and gave me the base to understand both UI implementation and backend logic.",
    highlights: [
      "Learned core web development through HTML, CSS, and JavaScript.",
      "Practiced backend and object-oriented programming with Java, C#, and Python.",
      "Built early projects that helped me move from syntax practice toward real application structure.",
    ],
  },
];

const rowVariants: Variants = {
  initial: {
    opacity: 0,
    y: 28,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
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
      delay: 0.12,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function SmallJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {item.label}
      </p>
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        {item.period}
      </p>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {item.stage}
      </h3>
      <p className="mt-1 text-sm text-foreground/80">{item.role}</p>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {item.stack.slice(0, 3).join(" · ")}
      </p>
    </div>
  );
}

function BigJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/30 md:p-6">
      <p className="text-sm font-medium text-primary">{item.context}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">Summary</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.summary}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Engineering Growth
          </h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.growth}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold tracking-tight">Key Work</h4>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/30">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {item.label}
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {item.period}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-tight">{item.stage}</h3>
        <p className="mt-1 text-sm text-foreground/80">{item.role}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <p className="text-sm font-medium text-primary">{item.context}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {item.summary}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {item.growth}
        </p>
        <div className="mt-5">
          <h4 className="text-sm font-semibold tracking-tight">Key Works</h4>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
            {item.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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
    <Section reveal={false}>
      <SectionHeader
        title="Engineering Journey"
        description="A short timeline of my experience and how I got here."
      />

      <div ref={timelineRef} className="relative my-12">
        {/* Timeline rail: the static border line with an animated primary fill as the user scrolls. */}
        <div className="absolute bottom-8 left-4 top-8 w-px overflow-hidden bg-border md:left-[32.5%] md:-translate-x-1/2">
          <motion.div
            className="h-full w-full origin-top bg-primary"
            style={{ scaleY: shouldReduceMotion ? 1 : timelineScaleY }}
          />
        </div>

        <div className="flex flex-col gap-6">
          {journey.map((item) => (
            <motion.article
              key={`${item.period}-${item.context}`}
              className="relative grid grid-cols-[2rem_minmax(0,1fr)] md:grid-cols-[minmax(0,30%)_minmax(2rem,5%)_minmax(0,65%)] gap-y-4"
              variants={shouldReduceMotion ? undefined : rowVariants}
              initial={shouldReduceMotion ? false : "initial"}
              whileInView={shouldReduceMotion ? undefined : "animate"}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Timeline dot: centered in the timeline column for each journey item. */}
              <motion.div
                className="relative z-10 col-start-1 md:col-start-2 row-start-1 flex justify-center pt-5"
                variants={shouldReduceMotion ? undefined : dotVariants}
              >
                <span className="block size-3 rounded-full border-2 border-background bg-primary shadow-[0_0_0_4px_var(--card)]" />
              </motion.div>

              {/* Desktop Small Card */}
              <div className="hidden md:block md:col-start-1 row-start-1 pl-3 md:pl-0 md:pr-5">
                <SmallJourneyCard item={item} />
              </div>

              {/* Desktop Big Card*/}
              <div className="hidden md:block md:col-span-1 md:col-start-3 row-start-2 md:row-start-1 pl-11 md:pl-5">
                <BigJourneyCard item={item} />
              </div>

              {/* Mobile and Small Screen Combine Card*/}
              <div className="md:hidden col-start-2 row-start-1 pl-3">
                <MobileJourneyCard item={item} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
