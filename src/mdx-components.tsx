import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/features/blog/components/MDXComponents";

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
