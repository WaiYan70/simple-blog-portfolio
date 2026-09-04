import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter"],
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
