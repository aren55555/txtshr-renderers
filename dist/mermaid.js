//#region src/mermaid.ts
var e = {
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
}, t = {
	theme: "default",
	themeVariables: {}
}, n = "#0f172a", r = "#ffffff", i = () => typeof mermaid < "u" ? Promise.resolve() : new Promise((e, t) => {
	let n = document.createElement("script");
	n.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js", n.onload = () => e(), n.onerror = () => t(/* @__PURE__ */ Error("Failed to load Mermaid from CDN")), document.head.appendChild(n);
}), a = () => {
	if (document.getElementById("txtshr-mermaid-styles")) return;
	let e = document.createElement("style");
	e.id = "txtshr-mermaid-styles", e.textContent = "\n    .txtshr-mermaid-toolbar {\n      display: flex;\n      gap: 0.5rem;\n      justify-content: flex-end;\n      padding: 0.5rem 0;\n    }\n    .txtshr-mermaid-btn {\n      background: #1e293b;\n      border: 1px solid #334155;\n      color: #cbd5e1;\n      border-radius: 0.375rem;\n      padding: 0.25rem 0.75rem;\n      font-size: 0.75rem;\n      cursor: pointer;\n      font-family: inherit;\n      transition: background 0.15s;\n    }\n    .txtshr-mermaid-btn:hover {\n      background: #334155;\n    }\n  ", document.head.appendChild(e);
}, o = (o, c) => {
	a();
	let l = !0, u = "", d = document.createElement("div");
	d.className = "txtshr-mermaid-toolbar";
	let f = document.createElement("div");
	f.style.cssText = "display:flex;justify-content:center;overflow-x:auto;padding:1rem 0;", o.appendChild(d), o.appendChild(f);
	let p = (e, t) => {
		let n = document.createElement("button");
		return n.className = "txtshr-mermaid-btn", n.textContent = e, n.addEventListener("click", t), n;
	}, m = (i) => {
		let a = i ? e : t;
		mermaid.initialize({
			startOnLoad: !1,
			...a
		});
		let o = `txtshr-mermaid-${crypto.randomUUID()}`;
		return mermaid.render(o, c.trim()).then(({ svg: e }) => {
			u = e, f.innerHTML = e, f.style.background = i ? n : r;
		});
	}, h = () => {
		if (!u) return;
		let e = new Blob([u], { type: "image/svg+xml" }), t = URL.createObjectURL(e), n = document.createElement("a");
		n.href = t, n.download = "diagram.svg", n.click(), URL.revokeObjectURL(t);
	}, g = () => {
		if (!u) return;
		let e = f.querySelector("svg");
		if (!e) return;
		let t = e.viewBox.baseVal, i = e.getBoundingClientRect(), a = t.width || i.width || 800, o = t.height || i.height || 600, s = document.createElement("canvas");
		s.width = a * 2, s.height = o * 2;
		let c = s.getContext("2d");
		c.scale(2, 2), c.fillStyle = l ? n : r, c.fillRect(0, 0, a, o);
		let d = new Blob([u], { type: "image/svg+xml" }), p = URL.createObjectURL(d), m = new Image();
		m.onload = () => {
			c.drawImage(m, 0, 0, a, o), URL.revokeObjectURL(p);
			let e = document.createElement("a");
			e.href = s.toDataURL("image/png"), e.download = "diagram.png", e.click();
		}, m.src = p;
	}, _ = p("Light mode", () => {
		l = !l, _.textContent = l ? "Light mode" : "Dark mode", m(l).catch(console.error);
	});
	d.appendChild(p("Download SVG", h)), d.appendChild(p("Download PNG", g)), d.appendChild(_), i().then(() => m(l)).catch((e) => {
		o.appendChild(s(e instanceof Error ? e.message : "Failed to render diagram."));
	});
}, s = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { o as render };
