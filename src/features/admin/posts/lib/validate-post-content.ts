import "server-only"
import { compile } from "@mdx-js/mdx";
import rehypeMermaid from "@/features/shared/lib/rehype-mermaid.mjs";
import rehypePrettyCode from "rehype-pretty-code";


type PostContentValidationResult =
  | { success: true }
  | { success: false; message: string };

type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
};

class UnsupportMarkdownError extends Error {
  constructor() {
    super(
      "Raw HTML is not supported. Use Markdown syntax, or put HTML examples in fenced code blocks.",
    );
    this.name = "UnsupportMarkdownError";
  }
}

const remarkRejectHTML = () => {
  const walk = (node: MarkdownNode) => {
    if (node.type === "html") {
      return;
    }
    for (const child of node?.children ?? []) {
      walk(child)
    }
  }
  return walk;
}

export const validatePostContent = async (
  content: string,
): Promise<PostContentValidationResult> => {
  try {
    await compile(content, {
      format: "md",
      remarkPlugins: [remarkRejectHTML],
      rehypePlugins: [
        rehypeMermaid,
        [
          rehypePrettyCode,
          {
            theme: "tokyo-night",
            keepBackground: false
          },
        ],
      ],
    });
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof UnsupportMarkdownError
          ? error.message
          : "Unable to compile Markdown content",
    }
  }
}
