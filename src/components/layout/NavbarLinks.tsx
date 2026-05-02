"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

const links = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
];

export default function NavbarLinks() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <ul
      onMouseLeave={() => setHovered(null)}
      className="relative flex justify-center gap-2"
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        const isHovered = hovered === link.name;
        return (
          <Link
            key={link.name}
            href={link.href}
            onMouseEnter={() => setHovered(link.name)}
            className="relative px-4 py-2 text-sm"
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
            <li
              className={`relative z-10 ${isActive ? "text-white" : "text-slate-700"}`}
            >
              {link.name}
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
