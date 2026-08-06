import type { RemoteRenderer } from "txtshr-renderer";

const STYLES = `
.txtshr-bionic {
  color: #cbd5e1;
  line-height: 1.75;
  font-size: 0.9375rem;
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
  white-space: pre-wrap;
}
.txtshr-bionic strong {
  color: #ffffff;
  font-weight: 900;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
}
`;

const injectStyles = (): void => {
  if (document.getElementById("txtshr-bionic-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-bionic-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
};

// Decide how many letters of a word should be bolded
function getBionicLength(wordLength: number): number {
  if (wordLength <= 3) return 1;
  if (wordLength <= 7) return 2;
  return 3;
}

// Apply bionic reading formatting to a single word
function bionify(word: string): string {
  // Extract leading non-alphanumeric characters
  const leadingMatch = word.match(/^[^\w]*/);
  const leading = leadingMatch ? leadingMatch[0] : "";
  const restStart = leading.length;

  // Extract trailing non-alphanumeric characters
  const trailingMatch = word.slice(restStart).match(/[^\w]*$/);
  const trailing = trailingMatch ? trailingMatch[0] : "";
  const restEnd = word.length - trailing.length;

  const core = word.slice(restStart, restEnd);
  if (!core) return word; // If no alphanumeric core, return as-is

  const bionifyLen = getBionicLength(core.length);
  const bolded = core.slice(0, bionifyLen);
  const normal = core.slice(bionifyLen);

  return leading + `<strong>${bolded}</strong>${normal}` + trailing;
}

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();
  el.className = "txtshr-bionic";

  // Split text into words while preserving whitespace and punctuation
  const words = text.split(/(\s+)/);
  const html = words.map((word) => {
    if (/^\s+$/.test(word)) {
      // Preserve whitespace as-is
      return word;
    }
    return bionify(word);
  }).join("");

  el.innerHTML = html;
};
