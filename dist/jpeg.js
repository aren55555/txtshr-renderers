//#region src/jpeg.ts
function e(e, n) {
	let r = document.createElement("img");
	r.src = `data:image/jpeg;base64,${n.trim()}`, r.alt = "Shared image", r.style.cssText = "display:block;max-width:100%;border-radius:8px;margin:0 auto;", r.onerror = () => {
		r.replaceWith(t("Could not decode image — the content may not be a valid base64-encoded JPEG."));
	}, e.appendChild(r);
}
function t(e) {
	let t = document.createElement("p");
	return t.style.cssText = "color:#f87171;font-size:0.875rem;", t.textContent = e, t;
}
//#endregion
export { e as render };
