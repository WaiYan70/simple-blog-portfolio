import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TextFlip } from "./TextFlip";
import { TypeWriter } from "./TypeWriter";

export default function Hero() {
  return (
    <section className="relative rounded-3xl border border-border bg-card/10 p-6 shadow-sm sm:p-10">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-transparent" />

      <div className="relative max-w-3xl space-y-6">
        {/* Role */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Hi, I’m Khant</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Software Engineer
          </p>
        </div>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight wrap-break-word">
          Building systems that explain{" "}
          <span className="text-primary">
            <TextFlip />
          </span>{" "}
          — not just what they do.
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          <TypeWriter
            text="I document real-world projects, architecture decisions, and the
          reasoning behind the systems I build with a focus on clarity,
          scalability, and practical tradeoffs."
          />
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 pt-2">
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
      </div>
    </section>
  );
}

// Add fade-in for sections (scroll reveal)

// Add View Transition API between page transition

// Adjuct text flipping animation like the left letters go up a little fast that right one
