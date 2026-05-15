import { BaseCard } from "@/components/shared/BaseCard";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerReveal } from "../animation/StaggerReveal";
import {
  KeyRound,
  LayoutDashboard,
  Network,
  Route,
  type LucideIcon,
} from "lucide-react";

type EngineeringFocusItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const engineeringFocusItems: EngineeringFocusItem[] = [
  {
    title: "Backend Architecture",
    description:
      "I start with constraints, data flow, and failure paths before choosing implementation details.",
    icon: Network,
  },
  {
    title: "Authentication & Sessions",
    description:
      "I focus on secure auth flows, refresh token handling, session state, and abuse-resistant behavior.",
    icon: KeyRound,
  },
  {
    title: "Admin & Operational Workflows",
    description:
      "I build tools that make real systems easier to inspect, manage, and recover.",
    icon: LayoutDashboard,
  },
  {
    title: "Clarity in Tradeoffs",
    description:
      "I document why decisions were made, what was rejected, and what the system optimizes for.",
    icon: Route,
  },
];

export function EngineeringFocus() {
  return (
    <Section>
      <SectionHeader
        title="Engineering Focus"
        description="The technical areas I return to most often and the principles behind how I approach them."
      />

      <StaggerReveal
        className="grid gap-4 sm:grid-cols-2"
        itemClassName="h-full"
      >
        {engineeringFocusItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <BaseCard
              key={item.title}
              variant="outline"
              radius="xl"
              className="relative h-full overflow-hidden p-5 sm:p-6"
            >
              <div className="absolute right-4 top-4 font-mono text-4xl font-semibold tracking-tight text-muted-foreground/10">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="font-semibold tracking-tight transition group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </BaseCard>
          );
        })}
      </StaggerReveal>
    </Section>
  );
}
