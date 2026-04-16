import Link from "next/link";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

export function BaseCard({ children, href, className }: BaseCardProps) {
  const baseStyle =
    "group block rounded-2xl border border-border bg-card p-4 transistion hover:bg-muted/40 hover:shadow-sm";

  if (href) {
    return (
      <Link href={href} className={cn(baseStyle, className)}>
        {children}
      </Link>
    );
  }

  return <div className={cn(baseStyle, className)}>{children}</div>;
}
