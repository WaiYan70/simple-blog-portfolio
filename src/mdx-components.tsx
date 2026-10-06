import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "./features/shared/markdown/MDXComponents";

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
