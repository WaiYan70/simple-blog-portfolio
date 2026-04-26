"use client";

import { useEffect } from "react";

export function ScrollControl() {
  useEffect(() => {
    const [navigation] = performance.getEntriesByType("navigation");

    if (
      navigation instanceof PerformanceNavigationTiming &&
      navigation.type === "reload"
    ) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
