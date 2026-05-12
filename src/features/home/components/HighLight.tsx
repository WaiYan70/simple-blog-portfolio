import { BaseCard } from "@/components/shared/BaseCard";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerReveal } from "../animation/StaggerReveal";
import {
  Boxes,
  KeyRound,
  Layers3,
  Rocket,
  type LucideIcon,
} from "lucide-react";

type HighlightItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const highlights: HighlightItem[] = [
  {
    title: "System Design",
    description:
      "Focus on scalable backend architecture, performance, and real-world tradeoffs.",
    icon: Boxes,
  },
  {
    title: "Authentication Systems",
    description:
      "JWT, refresh token rotation, reuse detection, and Redis session management.",
    icon: KeyRound,
  },
  {
    title: "Full-Stack Development",
    description:
      "Building end-to-end systems using React, Node.js, and modern tooling.",
    icon: Layers3,
  },
  {
    title: "Real-world Projects",
    description:
      "Hands-on experience building production-style applications and admin tools.",
    icon: Rocket,
  },
];

export function Highlight() {
  return (
    <Section>
      <SectionHeader
        title="Highlights"
        description="The engineering areas I keep returning to in projects, writing, and system design decisions."
      />

      <StaggerReveal className="grid gap-4 grid-cols-2">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;

          return (
            <BaseCard
              key={highlight.title}
              variant="default"
              radius="xl"
              className="relative h-full overflow-hidden p-5 sm:p-6"
            >
              <div className="absolute right-4 top-4 text-4xl font-semibold tracking-tight text-muted-foreground/10">
                0{index + 1}
              </div>

              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="font-semibold tracking-tight transition group-hover:text-primary">
                {highlight.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {highlight.description}
              </p>
            </BaseCard>
          );
        })}
      </StaggerReveal>
    </Section>
  );
}
