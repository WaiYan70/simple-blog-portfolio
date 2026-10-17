"use client";

import { useEffect, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

type DiagramResult =
  | { chart: string; status: "success"; svg: string }
  | { chart: string; status: "error" };

let initialized = false;

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const [result, setResult] = useState<DiagramResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    const renderDiagram = async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            suppressErrorRendering: true,
            theme: "neutral",
          });
          initialized = true;
        }
        if (cancelled) return;
        const { svg } = await mermaid.render(
          `mermaid-${crypto.randomUUID()}`,
          chart,
        );
        if (!cancelled) {
          setResult({ chart, status: "success", svg });
        }
      } catch {
        if (!cancelled) {
          setResult({ chart, status: "error" });
        }
      }
    };

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  const current = result?.chart === chart ? result : null;

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-xl border bg-white p-4 text-zinc-950">
      {!current && <p role="status">Rendering diagram...</p>}
      {current?.status === "error" && (
        <>
          <p role="alert">Unable to render this diagram.</p>
          <pre className="mt-3 overflow-x-auto text-sm">
            <code>{chart}</code>
          </pre>
        </>
      )}
    </figure>
  );
};
