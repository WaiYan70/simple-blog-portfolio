import type { ReactNode } from "react";

type MDXContentShellProps = {
  children: ReactNode;
};

export const MDXContentShell = ({ children }: MDXContentShellProps) => {
  return (
    <div className="prose mt-8 max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:rounded-2xl prose-pre:border prose-pre:border-border prose-pre:bg-muted/50 dark:prose-invert">
      {children}
    </div>
  );
};
