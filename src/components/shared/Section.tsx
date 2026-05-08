"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  reveal?: boolean;
};

export function Section({ children, className, reveal = true }: SectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!reveal || shouldReduceMotion) {
    return <section className={cn("my-12 space-y-6")}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("my-12 space-y-6", className)}
    >
      {children}
    </motion.section>
  );
}
