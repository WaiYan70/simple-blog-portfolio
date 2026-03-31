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
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center rounded-md transition hover:bg-muted"
    >
      {/* BEFORE mount → neutral state */}
      <Sun
        className={`absolute transition-all duration-200 ${
          mounted && isDark ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute transition-all duration-200 ${
          mounted && isDark ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
        }`}
      />
    </Button>
  );
};
