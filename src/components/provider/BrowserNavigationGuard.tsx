/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

export function BrowserNavigationGuard() {
  return (
    <Script
      id="browser-navigation-guard"
      src="/browser-navigation-guard.js"
      strategy="beforeInteractive"
    />
  );
}
