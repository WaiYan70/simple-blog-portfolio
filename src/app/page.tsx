export default function Home() {
  return (
    <section className="rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Software Engineer
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Building a portfolio that explains the work, not just the result.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          I use this site to document projects, architecture decisions, product
          tradeoffs, and the technical reasoning behind the systems I build.
        </p>
      </div>
    </section>
  );
}
