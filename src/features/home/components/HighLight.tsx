import { BaseCard } from "@/components/shared/BaseCard";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerReveal } from "../animation/StaggerReveal";

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

      <StaggerReveal className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <BaseCard
            key={highlight.title}
            variant="default"
            radius="md"
            className="p-4 sm:p-6"
          >
            <h3 className="font-medium tracking-tight transition group-hover:text-primary">
              {highlight.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {highlight.description}
            </p>
          </BaseCard>
        ))}
      </StaggerReveal>
    </Section>
  );
}
