// Renders a question with named options. Selecting an option and clicking
// "Confirm <option>" reports the result back by redirecting to submitUrl
// with the original token and the chosen answer in the URL fragment — see
// src/lib/respond.ts for why.
//
// The decrypted text is expected to be a JWT (header.payload.signature)
// whose payload looks like:
//   {
//     "kind": "decision",
//     "question": "Where should we eat tonight?",
//     "options": ["Pizza Place", "Sushi Bar", "Taco Truck"],
//     "submitUrl": "https://api.example.com/decisions/abc123",
//     "exp": 1750000000          // optional, unix seconds
//   }

import type { RemoteRenderer } from "txtshr-renderer";
import { type BaseRespondPayload, buildRedirectUrl, decodeJwtPayload, isExpired, isHttpUrl } from "./lib/respond";

interface DecisionPayload extends BaseRespondPayload {
  kind: "decision";
  question: string;
  options: string[];
}

const injectStyles = (): void => {
  if (document.getElementById("txtshr-decision-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-decision-styles";
  style.textContent = `
    .txtshr-decision { font-family: inherit; }
    .txtshr-decision-question {
      color: #f1f5f9; font-size: 1.0625rem; font-weight: 600;
      margin: 0 0 1rem; line-height: 1.5;
    }
    .txtshr-decision-options {
      display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;
    }
    .txtshr-decision-option {
      background: #0f172a; border: 1px solid #334155; color: #cbd5e1;
      border-radius: 0.5rem; padding: 0.625rem 0.875rem; font-size: 0.9375rem;
      text-align: left; cursor: pointer; font-family: inherit;
      transition: border-color 0.15s, background 0.15s, color 0.15s;
    }
    .txtshr-decision-option:hover { border-color: #475569; }
    .txtshr-decision-option.selected {
      border-color: #34d399; background: #064e3b; color: #f1f5f9;
    }
    .txtshr-decision-confirm {
      background: #34d399; color: #022c22; border: none; border-radius: 0.5rem;
      padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 700;
      letter-spacing: 0.03em; text-transform: uppercase; cursor: pointer;
      font-family: inherit; transition: opacity 0.15s;
    }
    .txtshr-decision-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
};

const parsePayload = (token: string): DecisionPayload => {
  const payload = decodeJwtPayload(token);

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Invalid token — payload is not an object.");
  }

  const { kind, question, options, submitUrl, exp } = payload as Record<string, unknown>;

  if (kind !== "decision") {
    throw new Error(`Invalid token — expected kind "decision", got ${JSON.stringify(kind)}.`);
  }
  if (typeof question !== "string" || !question.trim()) {
    throw new Error("Invalid token — missing \"question\" claim.");
  }
  if (
    !Array.isArray(options) ||
    options.length < 2 ||
    !options.every((o) => typeof o === "string" && o.trim())
  ) {
    throw new Error("Invalid token — \"options\" claim must list at least 2 named options.");
  }
  if (typeof submitUrl !== "string" || !isHttpUrl(submitUrl)) {
    throw new Error("Invalid token — missing or invalid \"submitUrl\" claim.");
  }
  if (exp !== undefined && typeof exp !== "number") {
    throw new Error("Invalid token — \"exp\" claim must be a number.");
  }

  return { kind, question, options: options as string[], submitUrl, exp };
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();
  el.className = "txtshr-decision";

  const token = text.trim();

  let payload: DecisionPayload;
  try {
    payload = parsePayload(token);
  } catch (err) {
    el.appendChild(errorEl(err instanceof Error ? err.message : "Could not parse decision token."));
    return;
  }

  if (isExpired(payload.exp)) {
    el.appendChild(errorEl("This decision has expired."));
    return;
  }

  const question = document.createElement("p");
  question.className = "txtshr-decision-question";
  question.textContent = payload.question;
  el.appendChild(question);

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "txtshr-decision-options";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "txtshr-decision-confirm";
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirm";

  let selected: string | null = null;
  const buttons: HTMLButtonElement[] = [];

  for (const option of payload.options) {
    const btn = document.createElement("button");
    btn.className = "txtshr-decision-option";
    btn.textContent = option;
    btn.addEventListener("click", () => {
      selected = option;
      for (const b of buttons) b.classList.toggle("selected", b === btn);
      confirmBtn.disabled = false;
      confirmBtn.textContent = `Confirm ${option}`;
    });
    buttons.push(btn);
    optionsWrap.appendChild(btn);
  }

  confirmBtn.addEventListener("click", () => {
    if (!selected) return;
    window.location.href = buildRedirectUrl(payload.submitUrl, token, selected);
  });

  el.appendChild(optionsWrap);
  el.appendChild(confirmBtn);
};

const errorEl = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
