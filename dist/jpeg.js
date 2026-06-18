//#region src/jpeg.ts
var e = "\n.txtshr-jpeg-overlay {\n  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);\n  display: flex; align-items: center; justify-content: center;\n  z-index: 9999; cursor: pointer;\n}\n.txtshr-jpeg-overlay img {\n  max-width: 90vw; max-height: 90vh; border-radius: 8px; cursor: default;\n}\n", t = () => {
	if (document.getElementById("txtshr-jpeg-styles")) return;
	let t = document.createElement("style");
	t.id = "txtshr-jpeg-styles", t.textContent = e, document.head.appendChild(t);
}, n = (e, n) => {
	t();
	let a = `data:image/jpeg;base64,${n.trim()}`, o = document.createElement("img");
	o.src = a, o.alt = "Shared image", o.style.cssText = "display:block;max-width:100%;border-radius:8px;margin:0 auto;cursor:pointer;", o.onerror = () => {
		o.replaceWith(i("Could not decode image — the content may not be a valid base64-encoded JPEG."));
	}, o.onclick = () => r(a), e.appendChild(o);
}, r = (e) => {
	let t = document.createElement("div");
	t.className = "txtshr-jpeg-overlay";
	let n = document.createElement("img");
	n.src = e, n.alt = "Shared image", t.appendChild(n);
	let r = () => {
		t.remove(), document.removeEventListener("keydown", i);
	}, i = (e) => {
		e.key === "Escape" && r();
	};
	t.onclick = r, document.addEventListener("keydown", i), document.body.appendChild(t);
}, i = (e) => {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
};
//#endregion
export { n as render };
