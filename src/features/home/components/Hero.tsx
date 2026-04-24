import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TypeWriter } from "../animation/TypeWriter";
import { TextFlip } from "../animation/TextFlip";

export default function Hero() {
  return (
    <section className="relative">
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
