//#region src/export/exportUtils.ts
function e(e, t) {
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t, r.style.display = "none", document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(n);
}
function t(e, t) {
	let n = document.createElement("a");
	n.href = e, n.download = t, n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n);
}
//#endregion
export { t as n, e as t };
