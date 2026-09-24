import "server-only";

import { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkHeadings from "@/features/admin/posts/lib/remark-headings.mjs";
import rehypePrettyCode from "rehype-pretty-code";
import { MDXContentShell } from "../components/MDXContentShell";
import { mdxComponents } from "../components/MDXComponents";

export async function renderMarkdown(content: string): Promise<ReactNode> {
  const { default: Content } = await evaluate(content, {
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
      <Content contents={mdxComponents} />
    </MDXContentShell>
  );
}
