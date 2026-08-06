//#region src/bionic.ts
var e = "\n.txtshr-bionic {\n  color: #cbd5e1;\n  line-height: 1.75;\n  font-size: 0.9375rem;\n  overflow-wrap: break-word;\n  word-break: break-word;\n  min-width: 0;\n  white-space: pre-wrap;\n}\n.txtshr-bionic strong {\n  color: #ffffff;\n  font-weight: 900;\n}\n", t = () => {
	if (document.getElementById("txtshr-bionic-styles")) return;
	let t = document.createElement("style");
	t.id = "txtshr-bionic-styles", t.textContent = e, document.head.appendChild(t);
};
function n(e) {
	return e <= 3 ? 1 : e <= 7 ? 2 : 3;
}
function r(e) {
	let t = e.match(/^[^\w]*/), r = t ? t[0] : "", i = r.length, a = e.slice(i).match(/[^\w]*$/), o = a ? a[0] : "", s = e.length - o.length, c = e.slice(i, s);
	if (!c) return e;
	let l = n(c.length);
	return r + `<strong>${c.slice(0, l)}</strong>${c.slice(l)}` + o;
}
var i = (e, n) => {
	t(), e.className = "txtshr-bionic", e.innerHTML = n.split(/(\s+)/).map((e) => /^\s+$/.test(e) ? e : r(e)).join("");
};
//#endregion
export { i as render };
