import { Copyright } from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "GitHub",
    href: "https://github.com/WaiYan70",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
  },
];

export function Footer() {
  return (
    <footer className="mt-4 border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <h2 className="text-lg font-semibold tracking-tight">
          Khant — Software Engineer
        </h2>
        <p className="mt-2 mx-auto max-w-md text-sm text-muted-foreground leading-6">
          Building Scalable systems, secure applications, and learning software
          architecture deeply
        </p>
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-primary">
          {navItems.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              rel="noopener noreferrer"
              target="_blank"
              className="transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-xs text-muted-foreground inline-flex items-center gap-1">
          {" "}
          <Copyright size={14} /> {new Date().getFullYear()} Khant All rights
          reserved.{" "}
        </p>
      </div>
    </footer>
  );
}
