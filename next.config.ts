import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      resolve(
        process.cwd(),
        "src/features/admin/posts/lib/remark-headings.mjs",
      )
    ],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "tokyo-night",
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
