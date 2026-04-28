import { Children, isValidElement, type ReactNode } from "react";

export const slugifyHeading = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

export const extractTextFromNode = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextFromNode(node.props.children);
  }

  return Children.toArray(node).map(extractTextFromNode).join("");
};
