import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Each entry becomes a self-contained ESM bundle under dist/.
      // The txtshr viewer resolves renderer specs to:
      //   https://cdn.jsdelivr.net/gh/<owner>/<repo>@<version>/dist/<name>.js
      entry: {
        markdown: "src/markdown.ts",
        jpeg: "src/jpeg.ts",
        mermaid: "src/mermaid.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        // Stable filenames — no content hashes — so jsDelivr URLs are predictable.
        entryFileNames: "[name].js",
        // Bundle all dependencies into each file so the module is self-contained.
        // Nothing is marked external: the renderer must work without any imports
        // being resolved by the host page.
      },
    },
  },
});
