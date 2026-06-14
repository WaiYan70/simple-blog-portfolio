"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  iconClassName?: string;
};

export const ThemeToggle = ({
  className,
  iconClassName,
}: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const themeIconClassName = cn(
    "absolute z-10 size-4 transition-transform duration-700 ease-out",
    iconClassName,
  );

  useEffect(() => {
    // async avoids React warning
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center justify-center rounded-md transition-colors duration-700 ease-out hover:scale-105 hover:bg-muted/60 active:scale-95",
        className,
      )}
    >
      <Sun
        className={`
          ${themeIconClassName}
          ${isDark ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"}
        `}
      />

      <Moon
        className={`
          ${themeIconClassName}
          ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"}
        `}
      />
    </Button>
  );
};
