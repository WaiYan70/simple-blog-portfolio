import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { LinkedInIcon } from "@/components/icons/LinkedIn";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";

type IconProps = { size: number };

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/WaiYan70",
    label: "GitHub",
    icon: (props: IconProps) => (
      <BrandIcon path={siGithub.path} title="GitHub" {...props} />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
    label: "LinkedIn",
    icon: (props: IconProps) => <LinkedInIcon {...props} />,
  },
];

export function ContactMe() {
  return (
    <Section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative isolate min-h-85 overflow-hidden bg-card text-foreground p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px)] bg-size-[96px_96px]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,color-mix(in_oklch,var(--primary)_33%,transparent),transparent_34%)]" />

          <div className="flex flex-col justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Get in touch
              </h2>
              <p className="mt-5 text-base leading-8 text-foreground/70">
                If you are interested in working together or have any questions,
                feel free to reach out. I am always open to discussing new
                opportunities and ideas.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-sm text-foreground/75">
              <Link
                href="mailto:khantwaiyan11@gmail.com?subject=Opportunity&body=Hi Khant,"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="size-5 text-foreground/55" />
                khantwaiyan11@gmail.com
              </Link>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-foreground/55" />
                Asia / Bangkok
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((socialLink) => {
                  const Icon = socialLink.icon;
                  return (
                    <Button
                      key={socialLink.href}
                      asChild
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center gap-2 border-background/20 bg-background/5 text-foreground hover:bg-background/10 hover:text-foreground"
                    >
                      <Link
                        href={socialLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLink.label}
                      >
                        <Icon size={16} />
                        {socialLink.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 sm:p-8 lg:p-10">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
