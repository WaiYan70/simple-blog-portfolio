"use client";

import { mdxComponents } from "@/features/blog/components/MDXComponents";
import { MDXContentShell } from "@/features/blog/components/MDXContentShell";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

type PostPreviewProps = {
  source: MDXRemoteSerializeResult;
};

export const PostPreview = ({ source }: PostPreviewProps) => {
  return (
    <MDXContentShell>
      <MDXRemote {...source} components={mdxComponents} />
    </MDXContentShell>
  );
};
