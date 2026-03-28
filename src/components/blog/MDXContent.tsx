import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "./MDXComponents";

type Props = {
  content: string;
};

export const MDXContent = ({ content }: Props) => {
  return (
    <div className="prose dark:prose-invert">
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: "one-dark-pro",
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
};
