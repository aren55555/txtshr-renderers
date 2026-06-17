//#region src/spinner.ts
var e = [
	"#34d399",
	"#60a5fa",
	"#f472b6",
	"#fbbf24",
	"#a78bfa",
	"#f87171",
	"#22d3ee",
	"#fb923c"
], t = () => {
	if (document.getElementById("txtshr-spinner-styles")) return;
	let e = document.createElement("style");
	e.id = "txtshr-spinner-styles", e.textContent = "\n    .txtshr-spinner { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; font-family: inherit; }\n    .txtshr-spinner-wheel-wrap { position: relative; width: 100%; max-width: 480px; aspect-ratio: 1 / 1; container-type: inline-size; }\n    .txtshr-spinner-wheel {\n      display: block; width: 100%; height: 100%; transform-origin: 50% 50%;\n      transition: transform 4.5s cubic-bezier(0.21, 0.83, 0.21, 1);\n    }\n    .txtshr-spinner-wheel text {\n      fill: #0f172a; font-weight: 600; font-family: inherit;\n    }\n    .txtshr-spinner-pointer {\n      position: absolute; top: -0.7cqw; left: 50%; transform: translateX(-50%);\n      width: 0; height: 0; z-index: 1;\n      border-left: 4cqw solid transparent; border-right: 4cqw solid transparent;\n      border-top: 5.7cqw solid #f1f5f9;\n      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.4));\n    }\n    .txtshr-spinner-btn {\n      background: #34d399; color: #022c22; border: none; border-radius: 0.5rem;\n      padding: 0.625rem 1.5rem; font-size: 0.875rem; font-weight: 700;\n      letter-spacing: 0.03em; text-transform: uppercase; cursor: pointer;\n      font-family: inherit; transition: opacity 0.15s, background 0.15s;\n    }\n    .txtshr-spinner-btn:not(:disabled):hover { background: #6ee7b7; }\n    .txtshr-spinner-btn:disabled { opacity: 0.5; cursor: not-allowed; }\n    .txtshr-spinner-result {\n      color: #f1f5f9; font-size: 1.0625rem; font-weight: 600; min-height: 1.5em;\n      margin: 0; text-align: center; opacity: 0; transform: scale(0.9);\n      transition: opacity 0.3s, transform 0.3s;\n    }\n    .txtshr-spinner-result.show { opacity: 1; transform: scale(1); }\n  ", document.head.appendChild(e);
}, n = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
}, r = (e, t, n, r) => {
	let i = r * Math.PI / 180;
	return {
		x: e + n * Math.sin(i),
		y: t - n * Math.cos(i)
	};
}, i = (e, t, n, i, a) => {
	let o = r(e, t, n, i), s = r(e, t, n, a), c = a - i > 180 ? 1 : 0;
	return `M ${e} ${t} L ${o.x} ${o.y} A ${n} ${n} 0 ${c} 1 ${s.x} ${s.y} Z`;
}, a = (a, o) => {
	t();
	let s = o.split(/\r?\n/).map((e) => e.trim()).filter(Boolean);
	if (s.length < 2) {
		a.appendChild(n("Need at least 2 options, one per line, to build a spinner."));
		return;
	}
	let c = 360 / s.length, l = s.length <= 4 ? 13 : s.length <= 8 ? 11 : 9, u = 138 * .62, d = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	d.classList.add("txtshr-spinner-wheel"), d.setAttribute("viewBox", "0 0 280 280"), s.forEach((t, n) => {
		let a = n * c, o = a + c, s = document.createElementNS("http://www.w3.org/2000/svg", "path");
		s.setAttribute("d", i(140, 140, 138, a, o)), s.setAttribute("fill", e[n % e.length]), s.setAttribute("stroke", "#0f172a"), s.setAttribute("stroke-width", "2"), d.appendChild(s);
		let f = a + c / 2, { x: p, y: m } = r(140, 140, u, f), h = f, g = 2 * u * Math.sin(c * Math.PI / 360), _ = Math.max(3, Math.floor(g / (l * .6))), v = t.length > _ ? `${t.slice(0, _ - 1)}…` : t, y = document.createElementNS("http://www.w3.org/2000/svg", "text");
		y.setAttribute("x", String(p)), y.setAttribute("y", String(m)), y.setAttribute("font-size", String(l)), y.setAttribute("text-anchor", "middle"), y.setAttribute("dominant-baseline", "middle"), y.setAttribute("transform", `rotate(${h} ${p} ${m})`), y.textContent = v, d.appendChild(y);
	});
	let f = document.createElement("div");
	f.className = "txtshr-spinner";
	let p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	p.setAttribute("cx", "140"), p.setAttribute("cy", "140"), p.setAttribute("r", "137"), p.setAttribute("fill", "none"), p.setAttribute("stroke", "#1e293b"), p.setAttribute("stroke-width", "2"), d.appendChild(p);
	let m = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	m.setAttribute("cx", "140"), m.setAttribute("cy", "140"), m.setAttribute("r", "16"), m.setAttribute("fill", "#1e293b"), m.setAttribute("stroke", "#475569"), m.setAttribute("stroke-width", "2"), d.appendChild(m);
	let h = document.createElement("div");
	h.className = "txtshr-spinner-wheel-wrap";
	let g = document.createElement("div");
	g.className = "txtshr-spinner-pointer", h.appendChild(d), h.appendChild(g);
	let _ = document.createElement("button");
	_.className = "txtshr-spinner-btn", _.textContent = "Spin the Wheel";
	let v = document.createElement("p");
	v.className = "txtshr-spinner-result", _.addEventListener("click", () => {
		_.disabled = !0;
		let e = Math.floor(Math.random() * s.length), t = 5 * 360 + (360 - (e * c + c / 2));
		d.style.transform = `rotate(${t}deg)`, d.addEventListener("transitionend", () => {
			v.textContent = `🎉 ${s[e]}`, v.classList.add("show");
		}, { once: !0 });
	}), f.appendChild(h), f.appendChild(_), f.appendChild(v), a.appendChild(f);
};
//#endregion
export { a as render };
