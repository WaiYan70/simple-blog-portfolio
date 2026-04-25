"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { flushSync } from "react-dom";

export function useViewTransitionRouter() {
  const router = useRouter();

  const push = useCallback(
    (href: string) => {
      // Fallback for unsupported browsers.
      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(() => {
        flushSync(() => {
          router.push(href);
        });
      });
    },
    [router],
  );

  return { push };
}
