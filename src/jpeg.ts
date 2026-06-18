// Renders a base64-encoded JPEG as an inline image.
//
// Usage: pipe a JPEG through base64 before encrypting:
//   base64 -i photo.jpg | txtshr --renderer aren55555/txtshr-renderers/jpeg
//
// The decrypted text is expected to be a raw base64 string (no data URI prefix).

import type { RemoteRenderer } from "txtshr-renderer";

const STYLES = `
.txtshr-jpeg-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; cursor: pointer;
}
.txtshr-jpeg-overlay img {
  max-width: 90vw; max-height: 90vh; border-radius: 8px; cursor: default;
}
`;

const injectStyles = (): void => {
  if (document.getElementById("txtshr-jpeg-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-jpeg-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();

  const src = `data:image/jpeg;base64,${text.trim()}`;

  const img = document.createElement("img");
  img.src = src;
  img.alt = "Shared image";
  img.style.cssText =
    "display:block;max-width:100%;border-radius:8px;margin:0 auto;cursor:pointer;";

  img.onerror = () => {
    img.replaceWith(error("Could not decode image — the content may not be a valid base64-encoded JPEG."));
  };

  img.onclick = () => openFullscreen(src);

  el.appendChild(img);
};

const openFullscreen = (src: string): void => {
  const overlay = document.createElement("div");
  overlay.className = "txtshr-jpeg-overlay";

  const full = document.createElement("img");
  full.src = src;
  full.alt = "Shared image";
  overlay.appendChild(full);

  const close = (): void => {
    overlay.remove();
    document.removeEventListener("keydown", onKeydown);
  };

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") close();
  };

  overlay.onclick = close;
  document.addEventListener("keydown", onKeydown);

  document.body.appendChild(overlay);
};

const error = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
