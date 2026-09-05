import "server-only";

import { compile } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";

type PostContentValidationResult =
  | { success: true }
  | { success: false; message: string };

export const validatePostContent = async (
  content: string,
): Promise<PostContentValidationResult> => {
  try {
    await compile(content, {
      format: "mdx",
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
    return { success: true };
  } catch {
    return {
      success: false,
      message: "This content contains invalid MDX syntax",
    };
  }
}
