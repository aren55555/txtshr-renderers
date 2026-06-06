// Renders a magnet link with Open and Copy actions.
//
// Usage: pipe a magnet URI through txtshr:
//   echo "magnet:?xt=urn:btih:..." | txtshr --renderer aren55555/txtshr-renderers/magnet
//
// The decrypted text is expected to be a raw magnet URI.

import type { RemoteRenderer } from "txtshr-renderer";

const injectStyles = () => {
  if (document.getElementById("txtshr-magnet-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-magnet-styles";
  style.textContent = `
    .txtshr-magnet { font-family: inherit; }
    .txtshr-magnet-toolbar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .txtshr-magnet-btn {
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
    .txtshr-magnet-btn:hover { background: #334155; }
    .txtshr-magnet-text {
      word-break: break-all;
      font-family: monospace;
      font-size: 0.8125rem;
      color: #94a3b8;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.875rem 1rem;
    }
  `;
  document.head.appendChild(style);
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();
  el.className = "txtshr-magnet";

  const uri = text.trim();

  if (!uri.startsWith("magnet:?")) {
    el.appendChild(error("Invalid magnet link — content must begin with \"magnet:?\"."));
    return;
  }

  const toolbar = document.createElement("div");
  toolbar.className = "txtshr-magnet-toolbar";

  const openBtn = document.createElement("a");
  openBtn.href = uri;
  openBtn.className = "txtshr-magnet-btn";
  openBtn.textContent = "Open Torrent";

  const copyBtn = document.createElement("button");
  copyBtn.className = "txtshr-magnet-btn";
  copyBtn.textContent = "Copy";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(uri).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
    });
  });

  toolbar.appendChild(openBtn);
  toolbar.appendChild(copyBtn);

  const display = document.createElement("div");
  display.className = "txtshr-magnet-text";
  display.textContent = uri;

  el.appendChild(toolbar);
  el.appendChild(display);
};

const error = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
