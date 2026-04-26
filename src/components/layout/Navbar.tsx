"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siGithub } from "simple-icons/icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LinkedInIcon } from "../icons/LinkedIn";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useEffect, useState } from "react";

const navItem = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
];

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
    label: "Linkedln",
    icon: LinkedInIcon,
  },
];

export default function Navbar() {
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/60 backdrop-blur-sm border-b border-border" : "bg-transparent"}`}
    >
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight hover:opacity-80"
        >
          <span className="text-primary">Khant</span>.dev
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex gap-4 font-semibold text-sm text-muted-foreground">
            {navItem.map((item) => {
              const isActive = pathName.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative inline-flex items-center transition ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}

                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-primary origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </div>

          <ThemeToggle />
          <div className="flex items-center gap-2">
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
      </nav>
    </header>
  );
}
