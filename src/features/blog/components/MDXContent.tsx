import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./MDXComponents";
import { MDXContentShell } from "./MDXContentShell";
import { mdxOptions } from "../lib/mdx-options";

type Props = {
  content: string;
};

export function MDXContent({ content }: Props) {
  return (
    <MDXContentShell>
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={mdxOptions}
      />
    </MDXContentShell>
  );
}
