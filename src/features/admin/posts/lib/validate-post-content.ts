import "server-only";

import { compile } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import { resolve } from "node:path";
import rehypeMermaid from "@/features/shared/lib/rehype-mermaid.mjs";

type PostContentValidationResult =
  | { success: true }
  | { success: false; message: string };


  type MarkdownNode = {
    type: string;
    children?: MarkdownNode[];
  };

  const blockedNodeTypes = new Set([
    "mdxjsEsm", // import and export statements
    "mdxFlowExpression", // standalone {expressions}
    "mdxTextExpression", // inline {expressions}
    "mdxJsxFlowElement", // standalone JSX / HTML
    "mdxJsxTextElement", // inline JSX / HTML
  ]);

  class UnsupportedMarkdownError extends Error {
    constructor() {
      super(
        "Use Markdown only. JavaScript expressions, imports, exports, " +
          "and JSX/HTML tags are not supported. " +
          "Wrap code examples in backticks or fenced code blocks.",
      );
      this.name = "UnsupportedMarkdownError";
    }
  }

  const remarkMarkdownOnly = () => {
    const checkNode = (node: MarkdownNode): void => {
      if (blockedNodeTypes.has(node.type)) {
        throw new UnsupportedMarkdownError();
      }

      for (const child of node.children ?? []) {
        checkNode(child);
      }
    };

    return checkNode;
  };

export const validatePostContent = async (
  content: string,
): Promise<PostContentValidationResult> => {
  try {
    await compile(content, {
      format: "mdx",
      remarkPlugins: [remarkMarkdownOnly],
      rehypePlugins: [
        rehypeMermaid,
        [
          rehypePrettyCode,
          {
            theme: "tokyo-night",
            keepBackground: false,
          },
        ],
      ],
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof UnsupportedMarkdownError
          ? error.message
          : "This content contains invalid MDX syntax",
    };
  }
}
