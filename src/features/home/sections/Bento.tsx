"use client";

import { motion, type Variants } from "motion/react";
import { Section } from "@/components/shared/Section";
import { HeaderBlock } from "../components/bento/HeaderBlock";
import { SocialBlock } from "../components/bento/SocialBlock";
import { AboutBlock } from "../components/bento/AboutBlock";
import { ProofBlock } from "../components/bento/ProofBlock";
import { ContactBlock } from "../components/bento/ContactBlock";

const bentoContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function Bento() {
  return (
    <Section>
      <motion.div
        variants={bentoContainerVariants}
        initial="initial"
        animate="animate"
        className="grid max-w-5xl grid-cols-12 gap-2.5 sm:gap-3"
      >
        <HeaderBlock />
        <SocialBlock />
        <AboutBlock />
        <ProofBlock />
        <ContactBlock />
      </motion.div>
    </Section>
  );
}
