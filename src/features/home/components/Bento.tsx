"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, MotionProps } from "motion/react";
import { twMerge } from "tailwind-merge";
import { siGithub } from "simple-icons";
import { BookMarked, Blocks } from "lucide-react";
import { TextFlip } from "../animation/TextFlip";
import { LinkedInIcon } from "@/components/icons/LinkedIn";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { TypeWriter } from "../animation/TypeWriter";

export function Bento() {
  return (
    <div className="max-w-5xl grid grid-cols-12 gap-2">
      <HeaderBlock />
      <SocialBlock />
      <AboutBlock />
      <Block>4</Block>
      <Block>5</Block>
      <Block>6</Block>
    </div>
  );
}

type BlockProps = {
  className?: string;
} & MotionProps;

function Block({ className, ...rest }: BlockProps) {
  return (
    <motion.div
      className={twMerge(
        "col-span-4 rounded-lg border border-border p-6",
        className,
      )}
      {...rest}
    />
  );
}

function HeaderBlock() {
  return (
    <Block className="col-span-12 row-span-2 md:col-span-8">
      <div className="flex justify-start items-center gap-3">
        <Image
          width={56}
          height={56}
          src="/profile.jpeg"
          alt="avatar"
          className="size-14 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-primary">Hi, I’m Khant</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Software Engineer
          </p>
        </div>
      </div>

      {/* Main headline */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight leading-tight wrap-break-word">
        Building systems that explain{" "}
        <span className="text-primary">
          <TextFlip />
        </span>{" "}
        — not just what they do.
      </h1>
    </Block>
  );
}

function SocialBlock() {
  return (
    <>
      <Block className="col-span-3 md:col-span-2">
        <Link href="/blog" className="grid h-full place-content-center">
          <BookMarked />
        </Link>
      </Block>

      <Block className="col-span-3 md:col-span-2">
        <Link href="/blog" className="grid h-full place-content-center">
          <Blocks />
        </Link>
      </Block>

      <Block className="col-span-3 md:col-span-2">
        <Link href="/blog" className="grid h-full place-content-center">
          <LinkedInIcon />
        </Link>
      </Block>

      <Block className="col-span-3 md:col-span-2">
        <Link href="/blog" className="grid h-full place-content-center">
          <BrandIcon path={siGithub.path} title="Github" />
        </Link>
      </Block>
    </>
  );
}

function AboutBlock() {
  return (
    <Block className="col-span-12">
      {/* Description */}
      <p className="text-lg leading-7 text-muted-foreground sm:text-2xl">
        <TypeWriter
          text="I document real-world projects, architecture decisions, and the
    reasoning behind the systems I build with a focus on clarity,
    scalability, and practical tradeoffs."
        />
      </p>
    </Block>
  );
}
