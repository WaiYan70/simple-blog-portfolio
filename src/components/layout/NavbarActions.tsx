import { siGithub } from "simple-icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LinkedInIcon } from "../icons/LinkedIn";
import { ThemeToggle } from "../theme/ThemeToggle";
import Link from "next/link";

const socialLinks = [
  {
    href: "https://github.com/WaiYan70",
    label: "GitHub",
    icon: (props: { size: number }) => (
      <BrandIcon path={siGithub.path} title="GitHub" {...props} />
    ),
  },
  {
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
];

export function NavbarActions() {
  return (
    <div className="flex">
      <ThemeToggle />
      <div className="flex items-center">
        {socialLinks.map((socialLink) => {
          const Icon = socialLink.icon;
          return (
            <Link
              key={socialLink.href}
              href={socialLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialLink.label}
              className="flex items-center justify-center rounded-md p-2.5 text-muted-foreground transition hover:text-foreground hover:bg-muted"
            >
              <Icon size={16} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
