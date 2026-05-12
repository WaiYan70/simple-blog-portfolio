"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type MotionProps, type Variants } from "motion/react";
import { twMerge } from "tailwind-merge";
import { siGithub } from "simple-icons";
import { Blocks, MapPin, Mail, FileText, ArrowRight } from "lucide-react";
import { TextFlip } from "../animation/TextFlip";
import { LinkedInIcon } from "@/components/icons/LinkedIn";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { Section } from "@/components/shared/Section";

const bentoContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

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
        <FocusBlock />
        <ContactBlock />
      </motion.div>
    </Section>
  );
}

type BlockProps = {
  className?: string;
} & MotionProps;

function Block({ className, ...rest }: BlockProps) {
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

function HeaderBlock() {
  return (
    <Block className="col-span-12 md:col-span-8 row-span-2 flex flex-col justify-between bg-linear-to-br from-card via-card to-muted/50 md:p-7">
      <div className="flex justify-start items-center gap-3">
        <Image
          width={56}
          height={56}
          src="/profile.jpeg"
          alt="avatar"
          className="size-14 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-primary">
            Hi, I’m Khant Wai Yan
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Software Engineer
          </p>
        </div>
      </div>

      {/* Main headline */}
      <h1 className="mt-5 max-w-2xl text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight ">
        Building systems that explain{" "}
        <span className="text-primary">
          <TextFlip />
        </span>{" "}
        — not just what they do.
      </h1>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/blog"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-dark"
        >
          Read Blog
        </Link>

        <Link
          href="/projects"
          className="text-sm font-medium text-muted-foreground transition hover:text-primary group inline-flex items-center gap-1.5"
        >
          View Project
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Block>
  );
}

const socialCardClassName =
  "col-span-3 md:col-span-2 grid place-items-center p-0";

const socialLinkClassName =
  "grid h-full w-full place-content-center rounded-2xl transition-colors duration-300";

const socialIconClassName = "h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7";

function SocialBlock() {
  return (
    <>
      <Block
        whileHover={{ y: -3, rotate: "2.5deg" }}
        className="col-span-6 md:col-span-4 flex flex-col items-center justify-center bg-muted/40 text-foreground"
      >
        <div className="flex items-center justify-center gap-1.5 text-center">
          <MapPin className={twMerge(socialIconClassName, "text-primary")} />
          <p className="inline text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Asia / Bangkok
          </p>
        </div>
        <BangkokClock />
      </Block>

      <Block
        whileHover={{ y: -3, rotate: "2.5deg" }}
        className={twMerge(
          socialCardClassName,
          "bg-foreground text-background",
        )}
      >
        <Link
          href="https://github.com/WaiYan70"
          className={twMerge(socialLinkClassName, "hover:opacity-85")}
        >
          <BrandIcon
            path={siGithub.path}
            title="Github"
            className={socialIconClassName}
          />
        </Link>
      </Block>

      <Block
        whileHover={{ y: -3, rotate: "-2.5deg" }}
        className={twMerge(socialCardClassName, "bg-[#0A66C2] text-white")}
      >
        <Link
          href="https://www.linkedin.com/in/khant-wai-yan-00b1241b9/"
          className={twMerge(socialLinkClassName, "hover:bg-[#084f96]")}
        >
          <LinkedInIcon className={socialIconClassName} />
        </Link>
      </Block>
    </>
  );
}

function BangkokClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Bangkok",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      hour12: false,
    });

    const updateTime = () => {
      const parts = formatter.formatToParts(new Date());
      const weekday = parts.find((part) => part.type === "weekday")?.value;
      const hour = parts.find((part) => part.type === "hour")?.value;
      const minute = parts.find((part) => part.type === "minute")?.value;
      const second = parts.find((part) => part.type === "second")?.value;

      if (weekday && hour && minute) {
        setTime(`${weekday}, ${hour}:${minute}:${second}`);
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <time
      dateTime={time}
      className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-primary"
    >
      {time || "---, --:--"}
    </time>
  );
}

function AboutBlock() {
  return (
    <Block className="col-span-12">
      <p className="text-lg leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
        I document real-world{" "}
        <span className="font-medium text-foreground">projects</span>,{" "}
        <span className="font-medium text-foreground">
          architecture decisions
        </span>
        , and the reasoning behind the systems I build with a focus on{" "}
        <span className="font-semibold text-primary">clarity</span>,{" "}
        <span className="font-semibold text-primary">scalability</span>, and{" "}
        <span className="font-semibold text-primary">practical tradeoffs</span>.
      </p>
    </Block>
  );
}

function FocusBlock() {
  return (
    <Block className="col-span-5 bg-muted/40">
      <Blocks className="mb-4 h-5 w-5 text-primary" />
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Current focus
      </p>
      <p className="mt-2 text-lg font-medium line-clamp-3">
        Building maintainable Next.js apps with clear architecture.
      </p>
    </Block>
  );
}

function ContactBlock() {
  return (
    <Block className="col-span-7 bg-primary text-primary-foreground">
      <p className="text-xs uppercase tracking-[0.2em] opacity-75">
        Available for work
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        Have a project or role in mind?
      </h2>
      <div className="mt-2 sm:mt-5 flex gap-2">
        <Link
          href="mailto:khantwaiyan11@gmail.com?subject=Opportunity&body=Hi Khant,"
          className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90"
        >
          <Mail className="h-4 w-4" />
          Send email
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90"
        >
          <FileText className="h-4 w-4" />
          Download CV
        </Link>
      </div>
    </Block>
  );
}
