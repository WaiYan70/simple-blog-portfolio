import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-transparent" />

      <div className="relative max-w-3xl space-y-6">
        {/* Role */}
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Software Engineer
        </p>

        {/* Main headline */}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Building systems that explain{" "}
          <span className="text-primary">how they work</span>, not just what
          they do.
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          I use this site to document real-world projects, architecture
          decisions, and the reasoning behind the systems I build — focusing on
          clarity, scalability, and practical tradeoffs.
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
            className="text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            View Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
