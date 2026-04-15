const highlights = [
  {
    title: "System Design",
    description:
      "Focus on scalable backend architecture, performance, and real-world tradeoffs.",
  },
  {
    title: "Authentication Systems",
    description:
      "JWT, refresh token rotation, reuse detection, and Redis session management.",
  },
  {
    title: "Full-Stack Development",
    description:
      "Building end-to-end systems using React, Node.js, and modern tooling.",
  },
  {
    title: "Real-world Projects",
    description:
      "Hands-on experience building production-style applications and admin tools.",
  },
];

export function HighLight() {
  return (
    <section className="mt-16 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Highlights</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <div key={highlight.title} className="rounded-2xl border p-5">
            <h3 className="font-medium">{highlight.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {highlight.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
