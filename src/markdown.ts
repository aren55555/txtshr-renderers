import { marked } from "marked";

// Scoped CSS injected once per page. Styles are namespaced under .txtshr-md
// so they don't bleed into the host page.
const STYLES = `
.txtshr-md { color: #cbd5e1; line-height: 1.7; }
.txtshr-md h1, .txtshr-md h2, .txtshr-md h3,
.txtshr-md h4, .txtshr-md h5, .txtshr-md h6 {
  color: #f1f5f9; font-weight: 600; margin: 1.25rem 0 0.5rem;
}
.txtshr-md h1 { font-size: 1.5rem; }
.txtshr-md h2 { font-size: 1.25rem; }
.txtshr-md h3 { font-size: 1.1rem; }
.txtshr-md p  { margin: 0.75rem 0; }
.txtshr-md a  { color: #34d399; text-decoration: underline; }
.txtshr-md code {
  background: #0f172a; border: 1px solid #334155; border-radius: 4px;
  padding: 0.15em 0.4em; font-family: monospace; font-size: 0.875em; color: #94a3b8;
}
.txtshr-md pre {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;
  padding: 1rem; overflow-x: auto; margin: 0.75rem 0;
}
.txtshr-md pre code { background: none; border: none; padding: 0; color: #e2e8f0; }
.txtshr-md ul, .txtshr-md ol { padding-left: 1.5rem; margin: 0.75rem 0; }
.txtshr-md li { margin: 0.3rem 0; }
.txtshr-md blockquote {
  border-left: 3px solid #475569; padding-left: 1rem;
  color: #94a3b8; margin: 0.75rem 0;
}
.txtshr-md table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
.txtshr-md th, .txtshr-md td {
  border: 1px solid #334155; padding: 0.5rem 0.75rem; text-align: left;
}
.txtshr-md th { background: #1e293b; color: #e2e8f0; font-weight: 600; }
.txtshr-md hr { border: none; border-top: 1px solid #334155; margin: 1rem 0; }
.txtshr-md img { max-width: 100%; border-radius: 6px; }
`;

function injectStyles(): void {
  if (document.getElementById("txtshr-md-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-md-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
}

export function render(el: HTMLElement, text: string): void {
  injectStyles();
  el.className = "txtshr-md";
  el.innerHTML = marked.parse(text) as string;
}
