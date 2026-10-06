import "server-only";

import { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";

import remarkHeadings from "./remark-headings.mjs";
import { MDXContentShell } from "../markdown/MDXContentShell";
import { mdxComponents } from "../markdown/MDXComponents";

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
      <Content components={mdxComponents} />
    </MDXContentShell>
  );
}
