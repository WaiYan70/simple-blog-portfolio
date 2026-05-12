import { BaseCard } from "@/components/shared/BaseCard";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerReveal } from "../animation/StaggerReveal";

const principles = [
  {
    title: "Understand before building",
    description:
      "I focus on understanding the problem deeply before writing code, including constraints, tradeoffs, and real-world use cases.",
  },
  {
    title: "Design for scalability early",
    description:
      "I think about how systems will grow, including performance, maintainability, and architecture decisions from the start.",
  },
  {
    title: "Prefer clarity over cleverness",
    description:
      "I aim to write code and design systems that are easy to understand, debug, and extend.",
  },
  {
    title: "Learn through real systems",
    description:
      "I build real-world projects and reflect on decisions to improve both technical skills and engineering judgment.",
  },
];

export function HowIThink() {
  return (
    <Section>
      <SectionHeader
        title="How I Think"
        description="My approach to building systems and solving real-world problems."
      />

      <StaggerReveal className="grid md:grid-cols-2 gap-3">
        {principles.map((item, index) => (
          <BaseCard
            key={item.title}
            variant="outline"
            radius="xl"
            className="relative h-full overflow-hidden p-5 sm:p-6"
          >
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-semibold tracking-tight transition group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </BaseCard>
        ))}
      </StaggerReveal>
    </Section>
  );
}
