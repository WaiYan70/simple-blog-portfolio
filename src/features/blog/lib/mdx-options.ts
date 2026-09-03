import { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

type MDXCompileOptions = NonNullable<MDXRemoteProps["options"]>;

export const mdxOptions: MDXCompileOptions = {
  blockJS: true,
  blockDangerousJS: true,
  mdxOptions: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "tokyo-night",
          keepBackground: false,
        },
      ],
    ],
  },
};
