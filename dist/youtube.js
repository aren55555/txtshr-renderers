//#region src/youtube.ts
var e = () => {
	if (document.getElementById("txtshr-youtube-styles")) return;
	let e = document.createElement("style");
	e.id = "txtshr-youtube-styles", e.textContent = "\n    .txtshr-youtube-wrapper {\n      position: relative;\n      width: 100%;\n      padding-bottom: 56.25%;\n      border-radius: 8px;\n      overflow: hidden;\n      background: #0f172a;\n    }\n    .txtshr-youtube-wrapper iframe {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      border: none;\n    }\n  ", document.head.appendChild(e);
}, t = (e) => {
	try {
		let t = new URL(e), n = null;
		if (t.hostname === "youtu.be" ? n = t.pathname.slice(1) : (t.hostname === "youtube.com" || t.hostname === "www.youtube.com" || t.hostname === "m.youtube.com") && (t.pathname === "/watch" ? n = t.searchParams.get("v") : t.pathname.startsWith("/embed/") ? n = t.pathname.slice(7) : t.pathname.startsWith("/shorts/") && (n = t.pathname.slice(8))), !n || !/^[a-zA-Z0-9_-]{11}$/.test(n)) return null;
		let r = t.searchParams.get("t") ?? t.searchParams.get("start"), i = r ? parseInt(r, 10) : void 0;
		return {
			id: n,
			start: i !== void 0 && !isNaN(i) ? i : void 0
		};
	} catch {
		return null;
	}
}, n = (n, i) => {
	e();
	let a = t(i.trim());
	if (!a) {
		n.appendChild(r("Invalid YouTube URL."));
		return;
	}
	let o = new URL(`https://www.youtube.com/embed/${a.id}`);
	o.searchParams.set("autoplay", "1"), o.searchParams.set("mute", "1"), a.start !== void 0 && o.searchParams.set("start", String(a.start));
	let s = document.createElement("div");
	s.className = "txtshr-youtube-wrapper";
	let c = document.createElement("iframe");
	c.src = o.toString(), c.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", c.allowFullscreen = !0, s.appendChild(c), n.appendChild(s);
}, r = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { n as render };
