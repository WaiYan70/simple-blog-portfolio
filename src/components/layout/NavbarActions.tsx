import { ThemeToggle } from "../theme/ThemeToggle";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { socialLinks } from "@/constants/social-links";

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
              "flex items-center justify-center rounded-md p-2.5 transition hover:scale-105 active:scale-95",
              socialLink.brandClassName,
            )}
          >
            <Icon size={16} />
          </Link>
        );
      })}
    </div>
  );
}
