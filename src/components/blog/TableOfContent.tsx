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

      const current = visibleHeadings.find((element) => {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });

      if (current) {
        setActiveId(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <nav>
      {headings.map((h) => (
        <a
          key={h.slug}
          href={`#${h.slug}`}
          className={`block transition ${activeId === h.slug ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
};
