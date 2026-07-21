//#region src/core/gridUtils.ts
function e(e) {
	return e.map((e) => ({
		colId: e.id,
		sort: e.desc ? "desc" : "asc"
	}));
}
function t(e) {
	return e.map((e) => ({
		id: e.colId,
		desc: e.sort === "desc"
	}));
}
function n(e) {
	return Object.fromEntries(e.map((e) => [e.id, e.value]));
}
function r(e) {
	return Object.entries(e).map(([e, t]) => ({
		id: e,
		value: t
	}));
}
function i(e) {
	let t = e.columnDef.header;
	return typeof t == "string" ? t : e.id;
}
function a(e, t, n) {
	let r = e.getState().columnOrder, i = e.getAllLeafColumns().map((e) => e.id), a = r.length > 0 ? [...r] : [...i], o = a.indexOf(t), s = a.indexOf(n);
	o !== -1 && s !== -1 && (a.splice(o, 1), a.splice(s, 0, t), e.setColumnOrder(a));
}
//#endregion
export { a, r as i, n, e as o, i as r, t };
