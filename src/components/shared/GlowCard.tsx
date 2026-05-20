"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlowCard({ children, className }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    const normalizeAngle = (angle + 360) % 360;

    card.style.setProperty("--start", `${normalizeAngle + 60}deg`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative h-full overflow-hidden rounded-xl p-px [--start:0deg]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-xl bg-[conic-gradient(from_var(--start),transparent_0deg,var(--primary)_70deg,transparent_140deg)]" />
      </div>
      <div className="relative z-10 h-full rounded-[calc(var(--radius-xl)-1px)] border border-border bg-card p-5 transition-colors group-hover:border-primary/25 sm:p-6">
        {children}
      </div>
    </div>
  );
}
