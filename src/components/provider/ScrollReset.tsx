"use client";

import { useEffect } from "react";

export function ReloadScrollReset() {
  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0];

    if (
      navigation instanceof PerformanceNavigationTiming &&
      navigation.type === "reload"
    ) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
      });
    }
  }, []);

  return null;
}
