//#region src/lib/respond.ts
var e = (e) => {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = t + "=".repeat((4 - t.length % 4) % 4), r = atob(n), i = Uint8Array.from(r, (e) => e.charCodeAt(0));
	return new TextDecoder().decode(i);
}, t = (t) => {
	let n = t.split(".");
	if (n.length !== 3) throw Error("Invalid token — expected a JWT with header, payload and signature.");
	try {
		return JSON.parse(e(n[1]));
	} catch {
		throw Error("Invalid token — could not decode payload.");
	}
}, n = (e) => {
	try {
		let t = new URL(e);
		return t.protocol === "https:" || t.protocol === "http:";
	} catch {
		return !1;
	}
}, r = (e) => e !== void 0 && Date.now() >= e * 1e3, i = (e, t, n) => {
	let r = new URL(e);
	return r.hash = new URLSearchParams({
		token: t,
		answer: n
	}).toString(), r.toString();
}, a = () => {
	if (document.getElementById("txtshr-decision-styles")) return;
	let e = document.createElement("style");
	e.id = "txtshr-decision-styles", e.textContent = "\n    .txtshr-decision { font-family: inherit; }\n    .txtshr-decision-question {\n      color: #f1f5f9; font-size: 1.0625rem; font-weight: 600;\n      margin: 0 0 1rem; line-height: 1.5;\n    }\n    .txtshr-decision-options {\n      display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;\n    }\n    .txtshr-decision-option {\n      background: #0f172a; border: 1px solid #334155; color: #cbd5e1;\n      border-radius: 0.5rem; padding: 0.625rem 0.875rem; font-size: 0.9375rem;\n      text-align: left; cursor: pointer; font-family: inherit;\n      transition: border-color 0.15s, background 0.15s, color 0.15s;\n    }\n    .txtshr-decision-option:hover { border-color: #475569; }\n    .txtshr-decision-option.selected {\n      border-color: #34d399; background: #064e3b; color: #f1f5f9;\n    }\n    .txtshr-decision-confirm {\n      background: #34d399; color: #022c22; border: none; border-radius: 0.5rem;\n      padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 700;\n      letter-spacing: 0.03em; text-transform: uppercase; cursor: pointer;\n      font-family: inherit; transition: opacity 0.15s;\n    }\n    .txtshr-decision-confirm:disabled { opacity: 0.5; cursor: not-allowed; }\n  ", document.head.appendChild(e);
}, o = (e) => {
	let r = t(e);
	if (typeof r != "object" || !r) throw Error("Invalid token — payload is not an object.");
	let { kind: i, question: a, options: o, submitUrl: s, exp: c } = r;
	if (i !== "decision") throw Error(`Invalid token — expected kind "decision", got ${JSON.stringify(i)}.`);
	if (typeof a != "string" || !a.trim()) throw Error("Invalid token — missing \"question\" claim.");
	if (!Array.isArray(o) || o.length < 2 || !o.every((e) => typeof e == "string" && e.trim())) throw Error("Invalid token — \"options\" claim must list at least 2 named options.");
	if (typeof s != "string" || !n(s)) throw Error("Invalid token — missing or invalid \"submitUrl\" claim.");
	if (c !== void 0 && typeof c != "number") throw Error("Invalid token — \"exp\" claim must be a number.");
	return {
		kind: i,
		question: a,
		options: o,
		submitUrl: s,
		exp: c
	};
}, s = (e, t) => {
	a(), e.className = "txtshr-decision";
	let n = t.trim(), s;
	try {
		s = o(n);
	} catch (t) {
		e.appendChild(c(t instanceof Error ? t.message : "Could not parse decision token."));
		return;
	}
	if (r(s.exp)) {
		e.appendChild(c("This decision has expired."));
		return;
	}
	let l = document.createElement("p");
	l.className = "txtshr-decision-question", l.textContent = s.question, e.appendChild(l);
	let u = document.createElement("div");
	u.className = "txtshr-decision-options";
	let d = document.createElement("button");
	d.className = "txtshr-decision-confirm", d.disabled = !0, d.textContent = "Confirm";
	let f = null, p = [];
	for (let e of s.options) {
		let t = document.createElement("button");
		t.className = "txtshr-decision-option", t.textContent = e, t.addEventListener("click", () => {
			f = e;
			for (let e of p) e.classList.toggle("selected", e === t);
			d.disabled = !1, d.textContent = `Confirm ${e}`;
		}), p.push(t), u.appendChild(t);
	}
	d.addEventListener("click", () => {
		f && (window.location.href = i(s.submitUrl, n, f));
	}), e.appendChild(u), e.appendChild(d);
}, c = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { s as render };
