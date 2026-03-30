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

const DARK_CONFIG = {
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
};

const LIGHT_CONFIG = {
  theme: "default",
  themeVariables: {},
};

const DARK_BG = "#0f172a";
const LIGHT_BG = "#ffffff";

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

const injectStyles = () => {
  if (document.getElementById("txtshr-mermaid-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-mermaid-styles";
  style.textContent = `
    .txtshr-mermaid-toolbar {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      padding: 0.5rem 0;
    }
    .txtshr-mermaid-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      border-radius: 0.375rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s;
    }
    .txtshr-mermaid-btn:hover {
      background: #334155;
    }
  `;
  document.head.appendChild(style);
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();

  let isDark = true;
  let svgContent = "";

  // --- DOM structure ---
  const toolbar = document.createElement("div");
  toolbar.className = "txtshr-mermaid-toolbar";

  const diagramWrapper = document.createElement("div");
  diagramWrapper.style.cssText =
    "display:flex;justify-content:center;overflow-x:auto;padding:1rem 0;";

  el.appendChild(toolbar);
  el.appendChild(diagramWrapper);

  // --- Helpers ---
  const makeBtn = (label: string, onClick: () => void): HTMLButtonElement => {
    const b = document.createElement("button");
    b.className = "txtshr-mermaid-btn";
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  };

  const renderDiagram = (dark: boolean): Promise<void> => {
    const config = dark ? DARK_CONFIG : LIGHT_CONFIG;
    mermaid.initialize({ startOnLoad: false, ...config });
    const id = `txtshr-mermaid-${crypto.randomUUID()}`;
    return mermaid.render(id, text.trim()).then(({ svg }) => {
      svgContent = svg;
      diagramWrapper.innerHTML = svg;
      diagramWrapper.style.background = dark ? DARK_BG : LIGHT_BG;
    });
  };

  // --- Download SVG ---
  const downloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Download PNG ---
  const downloadPng = () => {
    if (!svgContent) return;
    const svgEl = diagramWrapper.querySelector("svg");
    if (!svgEl) return;

    const vb = svgEl.viewBox.baseVal;
    const rect = svgEl.getBoundingClientRect();
    const w = vb.width || rect.width || 800;
    const h = vb.height || rect.height || 600;
    const scale = 2;

    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
    ctx.fillStyle = isDark ? DARK_BG : LIGHT_BG;
    ctx.fillRect(0, 0, w, h);

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "diagram.png";
      a.click();
    };
    img.src = url;
  };

  // --- Theme toggle ---
  const toggleBtn = makeBtn("Light mode", () => {
    isDark = !isDark;
    toggleBtn.textContent = isDark ? "Light mode" : "Dark mode";
    renderDiagram(isDark).catch(console.error);
  });

  toolbar.appendChild(makeBtn("Download SVG", downloadSvg));
  toolbar.appendChild(makeBtn("Download PNG", downloadPng));
  toolbar.appendChild(toggleBtn);

  // --- Initial render ---
  loadMermaid()
    .then(() => renderDiagram(isDark))
    .catch((err) => {
      el.appendChild(errorEl(err instanceof Error ? err.message : "Failed to render diagram."));
    });
};

const errorEl = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
