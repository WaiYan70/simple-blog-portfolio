import type { MDXComponents } from "mdx/types";
import { extractTextFromNode, slugifyHeading } from "@/lib/heading";

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h2
        id={slug}
        className="scroll-mt-24 text-xl font-semibold mt-6 mb-3"
        {...props}
      />
    );
  },
  h3: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h3
        id={slug}
        className="scroll-mt-24 text-lg font-semibold mt-5 mb-2"
        {...props}
      />
    );
  },
  h4: (props) => {
    const slug = slugifyHeading(extractTextFromNode(props.children));

    return (
      <h4
        id={slug}
        className="scroll-mt-24 text-base font-semibold mt-4 mb-2"
        {...props}
      />
    );
  },
  p: (props) => <p className="leading-7 text-muted-foreground" {...props} />,
  a: (props) => (
    <a className="text-primary underline hover:opacity-80" {...props} />
  ),
  code: (props) => (
    <code
      className="bg-muted px-1 py-0.5 rounded font-mono text-sm"
      {...props}
    />
  ),

  pre: (props) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto" {...props} />
  ),
};
