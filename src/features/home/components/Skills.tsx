import {
  siReact,
  siNodedotjs,
  siTypescript,
  siMongodb,
  siRedis,
  siNextdotjs,
  siTailwindcss,
  siDocker,
  siPostgresql,
  siVercel,
  siRailway,
  siHostinger,
  siBun,
  siJavascript,
  siPython,
  siShadcnui,
  siAxios,
  siThreedotjs,
  siVite,
  siJest,
  siJsonwebtokens,
  siGoogleauthenticator,
  siPuppeteer,
  siExpress,
  siCheerio,
  siCloudinary,
  siStripe,
} from "simple-icons/icons";
import {
  Server,
  Monitor,
  Database,
  Wrench,
  Cpu,
  Shield,
  Zap,
  Network,
} from "lucide-react";
import { BaseCard } from "@/components/shared/BaseCard";

import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

type IconType = SimpleIcon | LucideIcon;

type SimpleIcon = {
  path: string;
};

const skillGroups = [
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", icon: siNodedotjs },
      { name: "Bun.js", icon: siBun },
      { name: "JavaScript", icon: siJavascript },
      { name: "TypeScript", icon: siTypescript },
      { name: "Express.js", icon: siExpress },
      { name: "Python", icon: siPython },
      { name: "Puppeteer", icon: siPuppeteer },
      { name: "Cheerio", icon: siCheerio },
      { name: "MongoDB", icon: siMongodb },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "Redis", icon: siRedis },
      { name: "JWT", icon: siJsonwebtokens },
      { name: "OAuth", icon: siGoogleauthenticator },
    ],
  },
  {
    title: "Frontend",
    icon: Monitor,
    skills: [
      { name: "Vite", icon: siVite },
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Shadcn", icon: siShadcnui },
      { name: "Axios", icon: siAxios },
      { name: "Three.js", icon: siThreedotjs },
      { name: "Jest", icon: siJest },
    ],
  },
  {
    title: "Infra",
    icon: Database,
    skills: [
      { name: "Docker", icon: siDocker },
      { name: "Atlas", icon: siMongodb },
      { name: "Neon", icon: siPostgresql },
      { name: "Vercel", icon: siVercel },
      { name: "Railway", icon: siRailway },
      { name: "Hostinger", icon: siHostinger },
      { name: "Cloudinary", icon: siCloudinary },
      { name: "Stripe", icon: siStripe },
    ],
  },
  {
    title: "Practices",
    icon: Wrench,
    skills: [
      { name: "System Design", icon: Cpu },
      { name: "API Design", icon: Network },
      { name: "Authentication", icon: Shield },
      { name: "Performance", icon: Zap },
    ],
  },
];

function SkillIcon({ icon }: { icon: IconType }) {
  if ("path" in icon) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d={icon.path} />
      </svg>
    );
  }

  const Icon = icon;
  return <Icon className="h-3 w-3 text-muted-foreground" />;
}

export function Skills() {
  return (
    <Section>
      <SectionHeader
        title="Skills"
        description="Tools and technologies I use to build full-stack systems with a focus
        on backend architecture and scalability."
        className="space-y-2"
      />

      <div className="flex flex-col gap-6">
        {skillGroups.map((group) => {
          const Icon = group.icon;
          return (
            <BaseCard
              key={group.title}
              variant="default"
              radis="lg"
              className="p-4 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  {group.title}
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                  >
                    <SkillIcon icon={skill.icon} />
                    {skill.name}
                  </span>
                ))}
              </div>
            </BaseCard>
          );
        })}
      </div>
    </Section>
  );
}
