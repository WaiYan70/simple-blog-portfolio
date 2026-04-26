"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  reveal?: boolean;
};

export function Section({ children, className, reveal = true }: SectionProps) {
  const [isVisible, setIsVisible] = useState(!reveal);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!reveal) return;

    const showSection = () => setIsVisible(true);
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      showSection();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showSection();
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    window.addEventListener("pageshow", showSection);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", showSection);
    };
  }, [reveal]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "my-12 space-y-6 transition-all duration-700 ease-out",
        reveal && !isVisible && "translate-y-6 opacity-0",
        reveal && isVisible && "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </section>
  );
}
