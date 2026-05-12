"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
};

const itemVariants: Variants = {
  initial: {
    y: 18,
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function StaggerReveal({
  children,
  className,
  itemClassName,
  stagger = 0.2,
  delay = 0.18,
  amount = 0.25,
}: StaggerRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {items.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount }}
      className={className}
    >
      {items.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={cn(itemClassName)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
