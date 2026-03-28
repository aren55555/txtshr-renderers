//#region src/mermaid.ts
var e = () => typeof mermaid < "u" ? Promise.resolve() : new Promise((e, t) => {
	let n = document.createElement("script");
	n.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js", n.onload = () => e(), n.onerror = () => t(/* @__PURE__ */ Error("Failed to load Mermaid from CDN")), document.head.appendChild(n);
}), t = (t, r) => {
	e().then(() => {
		mermaid.initialize({
			startOnLoad: !1,
			theme: "dark",
			themeVariables: {
				background: "#0f172a",
				primaryColor: "#1e293b",
				primaryTextColor: "#cbd5e1",
				primaryBorderColor: "#334155",
				lineColor: "#475569",
				secondaryColor: "#1e293b",
				tertiaryColor: "#0f172a"
			}
		});
		let e = `txtshr-mermaid-${crypto.randomUUID()}`;
		return mermaid.render(e, r.trim());
	}).then(({ svg: e }) => {
		let n = document.createElement("div");
		n.style.cssText = "display:flex;justify-content:center;overflow-x:auto;padding:1rem 0;", n.innerHTML = e, t.appendChild(n);
	}).catch((e) => {
		t.appendChild(n(e instanceof Error ? e.message : "Failed to render diagram."));
	});
}, n = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { t as render };
