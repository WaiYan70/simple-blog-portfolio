import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "./MDXComponents";

type Props = {
  content: string;
};

export const MDXContent = ({ content }: Props) => {
  return (
    <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:rounded-2xl prose-pre:border prose-pre:border-border prose-pre:bg-muted/50 dark:prose-invert">
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
    </div>
  );
};
