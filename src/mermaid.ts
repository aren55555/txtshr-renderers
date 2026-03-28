// Renders a Mermaid diagram from its source text.
//
// Usage: pipe diagram source through txtshr:
//   cat diagram.mmd | txtshr --renderer aren55555/txtshr-renderers/mermaid
//
// The decrypted text is expected to be raw Mermaid diagram syntax.

import type { RemoteRenderer } from "txtshr-renderer";

declare const mermaid: {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

const loadMermaid = (): Promise<void> => {
  if (typeof mermaid !== "undefined") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Mermaid from CDN"));
    document.head.appendChild(script);
  });
};

export const render: RemoteRenderer["render"] = (el, text) => {
  loadMermaid()
    .then(() => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#0f172a",
          primaryColor: "#1e293b",
          primaryTextColor: "#cbd5e1",
          primaryBorderColor: "#334155",
          lineColor: "#475569",
          secondaryColor: "#1e293b",
          tertiaryColor: "#0f172a",
        },
      });

      const id = `txtshr-mermaid-${crypto.randomUUID()}`;
      return mermaid.render(id, text.trim());
    })
    .then(({ svg }) => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText =
        "display:flex;justify-content:center;overflow-x:auto;padding:1rem 0;";
      wrapper.innerHTML = svg;
      el.appendChild(wrapper);
    })
    .catch((err) => {
      el.appendChild(error(err instanceof Error ? err.message : "Failed to render diagram."));
    });
};

const error = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
