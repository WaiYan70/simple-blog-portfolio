import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  content: string;
};

export const MDXContent = ({ content }: Props) => {
  return (
    <div className="prose dark:prose-invert">
      <MDXRemote source={content} />
    </div>
  );
};
