const rehypeMermaid = () => {
  /** @param {import("hast").Root | import("hast").RootContent} node */
  const walk = (node) => {
    if (node.type !== "root" && node.type !== "element") return;

    if (node.type === "element" && node.tagName === "pre") {
      const code = node.children[0];
      if (code?.type === "element" && code.tagName === "code") {
        const classes = code.properties.className;
        if (Array.isArray(classes) && classes.includes("language-mermaid")) {
          node.tagName = "mermaid-diagram";
          node.properties = {
            chart: code.children
              .map((child) => (child.type === "text" ? child.value : ""))
              .join("")
              .trim(),
          };
          node.children = [];
          return;
        }
      }
    }
    for (const child of node.children) {
      walk(child);
    }
  };
  return walk;
};

export default rehypeMermaid;
