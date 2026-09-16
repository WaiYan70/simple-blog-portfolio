import "server-only";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactNode } from "react";
import { mdxComponents } from "@/features/blog/components/MDXComponents";
import { MDXContentShell } from "@/features/blog/components/MDXContentShell";
import remarkHeadings from "./remark-headings.mjs";

export const compileMarkdownPreview = async (
  content: string,
): Promise<ReactNode> => {
  const { default: PreviewContent } = await evaluate(content, {
    ...runtime,
    format: "md",
    remarkPlugins: [remarkHeadings],
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
