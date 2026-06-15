// Renders a spinning wheel from a list of options, one per line. Clicking
// "Spin the Wheel" spins the wheel, slows down, and lands on a random
// winner.
//
// Usage: pipe newline-separated options through txtshr:
//   printf "Pizza\nSushi\nTacos\nBurgers" | txtshr --renderer aren55555/txtshr-renderers/spinner

import type { RemoteRenderer } from "txtshr-renderer";

const COLORS = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#22d3ee", "#fb923c"];

const injectStyles = (): void => {
  if (document.getElementById("txtshr-spinner-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-spinner-styles";
  style.textContent = `
    .txtshr-spinner { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; font-family: inherit; }
    .txtshr-spinner-wheel-wrap { position: relative; width: 100%; max-width: 480px; aspect-ratio: 1 / 1; container-type: inline-size; }
    .txtshr-spinner-wheel {
      display: block; width: 100%; height: 100%; transform-origin: 50% 50%;
      transition: transform 4.5s cubic-bezier(0.21, 0.83, 0.21, 1);
    }
    .txtshr-spinner-wheel text {
      fill: #0f172a; font-weight: 600; font-family: inherit;
    }
    .txtshr-spinner-pointer {
      position: absolute; top: -0.7cqw; left: 50%; transform: translateX(-50%);
      width: 0; height: 0; z-index: 1;
      border-left: 4cqw solid transparent; border-right: 4cqw solid transparent;
      border-top: 5.7cqw solid #f1f5f9;
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.4));
    }
    .txtshr-spinner-btn {
      background: #34d399; color: #022c22; border: none; border-radius: 0.5rem;
      padding: 0.625rem 1.5rem; font-size: 0.875rem; font-weight: 700;
      letter-spacing: 0.03em; text-transform: uppercase; cursor: pointer;
      font-family: inherit; transition: opacity 0.15s, background 0.15s;
    }
    .txtshr-spinner-btn:not(:disabled):hover { background: #6ee7b7; }
    .txtshr-spinner-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .txtshr-spinner-result {
      color: #f1f5f9; font-size: 1.0625rem; font-weight: 600; min-height: 1.5em;
      margin: 0; text-align: center; opacity: 0; transform: scale(0.9);
      transition: opacity 0.3s, transform 0.3s;
    }
    .txtshr-spinner-result.show { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);
};

const errorEl = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};

// 0deg = top (12 o'clock), increasing clockwise — matches the pointer at the
// top of the wheel and CSS rotate()'s clockwise-for-positive-degrees convention.
const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
};

const pieSlicePath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
  const p1 = polarToCartesian(cx, cy, r, startAngle);
  const p2 = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();

  const options = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (options.length < 2) {
    el.appendChild(errorEl("Need at least 2 options, one per line, to build a spinner."));
    return;
  }

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const segAngle = 360 / options.length;
  const fontSize = options.length <= 4 ? 13 : options.length <= 8 ? 11 : 9;
  const textRadius = r * 0.62;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("txtshr-spinner-wheel");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  options.forEach((option, i) => {
    const start = i * segAngle;
    const end = start + segAngle;

    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute("d", pieSlicePath(cx, cy, r, start, end));
    slice.setAttribute("fill", COLORS[i % COLORS.length]!);
    slice.setAttribute("stroke", "#0f172a");
    slice.setAttribute("stroke-width", "2");
    svg.appendChild(slice);

    const center = start + segAngle / 2;
    const { x, y } = polarToCartesian(cx, cy, textRadius, center);
    const rotation = center > 90 && center < 270 ? center + 180 : center;

    const chordLen = 2 * textRadius * Math.sin((segAngle * Math.PI) / 360);
    const maxChars = Math.max(3, Math.floor(chordLen / (fontSize * 0.6)));
    const label = option.length > maxChars ? `${option.slice(0, maxChars - 1)}…` : option;

    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute("x", String(x));
    textEl.setAttribute("y", String(y));
    textEl.setAttribute("font-size", String(fontSize));
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("transform", `rotate(${rotation} ${x} ${y})`);
    textEl.textContent = label;
    svg.appendChild(textEl);
  });

  const container = document.createElement("div");
  container.className = "txtshr-spinner";

  const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ring.setAttribute("cx", String(cx));
  ring.setAttribute("cy", String(cy));
  ring.setAttribute("r", String(r - 1));
  ring.setAttribute("fill", "none");
  ring.setAttribute("stroke", "#1e293b");
  ring.setAttribute("stroke-width", "2");
  svg.appendChild(ring);

  const hub = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hub.setAttribute("cx", String(cx));
  hub.setAttribute("cy", String(cy));
  hub.setAttribute("r", "16");
  hub.setAttribute("fill", "#1e293b");
  hub.setAttribute("stroke", "#475569");
  hub.setAttribute("stroke-width", "2");
  svg.appendChild(hub);

  const wheelWrap = document.createElement("div");
  wheelWrap.className = "txtshr-spinner-wheel-wrap";

  const pointer = document.createElement("div");
  pointer.className = "txtshr-spinner-pointer";

  wheelWrap.appendChild(svg);
  wheelWrap.appendChild(pointer);

  const button = document.createElement("button");
  button.className = "txtshr-spinner-btn";
  button.textContent = "Spin the Wheel";

  const result = document.createElement("p");
  result.className = "txtshr-spinner-result";

  button.addEventListener("click", () => {
    button.disabled = true;

    const winnerIndex = Math.floor(Math.random() * options.length);
    const winnerCenter = winnerIndex * segAngle + segAngle / 2;
    const spins = 5;
    const rotation = spins * 360 + (360 - winnerCenter);

    svg.style.transform = `rotate(${rotation}deg)`;
    svg.addEventListener(
      "transitionend",
      () => {
        result.textContent = `🎉 ${options[winnerIndex]}`;
        result.classList.add("show");
      },
      { once: true },
    );
  });

  container.appendChild(wheelWrap);
  container.appendChild(button);
  container.appendChild(result);
  el.appendChild(container);
};
