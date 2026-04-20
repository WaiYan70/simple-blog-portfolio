import { BaseCard } from "../shared/BaseCard";
import { Section } from "../shared/Section";
import { SectionHeader } from "../shared/SectionHeader";

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

export function Highlight() {
  return (
    <Section>
      <SectionHeader title="Highlights" />

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <BaseCard key={highlight.title}>
            <h3 className="font-medium tracking-tight transition group-hover:text-primary">
              {highlight.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {highlight.description}
            </p>
          </BaseCard>
        ))}
      </div>
    </Section>
  );
}
