"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // async avoids React warning
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center rounded-md transition hover:bg-muted/60 hover:scale-105 active:scale-95"
    >
      {/* BEFORE mount → neutral state */}
      <Sun
        className={`absolute transition-all duration-300 will-change-transform ${
          mounted && isDark
            ? "opacity-0 rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute transition-all duration-300 will-change-transform ${
          mounted && isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75"
        }`}
      />
    </Button>
  );
};
