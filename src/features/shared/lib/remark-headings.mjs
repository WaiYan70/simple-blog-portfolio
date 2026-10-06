/**
 * @typedef {{
 *   type: string;
 *   depth?: number;
 *   value?: string;
 *   alt?: string | null;
 *   children?: MarkdownNode[];
 *   data?: { hProperties?: Record<string, unknown> };
 * }} MarkdownNode
 */

/** @param {MarkdownNode} node @returns {string} */
const headingText = (node) => {
  if (node.type === "text" || node.type === "inlineCode") {
    return node.value ?? "";
  }

  if (node.type === "image" || node.type === "imageReference") {
    return node.alt ?? "";
  }

  if (node.type === "break") return " ";

  return (node.children ?? []).map(headingText).join("");
};

/**
 * Assign heading IDs and return table-of-contents entries.
 * @param {MarkdownNode} tree
 * @returns {{ text: string; slug: string; level: number }[]}
 */
export const collectHeadings = (tree) => {
  /** @type {{ text: string; slug: string; level: number }[]} */
  const headings = [];

  // A fresh set for each document.
  const usedIds = new Set();

  /** @param {MarkdownNode} node */
  const walk = (node) => {
    if (node.type === "heading" && node.depth !== undefined) {
      const text = headingText(node);

      const base =
        text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") || "section";

      let slug = base;
      let suffix = 1;

      while (usedIds.has(slug)) {
        slug = `${base}-${suffix++}`;
      }

      usedIds.add(slug);

      // The MDX compiler passes this ID to the rendered heading.
      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          id: slug,
        },
      };

      if (node.depth >= 2) {
        headings.push({ text, slug, level: node.depth });
      }
    }

    for (const child of node.children ?? []) {
      walk(child);
    }
  };

  walk(tree);
  return headings;
};

const remarkHeadings = () => {
  /** @param {MarkdownNode} tree */
  const transform = (tree) => {
    collectHeadings(tree);
  };

  return transform;
};

export default remarkHeadings;
