//#region src/magnet.ts
var e = () => {
	if (document.getElementById("txtshr-magnet-styles")) return;
	let e = document.createElement("style");
	e.id = "txtshr-magnet-styles", e.textContent = "\n    .txtshr-magnet { font-family: inherit; }\n    .txtshr-magnet-toolbar {\n      display: flex;\n      gap: 0.5rem;\n      margin-bottom: 0.75rem;\n    }\n    .txtshr-magnet-btn {\n      background: #1e293b;\n      border: 1px solid #334155;\n      color: #cbd5e1;\n      border-radius: 0.375rem;\n      padding: 0.25rem 0.75rem;\n      font-size: 0.75rem;\n      cursor: pointer;\n      font-family: inherit;\n      transition: background 0.15s;\n    }\n    .txtshr-magnet-btn:hover { background: #334155; }\n    .txtshr-magnet-text {\n      word-break: break-all;\n      font-family: monospace;\n      font-size: 0.8125rem;\n      color: #94a3b8;\n      background: #0f172a;\n      border: 1px solid #1e293b;\n      border-radius: 8px;\n      padding: 0.875rem 1rem;\n    }\n  ", document.head.appendChild(e);
}, t = (t, r) => {
	e(), t.className = "txtshr-magnet";
	let i = r.trim();
	if (!i.startsWith("magnet:?")) {
		t.appendChild(n("Invalid magnet link — content must begin with \"magnet:?\"."));
		return;
	}
	let a = document.createElement("div");
	a.className = "txtshr-magnet-toolbar";
	let o = document.createElement("a");
	o.href = i, o.className = "txtshr-magnet-btn", o.textContent = "Open Torrent";
	let s = document.createElement("button");
	s.className = "txtshr-magnet-btn", s.textContent = "Copy", s.addEventListener("click", () => {
		navigator.clipboard.writeText(i).then(() => {
			s.textContent = "Copied!", setTimeout(() => {
				s.textContent = "Copy";
			}, 1500);
		});
	}), a.appendChild(o), a.appendChild(s);
	let c = document.createElement("div");
	c.className = "txtshr-magnet-text", c.textContent = i, t.appendChild(a), t.appendChild(c);
}, n = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { t as render };
