"use client";

import { mdxComponents } from "@/features/blog/components/MDXComponents";
import { MDXRemote } from "next-mdx-remote/rsc";
import { sources } from "next/dist/compiled/webpack/webpack";

export const PostPreview = () => {
  return (
    <div className="prose mt-8 max-w-none dark:prose-invert">
      <MDXRemote {...sources} components={mdxComponents} />
    </div>
  );
};
