import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  radius?: "none" | "md" | "lg" | "xl" | "xxl" | "top";
};

const radiusStyle = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  xxl: "rounded-2xl",
  top: "rounded-t-2xl",
};

export function BaseCard({
  children,
  href,
  className,
  variant = "default",
  radius = "xl",
}: BaseCardProps) {
  const baseStyle =
    "group block transition-all duration-200 active:scale-[0.98]";

  const variants = {
    default: "border border-border bg-card hover:bg-muted/40 hover:shadow-sm",
    ghost: "hover:bg-muted/30",
    outline: "border border-border hover:border-primary/50",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseStyle,
          className,
          variants[variant],
          radiusStyle[radius],
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        baseStyle,
        className,
        variants[variant],
        radiusStyle[radius],
      )}
    >
      {children}
    </div>
  );
}
