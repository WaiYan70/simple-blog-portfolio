import { siGithub } from "simple-icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LinkedInIcon } from "../icons/LinkedIn";
import { ThemeToggle } from "../theme/ThemeToggle";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const socialLinks = [
  {
    href: "https://github.com/WaiYan70",
    label: "GitHub",
    icon: (props: { size: number }) => (
      <BrandIcon path={siGithub.path} title="GitHub" {...props} />
    ),
    bgcolor: "bg-foreground text-background",
  },
  {
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
    label: "LinkedIn",
    icon: LinkedInIcon,
    bgcolor: "bg-[#0A66C2] hover:bg-[#084f96] text-white",
  },
];

export function NavbarActions() {
  return (
    <div className="sm:flex gap-2 hidden">
      <ThemeToggle />

      {socialLinks.map((socialLink) => {
        const Icon = socialLink.icon;
        return (
          <Link
            key={socialLink.href}
            href={socialLink.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={socialLink.label}
            className={twMerge(
              "flex items-center justify-center rounded-md p-2.5 text-muted-foreground transition hover:scale-105 active:scale-95",
              socialLink.bgcolor,
            )}
          >
            <Icon size={16} />
          </Link>
        );
      })}
    </div>
  );
}
