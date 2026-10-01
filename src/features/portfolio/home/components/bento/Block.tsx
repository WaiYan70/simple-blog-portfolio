import { twMerge } from "tailwind-merge";
import { motion, type MotionProps, type Variants } from "motion/react";

const bentoBlockVariants: Variants = {
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
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type BlockProps = {
  className?: string;
} & MotionProps;

export function Block({ className, ...rest }: BlockProps) {
  return (
    <motion.div
      variants={bentoBlockVariants}
      className={twMerge(
        "col-span-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm",
        className,
      )}
      {...rest}
    />
  );
}
