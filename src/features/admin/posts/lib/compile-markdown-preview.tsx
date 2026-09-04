import "server-only";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactNode } from "react";
import { mdxComponents } from "@/features/blog/components/MDXComponents";
import { MDXContentShell } from "@/features/blog/components/MDXContentShell";

export const compileMarkdownPreview = async (
  content: string,
): Promise<ReactNode> => {
  const { default: PreviewContent } = await evaluate(content, {
    ...runtime,
    format: "md",
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "tokyo-night",
          keepBackground: false,
        },
      ],
    ],
  });

  return (
    <MDXContentShell>
      <PreviewContent components={mdxComponents} />
    </MDXContentShell>
  );
};
