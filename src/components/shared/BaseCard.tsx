import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  radis?: "none" | "md" | "lg" | "xl" | "top";
  onClick?: (event: MouseEvent<HTMLElement>) => void;
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
  radis = "xl",
  onClick,
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
        onClick={(event) => onClick?.(event)}
        className={cn(
          baseStyle,
          className,
          variants[variant],
          radiusStyle[radis],
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        baseStyle,
        className,
        variants[variant],
        radiusStyle[radis],
      )}
    >
      {children}
    </div>
  );
}
