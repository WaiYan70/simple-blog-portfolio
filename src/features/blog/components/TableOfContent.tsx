"use client";

import { Heading } from "@/types/post";
import { useEffect, useState } from "react";

type Props = {
  headings: Heading[];
};

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const offset = 120; // navbar + spacing
    const buffer = 80; // 👈 KEY FIX

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      const elements = headings
        .map((h) => document.getElementById(h.slug))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      const positions = elements.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top + window.scrollY,
      }));

      let currentId = positions[0].id;

      for (let i = 0; i < positions.length; i++) {
        const current = positions[i];
        const next = positions[i + 1];

        if (!next || scrollPosition < next.top - buffer) {
          currentId = current.id;
          break;
        }
      }

      // Bottom fallback
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        currentId = positions[positions.length - 1].id;
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <nav className="space-y-2 border-l border-border pl-4">
      {headings.map((h) => (
        <a
          key={h.slug}
          href={`#${h.slug}`}
          style={{
            paddingLeft: `${(h.level - 2) * 12}px`,
          }}
          className={`block text-sm transition relative ${
            activeId === h.slug
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span
            className={`absolute -left-4 top-1/2 h-4 w-0.5 -translate-y-1/2 ${
              activeId === h.slug ? "bg-primary" : "bg-transparent"
            }`}
          />
          {h.text}
        </a>
      ))}
    </nav>
  );
}
