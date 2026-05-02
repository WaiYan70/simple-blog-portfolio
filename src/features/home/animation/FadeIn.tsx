"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay }: Props) {
  const [visible, setVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const transitionDelay = hasRevealed ? "0ms" : `${delay ?? 0}ms`;

  useEffect(() => {
    const showContent = () => setVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showContent();
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    window.addEventListener("pageshow", showContent);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", showContent);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay }}
      onTransitionEnd={(event) => {
        if (event.propertyName === "opacity") {
          setHasRevealed(true);
        }
      }}
      className={cn(
        "transition-[opacity,translate,transform] duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
