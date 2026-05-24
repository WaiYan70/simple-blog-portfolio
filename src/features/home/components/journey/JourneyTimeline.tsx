"use client";

import { type ReactNode, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";

type JourneyTimelineProps = {
  children: ReactNode;
};

type JourneyTimelineItemProps = {
  smallCard: ReactNode;
  bigCard: ReactNode;
  mobileCard: ReactNode;
};

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
      staggerChildren: 0.08,
    },
  },
};

const smallCardVariants: Variants = {
  initial: {
    opacity: 0,
    x: -24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const bigCardVariants: Variants = {
  initial: {
    opacity: 0,
    x: 24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mobileCardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
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
      delay: 0.12,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function JourneyTimeLine({ children }: JourneyTimelineProps) {
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
      if (rect.height === 0) return;
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
    <div ref={timelineRef} className="relative my-12">
      <div className="absolute bottom-8 left-4 top-8 w-px overflow-hidden bg-border md:left-[32.5%] md:-translate-x-1/2">
        <motion.div
          className="h-full w-full origin-top bg-primary"
          style={{ scaleY: shouldReduceMotion ? 1 : timelineScaleY }}
        />
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function JourneyTimeLineItem({
  smallCard,
  bigCard,
  mobileCard,
}: JourneyTimelineItemProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.article
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
      <motion.div
        className="hidden md:block md:col-start-1 row-start-1 pl-3 md:pl-0 md:pr-5"
        variants={shouldReduceMotion ? undefined : smallCardVariants}
      >
        {smallCard}
      </motion.div>

      {/* Desktop Big Card*/}
      <motion.div
        className="hidden md:block md:col-span-1 md:col-start-3 row-start-2 md:row-start-1 pl-11 md:pl-5"
        variants={shouldReduceMotion ? undefined : bigCardVariants}
      >
        {bigCard}
      </motion.div>

      {/* Mobile and Small Screen Combine Card*/}
      <motion.div
        className="md:hidden col-start-2 row-start-1 pl-3"
        variants={shouldReduceMotion ? undefined : mobileCardVariants}
      >
        {mobileCard}
      </motion.div>
    </motion.article>
  );
}
