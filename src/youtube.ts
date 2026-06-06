import type { RemoteRenderer } from "txtshr-renderer";

const injectStyles = () => {
  if (document.getElementById("txtshr-youtube-styles")) return;
  const style = document.createElement("style");
  style.id = "txtshr-youtube-styles";
  style.textContent = `
    .txtshr-youtube-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      border-radius: 8px;
      overflow: hidden;
      background: #0f172a;
    }
    .txtshr-youtube-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  `;
  document.head.appendChild(style);
};

const parseYouTubeURL = (raw: string): { id: string; start?: number } | null => {
  try {
    const u = new URL(raw);
    let id: string | null = null;

    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (u.hostname === "youtube.com" || u.hostname === "www.youtube.com" || u.hostname === "m.youtube.com") {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.slice(7);
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.slice(8);
      }
    }

    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;

    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    const start = t ? parseInt(t, 10) : undefined;

    return { id, start: start !== undefined && !isNaN(start) ? start : undefined };
  } catch {
    return null;
  }
};

export const render: RemoteRenderer["render"] = (el, text) => {
  injectStyles();

  const parsed = parseYouTubeURL(text.trim());
  if (!parsed) {
    el.appendChild(errorEl("Invalid YouTube URL."));
    return;
  }

  const embedUrl = new URL(`https://www.youtube.com/embed/${parsed.id}`);
  embedUrl.searchParams.set("autoplay", "1");
  embedUrl.searchParams.set("mute", "1");
  if (parsed.start !== undefined) embedUrl.searchParams.set("start", String(parsed.start));

  const wrapper = document.createElement("div");
  wrapper.className = "txtshr-youtube-wrapper";

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl.toString();
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  wrapper.appendChild(iframe);
  el.appendChild(wrapper);
};

const errorEl = (msg: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.style.cssText = "color:#f87171;font-size:0.875rem;";
  p.textContent = msg;
  return p;
};
