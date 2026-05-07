"use client";

import { PostSummary } from "@/features/blog/lib/post";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Section } from "@/components/shared/Section";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { motion, useReducedMotion, type Variants } from "motion/react";

const blogListVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.18,
    },
  },
};

const blogCardVariants: Variants = {
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

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section>
      <SectionHeader
        title="Latest Writing"
        action={
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary underline underline-offset-4"
          >
            All Writing
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
        className="flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-between"
      />
      <motion.div
        className="flex flex-col gap-2"
        variants={blogListVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            variants={shouldReduceMotion ? undefined : blogCardVariants}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
