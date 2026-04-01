"use client";

import { Heading } from "@/types/post";
import { useEffect, useState } from "react";

type Props = {
  headings: Heading[];
};

export const TableOfContents = ({ headings }: Props) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) =>
        document.getElementById(h.slug),
      );

      const visibleHeadings = headingElements.filter(Boolean);

      let currentId = "";

      for (const element of visibleHeadings) {
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= 100) {
          currentId = element.id;
        }
      }

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

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
            className={`absolute -left-4 top-1/2 h-4 w-[2px] -translate-y-1/2 ${
              activeId === h.slug ? "bg-primary" : "bg-transparent"
            }`}
          />
          {h.text}
        </a>
      ))}
    </nav>
  );
};
