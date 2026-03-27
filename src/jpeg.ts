// Renders a base64-encoded JPEG as an inline image.
//
// Usage: pipe a JPEG through base64 before encrypting:
//   base64 -i photo.jpg | txtshr --renderer aren55555/txtshr-renderers/jpeg
//
// The decrypted text is expected to be a raw base64 string (no data URI prefix).

export function render(el: HTMLElement, text: string): void {
  const img = document.createElement("img");
  img.src = `data:image/jpeg;base64,${text.trim()}`;
  img.alt = "Shared image";
  img.style.cssText =
    "display:block;max-width:100%;border-radius:8px;margin:0 auto;";

  img.onerror = () => {
    img.replaceWith(error("Could not decode image — the content may not be a valid base64-encoded JPEG."));
  };

  el.appendChild(img);
}

function error(msg: string): HTMLParagraphElement {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
}
