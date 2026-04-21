"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const iconClassName =
    "absolute h-4 w-4 transition-transform duration-700 ease-out";

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
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center rounded-md transition-colors duration-700 ease-out hover:bg-muted/60 hover:scale-105 active:scale-95"
    >
      <Sun
        className={`
          ${iconClassName}
          ${isDark ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"}
        `}
      />

      <Moon
        className={`
          ${iconClassName}
          ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"}
        `}
      />
    </Button>
  );
};
