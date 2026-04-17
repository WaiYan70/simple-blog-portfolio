import Link from "next/link";
import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LinkedInIcon } from "../icons/LinkedIn";

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

export function Contact() {
  return (
    <section className="mt-16 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>

        <p className="max-w-2xl text-sm text-muted-foreground leading-6">
          If you are interested in working together or have any questions, feel
          free to reach out. I am always open to discussing new opportunities
          and ideas.
        </p>
      </div>

      {/* Card */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Email CTA */}

        <Link
          href="mailto:khantwaiyan11@gmail.com?subject=Opportunity&body=Hi Khant,"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-dark"
        >
          <Mail className="h-4 w-4" />
          Send Email
        </Link>

        {/* Secondary links */}

        {socialLinks.map((socialLink) => {
          const Icon = socialLink.icon;
          return (
            <Link
              key={socialLink.href}
              href={socialLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialLink.label}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Icon size={16} />
              {socialLink.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
