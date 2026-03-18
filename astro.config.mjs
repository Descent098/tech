import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

function mermaidTransform() {
  return (tree) => {
    const visit = (node, _) => {
      if (
        node.type === "element" &&
        node.tagName === "pre" &&
        node.children?.[0]?.tagName === "code"
      ) {
        const codeNode = node.children[0];
        const classList = codeNode.properties?.className || [];

        if (classList.includes("language-mermaid")) {
          const code = codeNode.children?.[0]?.value || "";

          // Replace entire <pre> with <div class="mermaid">
          node.tagName = "div";
          node.properties = { className: ["mermaid"] };
          node.children = [{ type: "text", value: code }];
        }
      }

      if (node.children) {
        node.children.forEach((child) => visit(child, node));
      }
    };

    visit(tree, null);
  };
}

export default defineConfig({
  site: 'https://kieranwood.ca',
  base: '/tech',

  markdown: {
    syntaxHighlight: {
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [mermaidTransform],
  },

  integrations: [
    mdx(),
    sitemap(),
    tailwind()
  ],
});