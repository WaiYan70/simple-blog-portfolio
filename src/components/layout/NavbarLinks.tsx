"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Home, BookMarked, LayoutGrid, type LucideIcon } from "lucide-react";

type NavbarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const navbarLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Blog", href: "/blog", icon: BookMarked },
  { name: "Projects", href: "/projects", icon: LayoutGrid },
] satisfies NavbarLink[];

export default function NavbarLinks() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label="Primary navigation" className="sm:block hidden">
      <ul
        onMouseLeave={() => setHovered(null)}
        className="relative flex justify-center gap-2"
      >
        {navbarLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const isHovered = hovered === link.name;

          return (
            <li key={link.name}>
              <Link
                href={link.href}
                onMouseEnter={() => setHovered(link.name)}
                className="relative flex items-center gap-2 px-4 py-2 text-sm"
              >
                {/* Active Pill */}
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-primary"
                  />
                )}

                {/* Hover Effect */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="hover-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-muted"
                  />
                )}

                {/* Routes (Navbar links)*/}
                <span
                  className={`relative z-10 inline-flex items-center gap-1.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 stroke-[2.25] ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
