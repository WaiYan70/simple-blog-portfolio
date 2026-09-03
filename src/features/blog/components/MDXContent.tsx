import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "./MDXComponents";
import { MDXContentShell } from "./MDXContentShell";

type Props = {
  content: string;
};

export function MDXContent({ content }: Props) {
  return (
    <MDXContentShell>
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{
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
        }}
      />
    </MDXContentShell>
  );
}
