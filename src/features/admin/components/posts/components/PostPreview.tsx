"use client";

import { mdxComponents } from "@/features/blog/components/MDXComponents";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

type PostPreviewProps = {
  source: MDXRemoteSerializeResult;
};

export const PostPreview = ({ source }: PostPreviewProps) => {
  return (
    <div className="prose mt-8 max-w-none dark:prose-invert">
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  );
};
