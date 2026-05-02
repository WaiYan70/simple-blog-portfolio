"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

export const navbarLinks = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
] as const;

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
                className="relative block px-4 py-2 text-sm"
              >
                {/* Active Pill */}
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-black/80"
                  />
                )}

                {/* Hover Effect */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="hover-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-black/10"
                  />
                )}

                {/* Routes (Navbar links)*/}
                <span
                  className={`relative z-10 ${isActive ? "text-white" : "text-slate-700"}`}
                >
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
