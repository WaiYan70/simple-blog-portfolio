import type { MDXComponents } from "mdx/types";
import {
  extractTextFromNode,
  slugifyHeading,
} from "@/features/blog/lib/heading";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-3xl font-bold mt-10 mb-4 tracking-tight" {...props} />
  ),
  h2: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h2
        id={slug}
        className="scroll-mt-24 text-2xl font-semibold mt-8 mb-3 tracking-tight"
        {...props}
      />
    );
  },
  h3: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h3
        id={slug}
        className="scroll-mt-24 text-xl font-semibold mt-6 mb-2 tracking-tight"
        {...props}
      />
    );
  },
  h4: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h4
        id={slug}
        className="scroll-mt-24 text-lg font-semibold mt-4 mb-1 tracking-tight"
        {...props}
      />
    );
  },
  p: (props) => (
    <p className="leading-7 text-muted-foreground mb-4" {...props} />
  ),
  a: (props) => (
    <a
      className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition"
      {...props}
    />
  ),
  code: ({ children, ...props }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
      {children}
    </code>
  ),

  pre: (props) => (
    <pre
      className="my-6 rounded-xl border border-border bg-muted px-3 py-5 overflow-x-auto"
      {...props}
    />
  ),

  ul: (props) => (
    <ul className="my-4 list-disc pl-6 text-muted-foreground" {...props} />
  ),

  ol: (props) => (
    <ol className="my-4 list-decimal pl-6 text-muted-foreground" {...props} />
  ),

  li: (props) => <li className="mb-1" {...props} />,

  hr: () => <hr className="my-8 border-border" />,
};
