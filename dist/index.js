import { i as e, n as t } from "./rolldown-runtime-CWhphoD1.js";
import { a as n, i as r, n as i, o as a, r as o, t as s } from "./gridUtils-CFXmUDhg.js";
import { n as c, t as l } from "./exportUtils-DTqC0iF8.js";
import * as u from "react";
import d, { forwardRef as f, useCallback as p, useEffect as m, useImperativeHandle as h, useMemo as g, useRef as _, useState as v } from "react";
import { Fragment as y, jsx as b, jsxs as x } from "react/jsx-runtime";
import { createPortal as S } from "react-dom";
//#region node_modules/clsx/dist/clsx.mjs
function C(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = C(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function w() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = C(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/@tanstack/table-core/build/lib/index.mjs
function T(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function E(e, t) {
	return (n) => {
		t.setState((t) => ({
			...t,
			[e]: T(n, t[e])
		}));
	};
}
function D(e) {
	return e instanceof Function;
}
function O(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "number");
}
function k(e, t) {
	let n = [], r = (e) => {
		e.forEach((e) => {
			n.push(e);
			let i = t(e);
			i != null && i.length && r(i);
		});
	};
	return r(e), n;
}
function A(e, t, n) {
	let r = [], i;
	return (a) => {
		let o;
		n.key && n.debug && (o = Date.now());
		let s = e(a);
		if (!(s.length !== r.length || s.some((e, t) => r[t] !== e))) return i;
		r = s;
		let c;
		if (n.key && n.debug && (c = Date.now()), i = t(...s), n == null || n.onChange == null || n.onChange(i), n.key && n.debug && n != null && n.debug()) {
			let e = Math.round((Date.now() - o) * 100) / 100, t = Math.round((Date.now() - c) * 100) / 100, r = t / 16, i = (e, t) => {
				for (e = String(e); e.length < t;) e = " " + e;
				return e;
			};
			console.info(`%c⏱ ${i(t, 5)} /${i(e, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * r, 120))}deg 100% 31%);`, n?.key);
		}
		return i;
	};
}
function j(e, t, n, r) {
	return {
		debug: () => e?.debugAll ?? e[t],
		key: process.env.NODE_ENV === "development" && n,
		onChange: r
	};
}
function M(e, t, n, r) {
	let i = {
		id: `${t.id}_${n.id}`,
		row: t,
		column: n,
		getValue: () => t.getValue(r),
		renderValue: () => i.getValue() ?? e.options.renderFallbackValue,
		getContext: A(() => [
			e,
			n,
			t,
			i
		], (e, t, n, r) => ({
			table: e,
			column: t,
			row: n,
			cell: r,
			getValue: r.getValue,
			renderValue: r.renderValue
		}), j(e.options, "debugCells", "cell.getContext"))
	};
	return e._features.forEach((r) => {
		r.createCell == null || r.createCell(i, n, t, e);
	}, {}), i;
}
function N(e, t, n, r) {
	let i = {
		...e._getDefaultColumnDef(),
		...t
	}, a = i.accessorKey, o = i.id ?? (a ? typeof String.prototype.replaceAll == "function" ? a.replaceAll(".", "_") : a.replace(/\./g, "_") : void 0) ?? (typeof i.header == "string" ? i.header : void 0), s;
	if (i.accessorFn ? s = i.accessorFn : a && (s = a.includes(".") ? (e) => {
		let t = e;
		for (let e of a.split(".")) t = t?.[e], process.env.NODE_ENV !== "production" && t === void 0 && console.warn(`"${e}" in deeply nested key "${a}" returned undefined.`);
		return t;
	} : (e) => e[i.accessorKey]), !o) throw process.env.NODE_ENV === "production" ? Error() : Error(i.accessorFn ? "Columns require an id when using an accessorFn" : "Columns require an id when using a non-string header");
	let c = {
		id: `${String(o)}`,
		accessorFn: s,
		parent: r,
		depth: n,
		columnDef: i,
		columns: [],
		getFlatColumns: A(() => [!0], () => [c, ...c.columns?.flatMap((e) => e.getFlatColumns())], j(e.options, "debugColumns", "column.getFlatColumns")),
		getLeafColumns: A(() => [e._getOrderColumnsFn()], (e) => {
			var t;
			return (t = c.columns) != null && t.length ? e(c.columns.flatMap((e) => e.getLeafColumns())) : [c];
		}, j(e.options, "debugColumns", "column.getLeafColumns"))
	};
	for (let t of e._features) t.createColumn == null || t.createColumn(c, e);
	return c;
}
var P = "debugHeaders";
function F(e, t, n) {
	let r = {
		id: n.id ?? t.id,
		column: t,
		index: n.index,
		isPlaceholder: !!n.isPlaceholder,
		placeholderId: n.placeholderId,
		depth: n.depth,
		subHeaders: [],
		colSpan: 0,
		rowSpan: 0,
		headerGroup: null,
		getLeafHeaders: () => {
			let e = [], t = (n) => {
				n.subHeaders && n.subHeaders.length && n.subHeaders.map(t), e.push(n);
			};
			return t(r), e;
		},
		getContext: () => ({
			table: e,
			header: r,
			column: t
		})
	};
	return e._features.forEach((t) => {
		t.createHeader == null || t.createHeader(r, e);
	}), r;
}
var I = { createTable: (e) => {
	e.getHeaderGroups = A(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left,
		e.getState().columnPinning.right
	], (t, n, r, i) => {
		let a = r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], o = i?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], s = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id)));
		return L(t, [
			...a,
			...s,
			...o
		], e);
	}, j(e.options, P, "getHeaderGroups")), e.getCenterHeaderGroups = A(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left,
		e.getState().columnPinning.right
	], (t, n, r, i) => (n = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id))), L(t, n, e, "center")), j(e.options, P, "getCenterHeaderGroups")), e.getLeftHeaderGroups = A(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left
	], (t, n, r) => L(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, "left"), j(e.options, P, "getLeftHeaderGroups")), e.getRightHeaderGroups = A(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.right
	], (t, n, r) => L(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, "right"), j(e.options, P, "getRightHeaderGroups")), e.getFooterGroups = A(() => [e.getHeaderGroups()], (e) => [...e].reverse(), j(e.options, P, "getFooterGroups")), e.getLeftFooterGroups = A(() => [e.getLeftHeaderGroups()], (e) => [...e].reverse(), j(e.options, P, "getLeftFooterGroups")), e.getCenterFooterGroups = A(() => [e.getCenterHeaderGroups()], (e) => [...e].reverse(), j(e.options, P, "getCenterFooterGroups")), e.getRightFooterGroups = A(() => [e.getRightHeaderGroups()], (e) => [...e].reverse(), j(e.options, P, "getRightFooterGroups")), e.getFlatHeaders = A(() => [e.getHeaderGroups()], (e) => e.map((e) => e.headers).flat(), j(e.options, P, "getFlatHeaders")), e.getLeftFlatHeaders = A(() => [e.getLeftHeaderGroups()], (e) => e.map((e) => e.headers).flat(), j(e.options, P, "getLeftFlatHeaders")), e.getCenterFlatHeaders = A(() => [e.getCenterHeaderGroups()], (e) => e.map((e) => e.headers).flat(), j(e.options, P, "getCenterFlatHeaders")), e.getRightFlatHeaders = A(() => [e.getRightHeaderGroups()], (e) => e.map((e) => e.headers).flat(), j(e.options, P, "getRightFlatHeaders")), e.getCenterLeafHeaders = A(() => [e.getCenterFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), j(e.options, P, "getCenterLeafHeaders")), e.getLeftLeafHeaders = A(() => [e.getLeftFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), j(e.options, P, "getLeftLeafHeaders")), e.getRightLeafHeaders = A(() => [e.getRightFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), j(e.options, P, "getRightLeafHeaders")), e.getLeafHeaders = A(() => [
		e.getLeftHeaderGroups(),
		e.getCenterHeaderGroups(),
		e.getRightHeaderGroups()
	], (e, t, n) => [
		...e[0]?.headers ?? [],
		...t[0]?.headers ?? [],
		...n[0]?.headers ?? []
	].map((e) => e.getLeafHeaders()).flat(), j(e.options, P, "getLeafHeaders"));
} };
function L(e, t, n, r) {
	let i = 0, a = function(e, t) {
		t === void 0 && (t = 1), i = Math.max(i, t), e.filter((e) => e.getIsVisible()).forEach((e) => {
			var n;
			(n = e.columns) != null && n.length && a(e.columns, t + 1);
		}, 0);
	};
	a(e);
	let o = [], s = (e, t) => {
		let i = {
			depth: t,
			id: [r, `${t}`].filter(Boolean).join("_"),
			headers: []
		}, a = [];
		e.forEach((e) => {
			let o = [...a].reverse()[0], s = e.column.depth === i.depth, c, l = !1;
			if (s && e.column.parent ? c = e.column.parent : (c = e.column, l = !0), o && o?.column === c) o.subHeaders.push(e);
			else {
				let i = F(n, c, {
					id: [
						r,
						t,
						c.id,
						e?.id
					].filter(Boolean).join("_"),
					isPlaceholder: l,
					placeholderId: l ? `${a.filter((e) => e.column === c).length}` : void 0,
					depth: t,
					index: a.length
				});
				i.subHeaders.push(e), a.push(i);
			}
			i.headers.push(e), e.headerGroup = i;
		}), o.push(i), t > 0 && s(a, t - 1);
	};
	s(t.map((e, t) => F(n, e, {
		depth: i,
		index: t
	})), i - 1), o.reverse();
	let c = (e) => e.filter((e) => e.column.getIsVisible()).map((e) => {
		let t = 0, n = 0, r = [0];
		e.subHeaders && e.subHeaders.length ? (r = [], c(e.subHeaders).forEach((e) => {
			let { colSpan: n, rowSpan: i } = e;
			t += n, r.push(i);
		})) : t = 1;
		let i = Math.min(...r);
		return n += i, e.colSpan = t, e.rowSpan = n, {
			colSpan: t,
			rowSpan: n
		};
	});
	return c(o[0]?.headers ?? []), o;
}
var R = (e, t, n, r, i, a, o) => {
	let s = {
		id: t,
		index: r,
		original: n,
		depth: i,
		parentId: o,
		_valuesCache: {},
		_uniqueValuesCache: {},
		getValue: (t) => {
			if (s._valuesCache.hasOwnProperty(t)) return s._valuesCache[t];
			let n = e.getColumn(t);
			if (n != null && n.accessorFn) return s._valuesCache[t] = n.accessorFn(s.original, r), s._valuesCache[t];
		},
		getUniqueValues: (t) => {
			if (s._uniqueValuesCache.hasOwnProperty(t)) return s._uniqueValuesCache[t];
			let n = e.getColumn(t);
			if (n != null && n.accessorFn) return n.columnDef.getUniqueValues ? (s._uniqueValuesCache[t] = n.columnDef.getUniqueValues(s.original, r), s._uniqueValuesCache[t]) : (s._uniqueValuesCache[t] = [s.getValue(t)], s._uniqueValuesCache[t]);
		},
		renderValue: (t) => s.getValue(t) ?? e.options.renderFallbackValue,
		subRows: a ?? [],
		getLeafRows: () => k(s.subRows, (e) => e.subRows),
		getParentRow: () => s.parentId ? e.getRow(s.parentId, !0) : void 0,
		getParentRows: () => {
			let e = [], t = s;
			for (;;) {
				let n = t.getParentRow();
				if (!n) break;
				e.push(n), t = n;
			}
			return e.reverse();
		},
		getAllCells: A(() => [e.getAllLeafColumns()], (t) => t.map((t) => M(e, s, t, t.id)), j(e.options, "debugRows", "getAllCells")),
		_getAllCellsByColumnId: A(() => [s.getAllCells()], (e) => e.reduce((e, t) => (e[t.column.id] = t, e), {}), j(e.options, "debugRows", "getAllCellsByColumnId"))
	};
	for (let t = 0; t < e._features.length; t++) {
		let n = e._features[t];
		n == null || n.createRow == null || n.createRow(s, e);
	}
	return s;
}, z = { createColumn: (e, t) => {
	e._getFacetedRowModel = t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id), e.getFacetedRowModel = () => e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel(), e._getFacetedUniqueValues = t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id), e.getFacetedUniqueValues = () => e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : /* @__PURE__ */ new Map(), e._getFacetedMinMaxValues = t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id), e.getFacetedMinMaxValues = () => {
		if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
	};
} }, ee = (e, t, n) => {
	var r, i;
	let a = n == null || (r = n.toString()) == null ? void 0 : r.toLowerCase();
	return !!(!((i = e.getValue(t)) == null || (i = i.toString()) == null || (i = i.toLowerCase()) == null) && i.includes(a));
};
ee.autoRemove = (e) => G(e);
var B = (e, t, n) => {
	var r;
	return !!(!((r = e.getValue(t)) == null || (r = r.toString()) == null) && r.includes(n));
};
B.autoRemove = (e) => G(e);
var V = (e, t, n) => {
	var r;
	return ((r = e.getValue(t)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) === n?.toLowerCase();
};
V.autoRemove = (e) => G(e);
var te = (e, t, n) => e.getValue(t)?.includes(n);
te.autoRemove = (e) => G(e);
var H = (e, t, n) => !n.some((n) => {
	var r;
	return !((r = e.getValue(t)) != null && r.includes(n));
});
H.autoRemove = (e) => G(e) || !(e != null && e.length);
var ne = (e, t, n) => n.some((n) => e.getValue(t)?.includes(n));
ne.autoRemove = (e) => G(e) || !(e != null && e.length);
var re = (e, t, n) => e.getValue(t) === n;
re.autoRemove = (e) => G(e);
var ie = (e, t, n) => e.getValue(t) == n;
ie.autoRemove = (e) => G(e);
var U = (e, t, n) => {
	let [r, i] = n, a = e.getValue(t);
	return a >= r && a <= i;
};
U.resolveFilterValue = (e) => {
	let [t, n] = e, r = typeof t == "number" ? t : parseFloat(t), i = typeof n == "number" ? n : parseFloat(n), a = t === null || Number.isNaN(r) ? -Infinity : r, o = n === null || Number.isNaN(i) ? Infinity : i;
	if (a > o) {
		let e = a;
		a = o, o = e;
	}
	return [a, o];
}, U.autoRemove = (e) => G(e) || G(e[0]) && G(e[1]);
var W = {
	includesString: ee,
	includesStringSensitive: B,
	equalsString: V,
	arrIncludes: te,
	arrIncludesAll: H,
	arrIncludesSome: ne,
	equals: re,
	weakEquals: ie,
	inNumberRange: U
};
function G(e) {
	return e == null || e === "";
}
var ae = {
	getDefaultColumnDef: () => ({ filterFn: "auto" }),
	getInitialState: (e) => ({
		columnFilters: [],
		...e
	}),
	getDefaultOptions: (e) => ({
		onColumnFiltersChange: E("columnFilters", e),
		filterFromLeafRows: !1,
		maxLeafRowFilterDepth: 100
	}),
	createColumn: (e, t) => {
		e.getAutoFilterFn = () => {
			let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id);
			return typeof n == "string" ? W.includesString : typeof n == "number" ? W.inNumberRange : typeof n == "boolean" || typeof n == "object" && n ? W.equals : Array.isArray(n) ? W.arrIncludes : W.weakEquals;
		}, e.getFilterFn = () => D(e.columnDef.filterFn) ? e.columnDef.filterFn : e.columnDef.filterFn === "auto" ? e.getAutoFilterFn() : t.options.filterFns?.[e.columnDef.filterFn] ?? W[e.columnDef.filterFn], e.getCanFilter = () => (e.columnDef.enableColumnFilter ?? !0) && (t.options.enableColumnFilters ?? !0) && (t.options.enableFilters ?? !0) && !!e.accessorFn, e.getIsFiltered = () => e.getFilterIndex() > -1, e.getFilterValue = () => {
			var n;
			return (n = t.getState().columnFilters) == null || (n = n.find((t) => t.id === e.id)) == null ? void 0 : n.value;
		}, e.getFilterIndex = () => t.getState().columnFilters?.findIndex((t) => t.id === e.id) ?? -1, e.setFilterValue = (n) => {
			t.setColumnFilters((t) => {
				let r = e.getFilterFn(), i = t?.find((t) => t.id === e.id), a = T(n, i ? i.value : void 0);
				if (oe(r, a, e)) return t?.filter((t) => t.id !== e.id) ?? [];
				let o = {
					id: e.id,
					value: a
				};
				return i ? t?.map((t) => t.id === e.id ? o : t) ?? [] : t != null && t.length ? [...t, o] : [o];
			});
		};
	},
	createRow: (e, t) => {
		e.columnFilters = {}, e.columnFiltersMeta = {};
	},
	createTable: (e) => {
		e.setColumnFilters = (t) => {
			let n = e.getAllLeafColumns();
			e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange((e) => T(t, e)?.filter((e) => {
				let t = n.find((t) => t.id === e.id);
				return !(t && oe(t.getFilterFn(), e.value, t));
			}));
		}, e.resetColumnFilters = (t) => {
			e.setColumnFilters(t ? [] : e.initialState?.columnFilters ?? []);
		}, e.getPreFilteredRowModel = () => e.getCoreRowModel(), e.getFilteredRowModel = () => (!e._getFilteredRowModel && e.options.getFilteredRowModel && (e._getFilteredRowModel = e.options.getFilteredRowModel(e)), e.options.manualFiltering || !e._getFilteredRowModel ? e.getPreFilteredRowModel() : e._getFilteredRowModel());
	}
};
function oe(e, t, n) {
	return (e && e.autoRemove ? e.autoRemove(t, n) : !1) || t === void 0 || typeof t == "string" && !t;
}
var se = {
	sum: (e, t, n) => n.reduce((t, n) => {
		let r = n.getValue(e);
		return t + (typeof r == "number" ? r : 0);
	}, 0),
	min: (e, t, n) => {
		let r;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r > n || r === void 0 && n >= n) && (r = n);
		}), r;
	},
	max: (e, t, n) => {
		let r;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r < n || r === void 0 && n >= n) && (r = n);
		}), r;
	},
	extent: (e, t, n) => {
		let r, i;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r === void 0 ? n >= n && (r = i = n) : (r > n && (r = n), i < n && (i = n)));
		}), [r, i];
	},
	mean: (e, t) => {
		let n = 0, r = 0;
		if (t.forEach((t) => {
			let i = t.getValue(e);
			i != null && (i = +i) >= i && (++n, r += i);
		}), n) return r / n;
	},
	median: (e, t) => {
		if (!t.length) return;
		let n = t.map((t) => t.getValue(e));
		if (!O(n)) return;
		if (n.length === 1) return n[0];
		let r = Math.floor(n.length / 2), i = n.sort((e, t) => e - t);
		return n.length % 2 == 0 ? (i[r - 1] + i[r]) / 2 : i[r];
	},
	unique: (e, t) => Array.from(new Set(t.map((t) => t.getValue(e))).values()),
	uniqueCount: (e, t) => new Set(t.map((t) => t.getValue(e))).size,
	count: (e, t) => t.length
}, ce = {
	getDefaultColumnDef: () => ({
		aggregatedCell: (e) => {
			var t;
			return ((t = e.getValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null;
		},
		aggregationFn: "auto"
	}),
	getInitialState: (e) => ({
		grouping: [],
		...e
	}),
	getDefaultOptions: (e) => ({
		onGroupingChange: E("grouping", e),
		groupedColumnMode: "reorder"
	}),
	createColumn: (e, t) => {
		e.toggleGrouping = () => {
			t.setGrouping((t) => t != null && t.includes(e.id) ? t.filter((t) => t !== e.id) : [...t ?? [], e.id]);
		}, e.getCanGroup = () => (e.columnDef.enableGrouping ?? !0) && (t.options.enableGrouping ?? !0) && (!!e.accessorFn || !!e.columnDef.getGroupingValue), e.getIsGrouped = () => t.getState().grouping?.includes(e.id), e.getGroupedIndex = () => t.getState().grouping?.indexOf(e.id), e.getToggleGroupingHandler = () => {
			let t = e.getCanGroup();
			return () => {
				t && e.toggleGrouping();
			};
		}, e.getAutoAggregationFn = () => {
			let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id);
			if (typeof n == "number") return se.sum;
			if (Object.prototype.toString.call(n) === "[object Date]") return se.extent;
		}, e.getAggregationFn = () => {
			if (!e) throw Error();
			return D(e.columnDef.aggregationFn) ? e.columnDef.aggregationFn : e.columnDef.aggregationFn === "auto" ? e.getAutoAggregationFn() : t.options.aggregationFns?.[e.columnDef.aggregationFn] ?? se[e.columnDef.aggregationFn];
		};
	},
	createTable: (e) => {
		e.setGrouping = (t) => e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t), e.resetGrouping = (t) => {
			e.setGrouping(t ? [] : e.initialState?.grouping ?? []);
		}, e.getPreGroupedRowModel = () => e.getFilteredRowModel(), e.getGroupedRowModel = () => (!e._getGroupedRowModel && e.options.getGroupedRowModel && (e._getGroupedRowModel = e.options.getGroupedRowModel(e)), e.options.manualGrouping || !e._getGroupedRowModel ? e.getPreGroupedRowModel() : e._getGroupedRowModel());
	},
	createRow: (e, t) => {
		e.getIsGrouped = () => !!e.groupingColumnId, e.getGroupingValue = (n) => {
			if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
			let r = t.getColumn(n);
			return r != null && r.columnDef.getGroupingValue ? (e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original), e._groupingValuesCache[n]) : e.getValue(n);
		}, e._groupingValuesCache = {};
	},
	createCell: (e, t, n, r) => {
		e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId, e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped(), e.getIsAggregated = () => {
			var t;
			return !e.getIsGrouped() && !e.getIsPlaceholder() && !!((t = n.subRows) != null && t.length);
		};
	}
};
function le(e, t, n) {
	if (!(t != null && t.length) || !n) return e;
	let r = e.filter((e) => !t.includes(e.id));
	return n === "remove" ? r : [...t.map((t) => e.find((e) => e.id === t)).filter(Boolean), ...r];
}
var ue = {
	getInitialState: (e) => ({
		columnOrder: [],
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnOrderChange: E("columnOrder", e) }),
	createColumn: (e, t) => {
		e.getIndex = A((e) => [ye(t, e)], (t) => t.findIndex((t) => t.id === e.id), j(t.options, "debugColumns", "getIndex")), e.getIsFirstColumn = (n) => ye(t, n)[0]?.id === e.id, e.getIsLastColumn = (n) => {
			let r = ye(t, n);
			return r[r.length - 1]?.id === e.id;
		};
	},
	createTable: (e) => {
		e.setColumnOrder = (t) => e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t), e.resetColumnOrder = (t) => {
			e.setColumnOrder(t ? [] : e.initialState.columnOrder ?? []);
		}, e._getOrderColumnsFn = A(() => [
			e.getState().columnOrder,
			e.getState().grouping,
			e.options.groupedColumnMode
		], (e, t, n) => (r) => {
			let i = [];
			if (!(e != null && e.length)) i = r;
			else {
				let t = [...e], n = [...r];
				for (; n.length && t.length;) {
					let e = t.shift(), r = n.findIndex((t) => t.id === e);
					r > -1 && i.push(n.splice(r, 1)[0]);
				}
				i = [...i, ...n];
			}
			return le(i, t, n);
		}, j(e.options, "debugTable", "_getOrderColumnsFn"));
	}
}, de = () => ({
	left: [],
	right: []
}), fe = {
	getInitialState: (e) => ({
		columnPinning: de(),
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnPinningChange: E("columnPinning", e) }),
	createColumn: (e, t) => {
		e.pin = (n) => {
			let r = e.getLeafColumns().map((e) => e.id).filter(Boolean);
			t.setColumnPinning((e) => n === "right" ? {
				left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))),
				right: [...(e?.right ?? []).filter((e) => !(r != null && r.includes(e))), ...r]
			} : n === "left" ? {
				left: [...(e?.left ?? []).filter((e) => !(r != null && r.includes(e))), ...r],
				right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e)))
			} : {
				left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))),
				right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e)))
			});
		}, e.getCanPin = () => e.getLeafColumns().some((e) => (e.columnDef.enablePinning ?? !0) && (t.options.enableColumnPinning ?? t.options.enablePinning ?? !0)), e.getIsPinned = () => {
			let n = e.getLeafColumns().map((e) => e.id), { left: r, right: i } = t.getState().columnPinning, a = n.some((e) => r?.includes(e)), o = n.some((e) => i?.includes(e));
			return a ? "left" : o ? "right" : !1;
		}, e.getPinnedIndex = () => {
			var n;
			let r = e.getIsPinned();
			return r ? ((n = t.getState().columnPinning) == null || (n = n[r]) == null ? void 0 : n.indexOf(e.id)) ?? -1 : 0;
		};
	},
	createRow: (e, t) => {
		e.getCenterVisibleCells = A(() => [
			e._getAllVisibleCells(),
			t.getState().columnPinning.left,
			t.getState().columnPinning.right
		], (e, t, n) => {
			let r = [...t ?? [], ...n ?? []];
			return e.filter((e) => !r.includes(e.column.id));
		}, j(t.options, "debugRows", "getCenterVisibleCells")), e.getLeftVisibleCells = A(() => [e._getAllVisibleCells(), t.getState().columnPinning.left], (e, t) => (t ?? []).map((t) => e.find((e) => e.column.id === t)).filter(Boolean).map((e) => ({
			...e,
			position: "left"
		})), j(t.options, "debugRows", "getLeftVisibleCells")), e.getRightVisibleCells = A(() => [e._getAllVisibleCells(), t.getState().columnPinning.right], (e, t) => (t ?? []).map((t) => e.find((e) => e.column.id === t)).filter(Boolean).map((e) => ({
			...e,
			position: "right"
		})), j(t.options, "debugRows", "getRightVisibleCells"));
	},
	createTable: (e) => {
		e.setColumnPinning = (t) => e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t), e.resetColumnPinning = (t) => e.setColumnPinning(t ? de() : e.initialState?.columnPinning ?? de()), e.getIsSomeColumnsPinned = (t) => {
			let n = e.getState().columnPinning;
			return t ? !!n[t]?.length : !!(n.left?.length || n.right?.length);
		}, e.getLeftLeafColumns = A(() => [e.getAllLeafColumns(), e.getState().columnPinning.left], (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean), j(e.options, "debugColumns", "getLeftLeafColumns")), e.getRightLeafColumns = A(() => [e.getAllLeafColumns(), e.getState().columnPinning.right], (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean), j(e.options, "debugColumns", "getRightLeafColumns")), e.getCenterLeafColumns = A(() => [
			e.getAllLeafColumns(),
			e.getState().columnPinning.left,
			e.getState().columnPinning.right
		], (e, t, n) => {
			let r = [...t ?? [], ...n ?? []];
			return e.filter((e) => !r.includes(e.id));
		}, j(e.options, "debugColumns", "getCenterLeafColumns"));
	}
};
function pe(e) {
	return e || (typeof document < "u" ? document : null);
}
var me = {
	size: 150,
	minSize: 20,
	maxSize: 2 ** 53 - 1
}, he = () => ({
	startOffset: null,
	startSize: null,
	deltaOffset: null,
	deltaPercentage: null,
	isResizingColumn: !1,
	columnSizingStart: []
}), ge = {
	getDefaultColumnDef: () => me,
	getInitialState: (e) => ({
		columnSizing: {},
		columnSizingInfo: he(),
		...e
	}),
	getDefaultOptions: (e) => ({
		columnResizeMode: "onEnd",
		columnResizeDirection: "ltr",
		onColumnSizingChange: E("columnSizing", e),
		onColumnSizingInfoChange: E("columnSizingInfo", e)
	}),
	createColumn: (e, t) => {
		e.getSize = () => {
			let n = t.getState().columnSizing[e.id];
			return Math.min(Math.max(e.columnDef.minSize ?? me.minSize, n ?? e.columnDef.size ?? me.size), e.columnDef.maxSize ?? me.maxSize);
		}, e.getStart = A((e) => [
			e,
			ye(t, e),
			t.getState().columnSizing
		], (t, n) => n.slice(0, e.getIndex(t)).reduce((e, t) => e + t.getSize(), 0), j(t.options, "debugColumns", "getStart")), e.getAfter = A((e) => [
			e,
			ye(t, e),
			t.getState().columnSizing
		], (t, n) => n.slice(e.getIndex(t) + 1).reduce((e, t) => e + t.getSize(), 0), j(t.options, "debugColumns", "getAfter")), e.resetSize = () => {
			t.setColumnSizing((t) => {
				let { [e.id]: n, ...r } = t;
				return r;
			});
		}, e.getCanResize = () => (e.columnDef.enableResizing ?? !0) && (t.options.enableColumnResizing ?? !0), e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id;
	},
	createHeader: (e, t) => {
		e.getSize = () => {
			let t = 0, n = (e) => {
				e.subHeaders.length ? e.subHeaders.forEach(n) : t += e.column.getSize() ?? 0;
			};
			return n(e), t;
		}, e.getStart = () => {
			if (e.index > 0) {
				let t = e.headerGroup.headers[e.index - 1];
				return t.getStart() + t.getSize();
			}
			return 0;
		}, e.getResizeHandler = (n) => {
			let r = t.getColumn(e.column.id), i = r?.getCanResize();
			return (a) => {
				if (!r || !i || (a.persist == null || a.persist(), q(a) && a.touches && a.touches.length > 1)) return;
				let o = e.getSize(), s = e ? e.getLeafHeaders().map((e) => [e.column.id, e.column.getSize()]) : [[r.id, r.getSize()]], c = q(a) ? Math.round(a.touches[0].clientX) : a.clientX, l = {}, u = (e, n) => {
					typeof n == "number" && (t.setColumnSizingInfo((e) => {
						let r = t.options.columnResizeDirection === "rtl" ? -1 : 1, i = (n - (e?.startOffset ?? 0)) * r, a = Math.max(i / (e?.startSize ?? 0), -.999999);
						return e.columnSizingStart.forEach((e) => {
							let [t, n] = e;
							l[t] = Math.round(Math.max(n + n * a, 0) * 100) / 100;
						}), {
							...e,
							deltaOffset: i,
							deltaPercentage: a
						};
					}), (t.options.columnResizeMode === "onChange" || e === "end") && t.setColumnSizing((e) => ({
						...e,
						...l
					})));
				}, d = (e) => u("move", e), f = (e) => {
					u("end", e), t.setColumnSizingInfo((e) => ({
						...e,
						isResizingColumn: !1,
						startOffset: null,
						startSize: null,
						deltaOffset: null,
						deltaPercentage: null,
						columnSizingStart: []
					}));
				}, p = pe(n), m = {
					moveHandler: (e) => d(e.clientX),
					upHandler: (e) => {
						p?.removeEventListener("mousemove", m.moveHandler), p?.removeEventListener("mouseup", m.upHandler), f(e.clientX);
					}
				}, h = {
					moveHandler: (e) => (e.cancelable && (e.preventDefault(), e.stopPropagation()), d(e.touches[0].clientX), !1),
					upHandler: (e) => {
						p?.removeEventListener("touchmove", h.moveHandler), p?.removeEventListener("touchend", h.upHandler), e.cancelable && (e.preventDefault(), e.stopPropagation()), f(e.touches[0]?.clientX);
					}
				}, g = K() ? { passive: !1 } : !1;
				q(a) ? (p?.addEventListener("touchmove", h.moveHandler, g), p?.addEventListener("touchend", h.upHandler, g)) : (p?.addEventListener("mousemove", m.moveHandler, g), p?.addEventListener("mouseup", m.upHandler, g)), t.setColumnSizingInfo((e) => ({
					...e,
					startOffset: c,
					startSize: o,
					deltaOffset: 0,
					deltaPercentage: 0,
					columnSizingStart: s,
					isResizingColumn: r.id
				}));
			};
		};
	},
	createTable: (e) => {
		e.setColumnSizing = (t) => e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t), e.setColumnSizingInfo = (t) => e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(t), e.resetColumnSizing = (t) => {
			e.setColumnSizing(t ? {} : e.initialState.columnSizing ?? {});
		}, e.resetHeaderSizeInfo = (t) => {
			e.setColumnSizingInfo(t ? he() : e.initialState.columnSizingInfo ?? he());
		}, e.getTotalSize = () => e.getHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getLeftTotalSize = () => e.getLeftHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getCenterTotalSize = () => e.getCenterHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getRightTotalSize = () => e.getRightHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0;
	}
}, _e = null;
function K() {
	if (typeof _e == "boolean") return _e;
	let e = !1;
	try {
		let t = { get passive() {
			return e = !0, !1;
		} }, n = () => {};
		window.addEventListener("test", n, t), window.removeEventListener("test", n);
	} catch {
		e = !1;
	}
	return _e = e, _e;
}
function q(e) {
	return e.type === "touchstart";
}
var ve = {
	getInitialState: (e) => ({
		columnVisibility: {},
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnVisibilityChange: E("columnVisibility", e) }),
	createColumn: (e, t) => {
		e.toggleVisibility = (n) => {
			e.getCanHide() && t.setColumnVisibility((t) => ({
				...t,
				[e.id]: n ?? !e.getIsVisible()
			}));
		}, e.getIsVisible = () => {
			let n = e.columns;
			return (n.length ? n.some((e) => e.getIsVisible()) : t.getState().columnVisibility?.[e.id]) ?? !0;
		}, e.getCanHide = () => (e.columnDef.enableHiding ?? !0) && (t.options.enableHiding ?? !0), e.getToggleVisibilityHandler = () => (t) => {
			e.toggleVisibility == null || e.toggleVisibility(t.target.checked);
		};
	},
	createRow: (e, t) => {
		e._getAllVisibleCells = A(() => [e.getAllCells(), t.getState().columnVisibility], (e) => e.filter((e) => e.column.getIsVisible()), j(t.options, "debugRows", "_getAllVisibleCells")), e.getVisibleCells = A(() => [
			e.getLeftVisibleCells(),
			e.getCenterVisibleCells(),
			e.getRightVisibleCells()
		], (e, t, n) => [
			...e,
			...t,
			...n
		], j(t.options, "debugRows", "getVisibleCells"));
	},
	createTable: (e) => {
		let t = (t, n) => A(() => [n(), n().filter((e) => e.getIsVisible()).map((e) => e.id).join("_")], (e) => e.filter((e) => e.getIsVisible == null ? void 0 : e.getIsVisible()), j(e.options, "debugColumns", t));
		e.getVisibleFlatColumns = t("getVisibleFlatColumns", () => e.getAllFlatColumns()), e.getVisibleLeafColumns = t("getVisibleLeafColumns", () => e.getAllLeafColumns()), e.getLeftVisibleLeafColumns = t("getLeftVisibleLeafColumns", () => e.getLeftLeafColumns()), e.getRightVisibleLeafColumns = t("getRightVisibleLeafColumns", () => e.getRightLeafColumns()), e.getCenterVisibleLeafColumns = t("getCenterVisibleLeafColumns", () => e.getCenterLeafColumns()), e.setColumnVisibility = (t) => e.options.onColumnVisibilityChange == null ? void 0 : e.options.onColumnVisibilityChange(t), e.resetColumnVisibility = (t) => {
			e.setColumnVisibility(t ? {} : e.initialState.columnVisibility ?? {});
		}, e.toggleAllColumnsVisible = (t) => {
			t ??= !e.getIsAllColumnsVisible(), e.setColumnVisibility(e.getAllLeafColumns().reduce((e, n) => ({
				...e,
				[n.id]: t || !(n.getCanHide != null && n.getCanHide())
			}), {}));
		}, e.getIsAllColumnsVisible = () => !e.getAllLeafColumns().some((e) => !(e.getIsVisible != null && e.getIsVisible())), e.getIsSomeColumnsVisible = () => e.getAllLeafColumns().some((e) => e.getIsVisible == null ? void 0 : e.getIsVisible()), e.getToggleAllColumnsVisibilityHandler = () => (t) => {
			e.toggleAllColumnsVisible(t.target?.checked);
		};
	}
};
function ye(e, t) {
	return t ? t === "center" ? e.getCenterVisibleLeafColumns() : t === "left" ? e.getLeftVisibleLeafColumns() : e.getRightVisibleLeafColumns() : e.getVisibleLeafColumns();
}
var be = { createTable: (e) => {
	e._getGlobalFacetedRowModel = e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, "__global__"), e.getGlobalFacetedRowModel = () => e.options.manualFiltering || !e._getGlobalFacetedRowModel ? e.getPreFilteredRowModel() : e._getGlobalFacetedRowModel(), e._getGlobalFacetedUniqueValues = e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, "__global__"), e.getGlobalFacetedUniqueValues = () => e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : /* @__PURE__ */ new Map(), e._getGlobalFacetedMinMaxValues = e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, "__global__"), e.getGlobalFacetedMinMaxValues = () => {
		if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
	};
} }, xe = {
	getInitialState: (e) => ({
		globalFilter: void 0,
		...e
	}),
	getDefaultOptions: (e) => ({
		onGlobalFilterChange: E("globalFilter", e),
		globalFilterFn: "auto",
		getColumnCanGlobalFilter: (t) => {
			var n;
			let r = (n = e.getCoreRowModel().flatRows[0]) == null || (n = n._getAllCellsByColumnId()[t.id]) == null ? void 0 : n.getValue();
			return typeof r == "string" || typeof r == "number";
		}
	}),
	createColumn: (e, t) => {
		e.getCanGlobalFilter = () => (e.columnDef.enableGlobalFilter ?? !0) && (t.options.enableGlobalFilter ?? !0) && (t.options.enableFilters ?? !0) && ((t.options.getColumnCanGlobalFilter == null ? void 0 : t.options.getColumnCanGlobalFilter(e)) ?? !0) && !!e.accessorFn;
	},
	createTable: (e) => {
		e.getGlobalAutoFilterFn = () => W.includesString, e.getGlobalFilterFn = () => {
			let { globalFilterFn: t } = e.options;
			return D(t) ? t : t === "auto" ? e.getGlobalAutoFilterFn() : e.options.filterFns?.[t] ?? W[t];
		}, e.setGlobalFilter = (t) => {
			e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t);
		}, e.resetGlobalFilter = (t) => {
			e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter);
		};
	}
}, Se = {
	getInitialState: (e) => ({
		expanded: {},
		...e
	}),
	getDefaultOptions: (e) => ({
		onExpandedChange: E("expanded", e),
		paginateExpandedRows: !0
	}),
	createTable: (e) => {
		let t = !1, n = !1;
		e._autoResetExpanded = () => {
			if (!t) {
				e._queue(() => {
					t = !0;
				});
				return;
			}
			if (e.options.autoResetAll ?? e.options.autoResetExpanded ?? !e.options.manualExpanding) {
				if (n) return;
				n = !0, e._queue(() => {
					e.resetExpanded(), n = !1;
				});
			}
		}, e.setExpanded = (t) => e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(t), e.toggleAllRowsExpanded = (t) => {
			t ?? !e.getIsAllRowsExpanded() ? e.setExpanded(!0) : e.setExpanded({});
		}, e.resetExpanded = (t) => {
			e.setExpanded(t ? {} : e.initialState?.expanded ?? {});
		}, e.getCanSomeRowsExpand = () => e.getPrePaginationRowModel().flatRows.some((e) => e.getCanExpand()), e.getToggleAllRowsExpandedHandler = () => (t) => {
			t.persist == null || t.persist(), e.toggleAllRowsExpanded();
		}, e.getIsSomeRowsExpanded = () => {
			let t = e.getState().expanded;
			return t === !0 || Object.values(t).some(Boolean);
		}, e.getIsAllRowsExpanded = () => {
			let t = e.getState().expanded;
			return typeof t == "boolean" ? t === !0 : !(!Object.keys(t).length || e.getRowModel().flatRows.some((e) => !e.getIsExpanded()));
		}, e.getExpandedDepth = () => {
			let t = 0;
			return (e.getState().expanded === !0 ? Object.keys(e.getRowModel().rowsById) : Object.keys(e.getState().expanded)).forEach((e) => {
				let n = e.split(".");
				t = Math.max(t, n.length);
			}), t;
		}, e.getPreExpandedRowModel = () => e.getSortedRowModel(), e.getExpandedRowModel = () => (!e._getExpandedRowModel && e.options.getExpandedRowModel && (e._getExpandedRowModel = e.options.getExpandedRowModel(e)), e.options.manualExpanding || !e._getExpandedRowModel ? e.getPreExpandedRowModel() : e._getExpandedRowModel());
	},
	createRow: (e, t) => {
		e.toggleExpanded = (n) => {
			t.setExpanded((r) => {
				let i = r === !0 || !!(r != null && r[e.id]), a = {};
				if (r === !0 ? Object.keys(t.getRowModel().rowsById).forEach((e) => {
					a[e] = !0;
				}) : a = r, n ??= !i, !i && n) return {
					...a,
					[e.id]: !0
				};
				if (i && !n) {
					let { [e.id]: t, ...n } = a;
					return n;
				}
				return r;
			});
		}, e.getIsExpanded = () => {
			let n = t.getState().expanded;
			return !!((t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) ?? (n === !0 || n?.[e.id]));
		}, e.getCanExpand = () => {
			var n;
			return (t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) ?? ((t.options.enableExpanding ?? !0) && !!((n = e.subRows) != null && n.length));
		}, e.getIsAllParentsExpanded = () => {
			let n = !0, r = e;
			for (; n && r.parentId;) r = t.getRow(r.parentId, !0), n = r.getIsExpanded();
			return n;
		}, e.getToggleExpandedHandler = () => {
			let t = e.getCanExpand();
			return () => {
				t && e.toggleExpanded();
			};
		};
	}
}, Ce = 0, we = 10, Te = () => ({
	pageIndex: Ce,
	pageSize: we
}), Ee = {
	getInitialState: (e) => ({
		...e,
		pagination: {
			...Te(),
			...e?.pagination
		}
	}),
	getDefaultOptions: (e) => ({ onPaginationChange: E("pagination", e) }),
	createTable: (e) => {
		let t = !1, n = !1;
		e._autoResetPageIndex = () => {
			if (!t) {
				e._queue(() => {
					t = !0;
				});
				return;
			}
			if (e.options.autoResetAll ?? e.options.autoResetPageIndex ?? !e.options.manualPagination) {
				if (n) return;
				n = !0, e._queue(() => {
					e.resetPageIndex(), n = !1;
				});
			}
		}, e.setPagination = (t) => e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange((e) => T(t, e)), e.resetPagination = (t) => {
			e.setPagination(t ? Te() : e.initialState.pagination ?? Te());
		}, e.setPageIndex = (t) => {
			e.setPagination((n) => {
				let r = T(t, n.pageIndex), i = e.options.pageCount === void 0 || e.options.pageCount === -1 ? 2 ** 53 - 1 : e.options.pageCount - 1;
				return r = Math.max(0, Math.min(r, i)), {
					...n,
					pageIndex: r
				};
			});
		}, e.resetPageIndex = (t) => {
			var n;
			e.setPageIndex(t ? Ce : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageIndex) ?? Ce);
		}, e.resetPageSize = (t) => {
			var n;
			e.setPageSize(t ? we : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageSize) ?? we);
		}, e.setPageSize = (t) => {
			e.setPagination((e) => {
				let n = Math.max(1, T(t, e.pageSize)), r = e.pageSize * e.pageIndex, i = Math.floor(r / n);
				return {
					...e,
					pageIndex: i,
					pageSize: n
				};
			});
		}, e.setPageCount = (t) => e.setPagination((n) => {
			let r = T(t, e.options.pageCount ?? -1);
			return typeof r == "number" && (r = Math.max(-1, r)), {
				...n,
				pageCount: r
			};
		}), e.getPageOptions = A(() => [e.getPageCount()], (e) => {
			let t = [];
			return e && e > 0 && (t = [...Array(e)].fill(null).map((e, t) => t)), t;
		}, j(e.options, "debugTable", "getPageOptions")), e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0, e.getCanNextPage = () => {
			let { pageIndex: t } = e.getState().pagination, n = e.getPageCount();
			return n === -1 || n !== 0 && t < n - 1;
		}, e.previousPage = () => e.setPageIndex((e) => e - 1), e.nextPage = () => e.setPageIndex((e) => e + 1), e.firstPage = () => e.setPageIndex(0), e.lastPage = () => e.setPageIndex(e.getPageCount() - 1), e.getPrePaginationRowModel = () => e.getExpandedRowModel(), e.getPaginationRowModel = () => (!e._getPaginationRowModel && e.options.getPaginationRowModel && (e._getPaginationRowModel = e.options.getPaginationRowModel(e)), e.options.manualPagination || !e._getPaginationRowModel ? e.getPrePaginationRowModel() : e._getPaginationRowModel()), e.getPageCount = () => e.options.pageCount ?? Math.ceil(e.getRowCount() / e.getState().pagination.pageSize), e.getRowCount = () => e.options.rowCount ?? e.getPrePaginationRowModel().rows.length;
	}
}, De = () => ({
	top: [],
	bottom: []
}), Oe = {
	getInitialState: (e) => ({
		rowPinning: De(),
		...e
	}),
	getDefaultOptions: (e) => ({ onRowPinningChange: E("rowPinning", e) }),
	createRow: (e, t) => {
		e.pin = (n, r, i) => {
			let a = r ? e.getLeafRows().map((e) => {
				let { id: t } = e;
				return t;
			}) : [], o = i ? e.getParentRows().map((e) => {
				let { id: t } = e;
				return t;
			}) : [], s = /* @__PURE__ */ new Set([
				...o,
				e.id,
				...a
			]);
			t.setRowPinning((e) => n === "bottom" ? {
				top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))),
				bottom: [...(e?.bottom ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)]
			} : n === "top" ? {
				top: [...(e?.top ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)],
				bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e)))
			} : {
				top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))),
				bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e)))
			});
		}, e.getCanPin = () => {
			let { enableRowPinning: n, enablePinning: r } = t.options;
			return typeof n == "function" ? n(e) : n ?? r ?? !0;
		}, e.getIsPinned = () => {
			let n = [e.id], { top: r, bottom: i } = t.getState().rowPinning, a = n.some((e) => r?.includes(e)), o = n.some((e) => i?.includes(e));
			return a ? "top" : o ? "bottom" : !1;
		}, e.getPinnedIndex = () => {
			let n = e.getIsPinned();
			return n ? ((n === "top" ? t.getTopRows() : t.getBottomRows())?.map((e) => {
				let { id: t } = e;
				return t;
			}))?.indexOf(e.id) ?? -1 : -1;
		};
	},
	createTable: (e) => {
		e.setRowPinning = (t) => e.options.onRowPinningChange == null ? void 0 : e.options.onRowPinningChange(t), e.resetRowPinning = (t) => e.setRowPinning(t ? De() : e.initialState?.rowPinning ?? De()), e.getIsSomeRowsPinned = (t) => {
			let n = e.getState().rowPinning;
			return t ? !!n[t]?.length : !!(n.top?.length || n.bottom?.length);
		}, e._getPinnedRows = (t, n, r) => (e.options.keepPinnedRows ?? !0 ? (n ?? []).map((t) => {
			let n = e.getRow(t, !0);
			return n.getIsAllParentsExpanded() ? n : null;
		}) : (n ?? []).map((e) => t.find((t) => t.id === e))).filter(Boolean).map((e) => ({
			...e,
			position: r
		})), e.getTopRows = A(() => [e.getRowModel().rows, e.getState().rowPinning.top], (t, n) => e._getPinnedRows(t, n, "top"), j(e.options, "debugRows", "getTopRows")), e.getBottomRows = A(() => [e.getRowModel().rows, e.getState().rowPinning.bottom], (t, n) => e._getPinnedRows(t, n, "bottom"), j(e.options, "debugRows", "getBottomRows")), e.getCenterRows = A(() => [
			e.getRowModel().rows,
			e.getState().rowPinning.top,
			e.getState().rowPinning.bottom
		], (e, t, n) => {
			let r = /* @__PURE__ */ new Set([...t ?? [], ...n ?? []]);
			return e.filter((e) => !r.has(e.id));
		}, j(e.options, "debugRows", "getCenterRows"));
	}
}, ke = {
	getInitialState: (e) => ({
		rowSelection: {},
		...e
	}),
	getDefaultOptions: (e) => ({
		onRowSelectionChange: E("rowSelection", e),
		enableRowSelection: !0,
		enableMultiRowSelection: !0,
		enableSubRowSelection: !0
	}),
	createTable: (e) => {
		e.setRowSelection = (t) => e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t), e.resetRowSelection = (t) => e.setRowSelection(t ? {} : e.initialState.rowSelection ?? {}), e.toggleAllRowsSelected = (t) => {
			e.setRowSelection((n) => {
				t = t === void 0 ? !e.getIsAllRowsSelected() : t;
				let r = { ...n }, i = e.getPreGroupedRowModel().flatRows;
				return t ? i.forEach((e) => {
					e.getCanSelect() && (r[e.id] = !0);
				}) : i.forEach((e) => {
					delete r[e.id];
				}), r;
			});
		}, e.toggleAllPageRowsSelected = (t) => e.setRowSelection((n) => {
			let r = t === void 0 ? !e.getIsAllPageRowsSelected() : t, i = { ...n };
			return e.getRowModel().rows.forEach((t) => {
				Ae(i, t.id, r, !0, e);
			}), i;
		}), e.getPreSelectedRowModel = () => e.getCoreRowModel(), e.getSelectedRowModel = A(() => [e.getState().rowSelection, e.getCoreRowModel()], (t, n) => Object.keys(t).length ? je(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, j(e.options, "debugTable", "getSelectedRowModel")), e.getFilteredSelectedRowModel = A(() => [e.getState().rowSelection, e.getFilteredRowModel()], (t, n) => Object.keys(t).length ? je(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, j(e.options, "debugTable", "getFilteredSelectedRowModel")), e.getGroupedSelectedRowModel = A(() => [e.getState().rowSelection, e.getSortedRowModel()], (t, n) => Object.keys(t).length ? je(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, j(e.options, "debugTable", "getGroupedSelectedRowModel")), e.getIsAllRowsSelected = () => {
			let t = e.getFilteredRowModel().flatRows, { rowSelection: n } = e.getState(), r = !!(t.length && Object.keys(n).length);
			return r && t.some((e) => e.getCanSelect() && !n[e.id]) && (r = !1), r;
		}, e.getIsAllPageRowsSelected = () => {
			let t = e.getPaginationRowModel().flatRows.filter((e) => e.getCanSelect()), { rowSelection: n } = e.getState(), r = !!t.length;
			return r && t.some((e) => !n[e.id]) && (r = !1), r;
		}, e.getIsSomeRowsSelected = () => {
			let t = Object.keys(e.getState().rowSelection ?? {}).length;
			return t > 0 && t < e.getFilteredRowModel().flatRows.length;
		}, e.getIsSomePageRowsSelected = () => {
			let t = e.getPaginationRowModel().flatRows;
			return !e.getIsAllPageRowsSelected() && t.filter((e) => e.getCanSelect()).some((e) => e.getIsSelected() || e.getIsSomeSelected());
		}, e.getToggleAllRowsSelectedHandler = () => (t) => {
			e.toggleAllRowsSelected(t.target.checked);
		}, e.getToggleAllPageRowsSelectedHandler = () => (t) => {
			e.toggleAllPageRowsSelected(t.target.checked);
		};
	},
	createRow: (e, t) => {
		e.toggleSelected = (n, r) => {
			let i = e.getIsSelected();
			t.setRowSelection((a) => {
				if (n = n === void 0 ? !i : n, e.getCanSelect() && i === n) return a;
				let o = { ...a };
				return Ae(o, e.id, n, r?.selectChildren ?? !0, t), o;
			});
		}, e.getIsSelected = () => {
			let { rowSelection: n } = t.getState();
			return Me(e, n);
		}, e.getIsSomeSelected = () => {
			let { rowSelection: n } = t.getState();
			return Ne(e, n) === "some";
		}, e.getIsAllSubRowsSelected = () => {
			let { rowSelection: n } = t.getState();
			return Ne(e, n) === "all";
		}, e.getCanSelect = () => typeof t.options.enableRowSelection == "function" ? t.options.enableRowSelection(e) : t.options.enableRowSelection ?? !0, e.getCanSelectSubRows = () => typeof t.options.enableSubRowSelection == "function" ? t.options.enableSubRowSelection(e) : t.options.enableSubRowSelection ?? !0, e.getCanMultiSelect = () => typeof t.options.enableMultiRowSelection == "function" ? t.options.enableMultiRowSelection(e) : t.options.enableMultiRowSelection ?? !0, e.getToggleSelectedHandler = () => {
			let t = e.getCanSelect();
			return (n) => {
				t && e.toggleSelected(n.target?.checked);
			};
		};
	}
}, Ae = (e, t, n, r, i) => {
	var a;
	let o = i.getRow(t, !0);
	n ? (o.getCanMultiSelect() || Object.keys(e).forEach((t) => delete e[t]), o.getCanSelect() && (e[t] = !0)) : delete e[t], r && (a = o.subRows) != null && a.length && o.getCanSelectSubRows() && o.subRows.forEach((t) => Ae(e, t.id, n, r, i));
};
function je(e, t) {
	let n = e.getState().rowSelection, r = [], i = {}, a = function(e, t) {
		return e.map((e) => {
			var t;
			let o = Me(e, n);
			if (o && (r.push(e), i[e.id] = e), (t = e.subRows) != null && t.length && (e = {
				...e,
				subRows: a(e.subRows)
			}), o) return e;
		}).filter(Boolean);
	};
	return {
		rows: a(t.rows),
		flatRows: r,
		rowsById: i
	};
}
function Me(e, t) {
	return t[e.id] ?? !1;
}
function Ne(e, t, n) {
	var r;
	if (!((r = e.subRows) != null && r.length)) return !1;
	let i = !0, a = !1;
	return e.subRows.forEach((e) => {
		if (!(a && !i) && (e.getCanSelect() && (Me(e, t) ? a = !0 : i = !1), e.subRows && e.subRows.length)) {
			let n = Ne(e, t);
			n === "all" ? a = !0 : (n === "some" && (a = !0), i = !1);
		}
	}), i ? "all" : a ? "some" : !1;
}
var Pe = /([0-9]+)/gm, Fe = (e, t, n) => Ve(Y(e.getValue(n)).toLowerCase(), Y(t.getValue(n)).toLowerCase()), Ie = (e, t, n) => Ve(Y(e.getValue(n)), Y(t.getValue(n))), Le = (e, t, n) => Be(Y(e.getValue(n)).toLowerCase(), Y(t.getValue(n)).toLowerCase()), J = (e, t, n) => Be(Y(e.getValue(n)), Y(t.getValue(n))), Re = (e, t, n) => {
	let r = e.getValue(n), i = t.getValue(n);
	return r > i ? 1 : r < i ? -1 : 0;
}, ze = (e, t, n) => Be(e.getValue(n), t.getValue(n));
function Be(e, t) {
	return e === t ? 0 : e > t ? 1 : -1;
}
function Y(e) {
	return typeof e == "number" ? isNaN(e) || e === Infinity || e === -Infinity ? "" : String(e) : typeof e == "string" ? e : "";
}
function Ve(e, t) {
	let n = e.split(Pe).filter(Boolean), r = t.split(Pe).filter(Boolean);
	for (; n.length && r.length;) {
		let e = n.shift(), t = r.shift(), i = parseInt(e, 10), a = parseInt(t, 10), o = [i, a].sort();
		if (isNaN(o[0])) {
			if (e > t) return 1;
			if (t > e) return -1;
			continue;
		}
		if (isNaN(o[1])) return isNaN(i) ? -1 : 1;
		if (i > a) return 1;
		if (a > i) return -1;
	}
	return n.length - r.length;
}
var X = {
	alphanumeric: Fe,
	alphanumericCaseSensitive: Ie,
	text: Le,
	textCaseSensitive: J,
	datetime: Re,
	basic: ze
}, He = [
	I,
	ve,
	ue,
	fe,
	z,
	ae,
	be,
	xe,
	{
		getInitialState: (e) => ({
			sorting: [],
			...e
		}),
		getDefaultColumnDef: () => ({
			sortingFn: "auto",
			sortUndefined: 1
		}),
		getDefaultOptions: (e) => ({
			onSortingChange: E("sorting", e),
			isMultiSortEvent: (e) => e.shiftKey
		}),
		createColumn: (e, t) => {
			e.getAutoSortingFn = () => {
				let n = t.getFilteredRowModel().flatRows.slice(10), r = !1;
				for (let t of n) {
					let n = t?.getValue(e.id);
					if (Object.prototype.toString.call(n) === "[object Date]") return X.datetime;
					if (typeof n == "string" && (r = !0, n.split(Pe).length > 1)) return X.alphanumeric;
				}
				return r ? X.text : X.basic;
			}, e.getAutoSortDir = () => typeof t.getFilteredRowModel().flatRows[0]?.getValue(e.id) == "string" ? "asc" : "desc", e.getSortingFn = () => {
				if (!e) throw Error();
				return D(e.columnDef.sortingFn) ? e.columnDef.sortingFn : e.columnDef.sortingFn === "auto" ? e.getAutoSortingFn() : t.options.sortingFns?.[e.columnDef.sortingFn] ?? X[e.columnDef.sortingFn];
			}, e.toggleSorting = (n, r) => {
				let i = e.getNextSortingOrder(), a = n != null;
				t.setSorting((o) => {
					let s = o?.find((t) => t.id === e.id), c = o?.findIndex((t) => t.id === e.id), l = [], u, d = a ? n : i === "desc";
					return u = o != null && o.length && e.getCanMultiSort() && r ? s ? "toggle" : "add" : o != null && o.length && c !== o.length - 1 ? "replace" : s ? "toggle" : "replace", u === "toggle" && (a || i || (u = "remove")), u === "add" ? (l = [...o, {
						id: e.id,
						desc: d
					}], l.splice(0, l.length - (t.options.maxMultiSortColCount ?? 2 ** 53 - 1))) : l = u === "toggle" ? o.map((t) => t.id === e.id ? {
						...t,
						desc: d
					} : t) : u === "remove" ? o.filter((t) => t.id !== e.id) : [{
						id: e.id,
						desc: d
					}], l;
				});
			}, e.getFirstSortDir = () => e.columnDef.sortDescFirst ?? t.options.sortDescFirst ?? e.getAutoSortDir() === "desc" ? "desc" : "asc", e.getNextSortingOrder = (n) => {
				let r = e.getFirstSortDir(), i = e.getIsSorted();
				return i ? i !== r && (t.options.enableSortingRemoval ?? !0) && (!n || (t.options.enableMultiRemove ?? !0)) ? !1 : i === "desc" ? "asc" : "desc" : r;
			}, e.getCanSort = () => (e.columnDef.enableSorting ?? !0) && (t.options.enableSorting ?? !0) && !!e.accessorFn, e.getCanMultiSort = () => e.columnDef.enableMultiSort ?? t.options.enableMultiSort ?? !!e.accessorFn, e.getIsSorted = () => {
				let n = t.getState().sorting?.find((t) => t.id === e.id);
				return n ? n.desc ? "desc" : "asc" : !1;
			}, e.getSortIndex = () => t.getState().sorting?.findIndex((t) => t.id === e.id) ?? -1, e.clearSorting = () => {
				t.setSorting((t) => t != null && t.length ? t.filter((t) => t.id !== e.id) : []);
			}, e.getToggleSortingHandler = () => {
				let n = e.getCanSort();
				return (r) => {
					n && (r.persist == null || r.persist(), e.toggleSorting == null || e.toggleSorting(void 0, e.getCanMultiSort() ? t.options.isMultiSortEvent == null ? void 0 : t.options.isMultiSortEvent(r) : !1));
				};
			};
		},
		createTable: (e) => {
			e.setSorting = (t) => e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t), e.resetSorting = (t) => {
				e.setSorting(t ? [] : e.initialState?.sorting ?? []);
			}, e.getPreSortedRowModel = () => e.getGroupedRowModel(), e.getSortedRowModel = () => (!e._getSortedRowModel && e.options.getSortedRowModel && (e._getSortedRowModel = e.options.getSortedRowModel(e)), e.options.manualSorting || !e._getSortedRowModel ? e.getPreSortedRowModel() : e._getSortedRowModel());
		}
	},
	ce,
	Se,
	Ee,
	Oe,
	ke,
	ge
];
function Ue(e) {
	process.env.NODE_ENV !== "production" && (e.debugAll || e.debugTable) && console.info("Creating Table Instance...");
	let t = [...He, ...e._features ?? []], n = { _features: t }, r = n._features.reduce((e, t) => Object.assign(e, t.getDefaultOptions == null ? void 0 : t.getDefaultOptions(n)), {}), i = (e) => n.options.mergeOptions ? n.options.mergeOptions(r, e) : {
		...r,
		...e
	}, a = { ...e.initialState ?? {} };
	n._features.forEach((e) => {
		a = (e.getInitialState == null ? void 0 : e.getInitialState(a)) ?? a;
	});
	let o = [], s = !1, c = {
		_features: t,
		options: {
			...r,
			...e
		},
		initialState: a,
		_queue: (e) => {
			o.push(e), s || (s = !0, Promise.resolve().then(() => {
				for (; o.length;) o.shift()();
				s = !1;
			}).catch((e) => setTimeout(() => {
				throw e;
			})));
		},
		reset: () => {
			n.setState(n.initialState);
		},
		setOptions: (e) => {
			let t = T(e, n.options);
			n.options = i(t);
		},
		getState: () => n.options.state,
		setState: (e) => {
			n.options.onStateChange == null || n.options.onStateChange(e);
		},
		_getRowId: (e, t, r) => (n.options.getRowId == null ? void 0 : n.options.getRowId(e, t, r)) ?? `${r ? [r.id, t].join(".") : t}`,
		getCoreRowModel: () => (n._getCoreRowModel ||= n.options.getCoreRowModel(n), n._getCoreRowModel()),
		getRowModel: () => n.getPaginationRowModel(),
		getRow: (e, t) => {
			let r = (t ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[e];
			if (!r && (r = n.getCoreRowModel().rowsById[e], !r)) throw process.env.NODE_ENV === "production" ? Error() : Error(`getRow could not find row with ID: ${e}`);
			return r;
		},
		_getDefaultColumnDef: A(() => [n.options.defaultColumn], (e) => (e ??= {}, {
			header: (e) => {
				let t = e.header.column.columnDef;
				return t.accessorKey ? t.accessorKey : t.accessorFn ? t.id : null;
			},
			cell: (e) => {
				var t;
				return ((t = e.renderValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null;
			},
			...n._features.reduce((e, t) => Object.assign(e, t.getDefaultColumnDef == null ? void 0 : t.getDefaultColumnDef()), {}),
			...e
		}), j(e, "debugColumns", "_getDefaultColumnDef")),
		_getColumnDefs: () => n.options.columns,
		getAllColumns: A(() => [n._getColumnDefs()], (e) => {
			let t = function(e, r, i) {
				return i === void 0 && (i = 0), e.map((e) => {
					let a = N(n, e, i, r), o = e;
					return a.columns = o.columns ? t(o.columns, a, i + 1) : [], a;
				});
			};
			return t(e);
		}, j(e, "debugColumns", "getAllColumns")),
		getAllFlatColumns: A(() => [n.getAllColumns()], (e) => e.flatMap((e) => e.getFlatColumns()), j(e, "debugColumns", "getAllFlatColumns")),
		_getAllFlatColumnsById: A(() => [n.getAllFlatColumns()], (e) => e.reduce((e, t) => (e[t.id] = t, e), {}), j(e, "debugColumns", "getAllFlatColumnsById")),
		getAllLeafColumns: A(() => [n.getAllColumns(), n._getOrderColumnsFn()], (e, t) => t(e.flatMap((e) => e.getLeafColumns())), j(e, "debugColumns", "getAllLeafColumns")),
		getColumn: (e) => {
			let t = n._getAllFlatColumnsById()[e];
			return process.env.NODE_ENV !== "production" && !t && console.error(`[Table] Column with id '${e}' does not exist.`), t;
		}
	};
	Object.assign(n, c);
	for (let e = 0; e < n._features.length; e++) {
		let t = n._features[e];
		t == null || t.createTable == null || t.createTable(n);
	}
	return n;
}
function We() {
	return (e) => A(() => [e.options.data], (t) => {
		let n = {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, r = function(t, i, a) {
			i === void 0 && (i = 0);
			let o = [];
			for (let c = 0; c < t.length; c++) {
				let l = R(e, e._getRowId(t[c], c, a), t[c], c, i, void 0, a?.id);
				if (n.flatRows.push(l), n.rowsById[l.id] = l, o.push(l), e.options.getSubRows) {
					var s;
					l.originalSubRows = e.options.getSubRows(t[c], c), (s = l.originalSubRows) != null && s.length && (l.subRows = r(l.originalSubRows, i + 1, l));
				}
			}
			return o;
		};
		return n.rows = r(t), n;
	}, j(e.options, "debugTable", "getRowModel", () => e._autoResetPageIndex()));
}
function Ge() {
	return (e) => A(() => [
		e.getState().expanded,
		e.getPreExpandedRowModel(),
		e.options.paginateExpandedRows
	], (e, t, n) => !t.rows.length || e !== !0 && !Object.keys(e ?? {}).length || !n ? t : Ke(t), j(e.options, "debugTable", "getExpandedRowModel"));
}
function Ke(e) {
	let t = [], n = (e) => {
		var r;
		t.push(e), (r = e.subRows) != null && r.length && e.getIsExpanded() && e.subRows.forEach(n);
	};
	return e.rows.forEach(n), {
		rows: t,
		flatRows: e.flatRows,
		rowsById: e.rowsById
	};
}
function qe(e, t, n) {
	return n.options.filterFromLeafRows ? Je(e, t, n) : Ye(e, t, n);
}
function Je(e, t, n) {
	let r = [], i = {}, a = n.options.maxLeafRowFilterDepth ?? 100, o = function(e, s) {
		s === void 0 && (s = 0);
		let c = [];
		for (let u = 0; u < e.length; u++) {
			var l;
			let d = e[u], f = R(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
			if (f.columnFilters = d.columnFilters, (l = d.subRows) != null && l.length && s < a) {
				if (f.subRows = o(d.subRows, s + 1), d = f, t(d) && !f.subRows.length) {
					c.push(d), i[d.id] = d, r.push(d);
					continue;
				}
				if (t(d) || f.subRows.length) {
					c.push(d), i[d.id] = d, r.push(d);
					continue;
				}
			} else d = f, t(d) && (c.push(d), i[d.id] = d, r.push(d));
		}
		return c;
	};
	return {
		rows: o(e),
		flatRows: r,
		rowsById: i
	};
}
function Ye(e, t, n) {
	let r = [], i = {}, a = n.options.maxLeafRowFilterDepth ?? 100, o = function(e, s) {
		s === void 0 && (s = 0);
		let c = [];
		for (let u = 0; u < e.length; u++) {
			let d = e[u];
			if (t(d)) {
				var l;
				if ((l = d.subRows) != null && l.length && s < a) {
					let e = R(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
					e.subRows = o(d.subRows, s + 1), d = e;
				}
				c.push(d), r.push(d), i[d.id] = d;
			}
		}
		return c;
	};
	return {
		rows: o(e),
		flatRows: r,
		rowsById: i
	};
}
function Xe() {
	return (e, t) => A(() => [
		e.getPreFilteredRowModel(),
		e.getState().columnFilters,
		e.getState().globalFilter,
		e.getFilteredRowModel()
	], (n, r, i) => {
		if (!n.rows.length || !(r != null && r.length) && !i) return n;
		let a = [...r.map((e) => e.id).filter((e) => e !== t), i ? "__global__" : void 0].filter(Boolean);
		return qe(n.rows, (e) => {
			for (let t = 0; t < a.length; t++) if (e.columnFilters[a[t]] === !1) return !1;
			return !0;
		}, e);
	}, j(e.options, "debugTable", "getFacetedRowModel"));
}
function Ze() {
	return (e, t) => A(() => [e.getColumn(t)?.getFacetedRowModel()], (e) => {
		if (!e) return /* @__PURE__ */ new Map();
		let n = /* @__PURE__ */ new Map();
		for (let r = 0; r < e.flatRows.length; r++) {
			let i = e.flatRows[r].getUniqueValues(t);
			for (let e = 0; e < i.length; e++) {
				let t = i[e];
				n.has(t) ? n.set(t, (n.get(t) ?? 0) + 1) : n.set(t, 1);
			}
		}
		return n;
	}, j(e.options, "debugTable", `getFacetedUniqueValues_${t}`));
}
function Z() {
	return (e) => A(() => [
		e.getPreFilteredRowModel(),
		e.getState().columnFilters,
		e.getState().globalFilter
	], (t, n, r) => {
		if (!t.rows.length || !(n != null && n.length) && !r) {
			for (let e = 0; e < t.flatRows.length; e++) t.flatRows[e].columnFilters = {}, t.flatRows[e].columnFiltersMeta = {};
			return t;
		}
		let i = [], a = [];
		(n ?? []).forEach((t) => {
			let n = e.getColumn(t.id);
			if (!n) return;
			let r = n.getFilterFn();
			if (!r) {
				process.env.NODE_ENV !== "production" && console.warn(`Could not find a valid 'column.filterFn' for column with the ID: ${n.id}.`);
				return;
			}
			i.push({
				id: t.id,
				filterFn: r,
				resolvedValue: (r.resolveFilterValue == null ? void 0 : r.resolveFilterValue(t.value)) ?? t.value
			});
		});
		let o = (n ?? []).map((e) => e.id), s = e.getGlobalFilterFn(), c = e.getAllLeafColumns().filter((e) => e.getCanGlobalFilter());
		r && s && c.length && (o.push("__global__"), c.forEach((e) => {
			a.push({
				id: e.id,
				filterFn: s,
				resolvedValue: (s.resolveFilterValue == null ? void 0 : s.resolveFilterValue(r)) ?? r
			});
		}));
		let l, u;
		for (let e = 0; e < t.flatRows.length; e++) {
			let n = t.flatRows[e];
			if (n.columnFilters = {}, i.length) for (let e = 0; e < i.length; e++) {
				l = i[e];
				let t = l.id;
				n.columnFilters[t] = l.filterFn(n, t, l.resolvedValue, (e) => {
					n.columnFiltersMeta[t] = e;
				});
			}
			if (a.length) {
				for (let e = 0; e < a.length; e++) {
					u = a[e];
					let t = u.id;
					if (u.filterFn(n, t, u.resolvedValue, (e) => {
						n.columnFiltersMeta[t] = e;
					})) {
						n.columnFilters.__global__ = !0;
						break;
					}
				}
				n.columnFilters.__global__ !== !0 && (n.columnFilters.__global__ = !1);
			}
		}
		return qe(t.rows, (e) => {
			for (let t = 0; t < o.length; t++) if (e.columnFilters[o[t]] === !1) return !1;
			return !0;
		}, e);
	}, j(e.options, "debugTable", "getFilteredRowModel", () => e._autoResetPageIndex()));
}
function Qe() {
	return (e) => A(() => [e.getState().grouping, e.getPreGroupedRowModel()], (t, n) => {
		if (!n.rows.length || !t.length) return n.rows.forEach((e) => {
			e.depth = 0, e.parentId = void 0;
		}), n;
		let r = t.filter((t) => e.getColumn(t)), i = [], a = {}, o = function(t, n, s) {
			if (n === void 0 && (n = 0), n >= r.length) return t.map((e) => (e.depth = n, i.push(e), a[e.id] = e, e.subRows &&= o(e.subRows, n + 1, e.id), e));
			let c = r[n], l = $e(t, c);
			return Array.from(l.entries()).map((t, l) => {
				let [u, d] = t, f = `${c}:${u}`;
				f = s ? `${s}>${f}` : f;
				let p = o(d, n + 1, f);
				p.forEach((e) => {
					e.parentId = f;
				});
				let m = n ? k(d, (e) => e.subRows) : d, h = R(e, f, m[0].original, l, n, void 0, s);
				return Object.assign(h, {
					groupingColumnId: c,
					groupingValue: u,
					subRows: p,
					leafRows: m,
					getValue: (t) => {
						if (r.includes(t)) return h._valuesCache.hasOwnProperty(t) || d[0] && (h._valuesCache[t] = d[0].getValue(t) ?? void 0), h._valuesCache[t];
						if (h._groupingValuesCache.hasOwnProperty(t)) return h._groupingValuesCache[t];
						let n = e.getColumn(t)?.getAggregationFn();
						if (n) return h._groupingValuesCache[t] = n(t, m, d), h._groupingValuesCache[t];
					}
				}), p.forEach((e) => {
					i.push(e), a[e.id] = e;
				}), h;
			});
		}, s = o(n.rows, 0);
		return s.forEach((e) => {
			i.push(e), a[e.id] = e;
		}), {
			rows: s,
			flatRows: i,
			rowsById: a
		};
	}, j(e.options, "debugTable", "getGroupedRowModel", () => {
		e._queue(() => {
			e._autoResetExpanded(), e._autoResetPageIndex();
		});
	}));
}
function $e(e, t) {
	let n = /* @__PURE__ */ new Map();
	return e.reduce((e, n) => {
		let r = `${n.getGroupingValue(t)}`, i = e.get(r);
		return i ? i.push(n) : e.set(r, [n]), e;
	}, n);
}
function et(e) {
	return (e) => A(() => [
		e.getState().pagination,
		e.getPrePaginationRowModel(),
		e.options.paginateExpandedRows ? void 0 : e.getState().expanded
	], (t, n) => {
		if (!n.rows.length) return n;
		let { pageSize: r, pageIndex: i } = t, { rows: a, flatRows: o, rowsById: s } = n, c = r * i, l = c + r;
		a = a.slice(c, l);
		let u;
		u = e.options.paginateExpandedRows ? {
			rows: a,
			flatRows: o,
			rowsById: s
		} : Ke({
			rows: a,
			flatRows: o,
			rowsById: s
		}), u.flatRows = [];
		let d = (e) => {
			u.flatRows.push(e), e.subRows.length && e.subRows.forEach(d);
		};
		return u.rows.forEach(d), u;
	}, j(e.options, "debugTable", "getPaginationRowModel"));
}
function tt() {
	return (e) => A(() => [e.getState().sorting, e.getPreSortedRowModel()], (t, n) => {
		if (!n.rows.length || !(t != null && t.length)) return n;
		let r = e.getState().sorting, i = [], a = r.filter((t) => e.getColumn(t.id)?.getCanSort()), o = {};
		a.forEach((t) => {
			let n = e.getColumn(t.id);
			n && (o[t.id] = {
				sortUndefined: n.columnDef.sortUndefined,
				invertSorting: n.columnDef.invertSorting,
				sortingFn: n.getSortingFn()
			});
		});
		let s = (e) => {
			let t = e.map((e) => ({ ...e }));
			return t.sort((e, t) => {
				for (let n = 0; n < a.length; n += 1) {
					let r = a[n], i = o[r.id], s = i.sortUndefined, c = r?.desc ?? !1, l = 0;
					if (s) {
						let n = e.getValue(r.id), i = t.getValue(r.id), a = n === void 0, o = i === void 0;
						if (a || o) {
							if (s === "first") return a ? -1 : 1;
							if (s === "last") return a ? 1 : -1;
							l = a && o ? 0 : a ? s : -s;
						}
					}
					if (l === 0 && (l = i.sortingFn(e, t, r.id)), l !== 0) return c && (l *= -1), i.invertSorting && (l *= -1), l;
				}
				return e.index - t.index;
			}), t.forEach((e) => {
				var t;
				i.push(e), (t = e.subRows) != null && t.length && (e.subRows = s(e.subRows));
			}), t;
		};
		return {
			rows: s(n.rows),
			flatRows: i,
			rowsById: n.rowsById
		};
	}, j(e.options, "debugTable", "getSortedRowModel", () => e._autoResetPageIndex()));
}
//#endregion
//#region node_modules/@tanstack/react-table/build/lib/index.mjs
function nt(e, t) {
	return e ? rt(e) ? /*#__PURE__*/ u.createElement(e, t) : e : null;
}
function rt(e) {
	return it(e) || typeof e == "function" || at(e);
}
function it(e) {
	return typeof e == "function" && (() => {
		let t = Object.getPrototypeOf(e);
		return t.prototype && t.prototype.isReactComponent;
	})();
}
function at(e) {
	return typeof e == "object" && typeof e.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(e.$$typeof.description);
}
function ot(e) {
	let t = {
		state: {},
		onStateChange: () => {},
		renderFallbackValue: null,
		...e
	}, [n] = u.useState(() => ({ current: Ue(t) })), [r, i] = u.useState(() => n.current.initialState);
	return n.current.setOptions((t) => ({
		...t,
		...e,
		state: {
			...r,
			...e.state
		},
		onStateChange: (t) => {
			i(t), e.onStateChange == null || e.onStateChange(t);
		}
	})), n.current;
}
//#endregion
//#region src/core/dataTypeRegistry.ts
var st = {
	text: {
		numeric: !1,
		defaultFilter: "text"
	},
	number: {
		numeric: !0,
		defaultFilter: "number"
	},
	currency: {
		numeric: !0,
		defaultFilter: "number",
		format: (e, t) => `$${e.toLocaleString("en-US", {
			minimumFractionDigits: t ?? 2,
			maximumFractionDigits: t ?? 2
		})}`
	},
	percent: {
		numeric: !0,
		defaultFilter: "number",
		format: (e, t) => `${e.toLocaleString("en-US", {
			minimumFractionDigits: t ?? 0,
			maximumFractionDigits: t ?? 1
		})}%`
	},
	progress: {
		numeric: !0,
		defaultFilter: "number"
	},
	rating: {
		numeric: !0,
		defaultFilter: "number"
	},
	date: {
		numeric: !1,
		defaultFilter: "date"
	},
	select: {
		numeric: !1,
		defaultFilter: "set"
	},
	multiSelect: {
		numeric: !1,
		defaultFilter: "set"
	},
	user: {
		numeric: !1,
		defaultFilter: "set"
	},
	link: {
		numeric: !1,
		defaultFilter: "text"
	},
	checkbox: { numeric: !1 }
};
function ct(e) {
	return e != null && st[e]?.numeric === !0;
}
function lt(e) {
	return e == null ? void 0 : st[e]?.defaultFilter;
}
function ut(e, t, n) {
	return e == null || t == null || t === "" || isNaN(Number(t)) ? null : st[e]?.format?.(Number(t), n) ?? null;
}
//#endregion
//#region src/core/columnMapping.ts
function dt(e, t) {
	return t.split(".").reduce((e, t) => e?.[t], e);
}
var ft = 0, pt = /\b(amount|price|cost|total|salary|revenue|balance|fee|budget|income|profit|margin|tax|discount|spend|expense|pnl|winnings|billRate|bankBalance|gp|gross|net)\b/i;
function mt(e, t) {
	return e == null || isNaN(e) ? e : Number(e).toLocaleString("en-US", {
		minimumFractionDigits: t,
		maximumFractionDigits: t
	});
}
function ht(e, t, n = pt) {
	return !!(e && n.test(e) || t && n.test(t));
}
function gt(e, t, n, r = pt) {
	let i = {
		...t,
		...e
	}, a = e.colId || e.field || `col_${++ft}`, o = i.filter === void 0 ? lt(i.dataType) : i.filter, s = {
		id: a,
		header: i.headerName || e.field || a,
		accessorFn: i.valueGetter ? (t, n) => i.valueGetter({
			data: t,
			field: i.field,
			colDef: e,
			rowIndex: n
		}) : i.field ? (e) => dt(e, i.field) : void 0,
		enableSorting: i.sortable !== !1,
		enableColumnFilter: o !== !1 && o !== void 0,
		enableGrouping: i.enableRowGroup === !0 || n === !0,
		enableResizing: i.resizable !== !1,
		enableHiding: i.lockVisible !== !0,
		size: i.width || 150,
		minSize: i.minWidth || 50,
		maxSize: i.maxWidth || 1e3,
		meta: {
			colDef: e,
			mergedColDef: i,
			filterType: o,
			dataType: i.dataType,
			sparkline: i.sparkline,
			dataBar: i.dataBar,
			cellColorRules: i.cellColorRules,
			editorType: i.cellEditor,
			editable: i.editable,
			pinned: i.pinned,
			cellRenderer: i.cellRenderer,
			cellRendererParams: i.cellRendererParams,
			headerRenderer: i.headerRenderer,
			cellClass: i.cellClass,
			cellStyle: i.cellStyle,
			valueFormatter: i.valueFormatter || void 0,
			autoNumeric: !i.valueFormatter && (o === "number" || ct(i.dataType) || ht(i.field, i.headerName, r)),
			valueParser: i.valueParser,
			valueSetter: i.valueSetter,
			cellValidator: i.cellValidator,
			aggFunc: i.aggFunc,
			floatingFilter: i.floatingFilter,
			headerTooltip: i.headerTooltip
		}
	};
	return i.aggFunc && (typeof i.aggFunc == "string" ? s.aggregationFn = i.aggFunc : s.aggregationFn = (e, t, n) => {
		let r = n.map((t) => t.getValue(e));
		return i.aggFunc(r);
	}, s.aggregatedCell = ({ getValue: t }) => {
		let n = t();
		return i.valueFormatter ? i.valueFormatter({
			value: n,
			data: {},
			colDef: e,
			rowIndex: -1
		}) : !i.valueFormatter && (ht(i.field, i.headerName, r) || i.filter === "number") ? mt(n, 0) : n;
	}), e.children && e.children.length > 0 && (s.columns = e.children.map((e) => gt(e, t, n, r))), s;
}
var _t = (e) => `jt-grid-${e}`, vt = (e) => `jt-grid-${e}-ui`;
function yt(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	return t.version != null && (typeof t.version != "number" || t.version > 3) || t.columnOrder != null && !Array.isArray(t.columnOrder) || t.sorting != null && !Array.isArray(t.sorting) || t.grouping != null && !Array.isArray(t.grouping) ? null : t;
}
function bt(e) {
	try {
		let t = localStorage.getItem(_t(e));
		if (t) return yt(JSON.parse(t));
	} catch {}
	return null;
}
function xt(e, t) {
	try {
		localStorage.setItem(_t(e), JSON.stringify(t));
	} catch {}
}
function St(e) {
	return bt(e);
}
function Ct(e, t) {
	let n = bt(e);
	xt(e, {
		...t,
		version: 3,
		ui: n?.ui ?? t.ui
	});
}
function wt(e) {
	if (!e) return null;
	let t = bt(e);
	if (t?.ui) return t.ui;
	try {
		let t = localStorage.getItem(vt(e));
		if (!t) return null;
		let n = JSON.parse(t);
		return !n || typeof n != "object" || n.version && n.version > 1 ? null : n;
	} catch {
		return null;
	}
}
function Tt(e, t) {
	xt(e, {
		...bt(e) ?? {},
		version: 3,
		ui: t
	});
}
function Et(e) {
	let t = bt(e);
	try {
		t?.ui ? xt(e, {
			version: 3,
			ui: t.ui
		}) : localStorage.removeItem(_t(e));
	} catch {}
}
//#endregion
//#region src/core/useGridEngine.ts
var Dt = "__select__";
function Ot(e, t) {
	let { rowData: n, columnDefs: o, defaultColDef: c, getRowId: l, rowSelection: u = !1, pagination: d = !1, paginationPageSize: f = 50, groupDefaultExpanded: h = 0, persistSettings: _ = !1, density: y = "normal", gridId: b, enableRowGroup: x = !0, amountFieldPattern: S } = e, C = g(() => _ && b ? St(b) : null, [_, b]), [w, T] = v(() => C?.sorting ? s(C.sorting) : o.filter((e) => e.sort).sort((e, t) => (e.sortIndex ?? 99) - (t.sortIndex ?? 99)).map((e) => ({
		id: e.colId || e.field || "",
		desc: e.sort === "desc"
	}))), [E, D] = v(C?.columnFilters ? r(C.columnFilters) : []), [O, k] = v(""), [A, j] = v(() => {
		if (C?.columnVisibility) return C.columnVisibility;
		let e = {};
		return o.forEach((t) => {
			let n = t.colId || t.field;
			n && t.hide && (e[n] = !1);
		}), e;
	}), [M, N] = v(C?.columnOrder || []), [P, F] = v(C?.columnSizing || {}), [I, L] = v(() => C?.grouping ? C.grouping : o.filter((e) => e.rowGroup).sort((e, t) => (e.rowGroupIndex ?? 99) - (t.rowGroupIndex ?? 99)).map((e) => e.colId || e.field || "")), [R, z] = v(() => C?.expanded ? C.expanded : h === -1 || {}), [ee, B] = v({}), [V, te] = v(() => {
		let e = (e) => u !== !1 && !e.left.includes("__select__") ? {
			...e,
			left: [Dt, ...e.left]
		} : e;
		if (C?.columnPinning) return e(C.columnPinning);
		let t = [], n = [];
		return o.forEach((e) => {
			let r = e.colId || e.field;
			r && e.pinned === "left" && t.push(r), r && e.pinned === "right" && n.push(r);
		}), e({
			left: t,
			right: n
		});
	}), [H, ne] = v(C?.density || y), re = g(() => {
		let e = {}, t = (n) => {
			for (let r of n) {
				let n = {
					...c,
					...r
				}, i = r.colId || r.field;
				i && (n.filter === "number" || ct(n.dataType) || ht(n.field, n.headerName, S)) && (e[i] = "right"), r.children && t(r.children);
			}
		};
		return t(o), e;
	}, [
		o,
		c,
		S
	]), [ie, U] = v(() => C?.columnAlignment || {}), W = g(() => ({
		...re,
		...ie
	}), [re, ie]), G = U, [ae, oe] = v(() => C?.columnDecimals || {}), se = C?.pageSize || f, ce = u !== !1 && !t?.hideSelectColumn, le = g(() => {
		let e = o.map((e) => gt(e, c, x, S));
		if (ce) {
			let t = {
				id: Dt,
				header: "",
				size: 44,
				minSize: 44,
				maxSize: 44,
				enableSorting: !1,
				enableColumnFilter: !1,
				enableGrouping: !1,
				enableResizing: !1,
				enableHiding: !1,
				meta: { isSelectColumn: !0 }
			};
			e.unshift(t);
		}
		return e;
	}, [
		o,
		c,
		x,
		ce,
		S
	]);
	m(() => {
		_ && o.some((e) => !e.colId && !e.field) && console.warn("[prdgrid] persistSettings is on but some columns have neither colId nor field — their generated IDs are unstable and persisted settings for them will be lost. Add explicit colId.");
	}, [_, o]);
	let ue = ot({
		data: n,
		columns: le,
		state: {
			sorting: w,
			columnFilters: E,
			globalFilter: O,
			columnVisibility: A,
			columnOrder: M,
			columnSizing: P,
			grouping: I,
			expanded: R,
			rowSelection: ee,
			columnPinning: V
		},
		onSortingChange: T,
		onColumnFiltersChange: D,
		onGlobalFilterChange: k,
		onColumnVisibilityChange: j,
		onColumnOrderChange: N,
		onColumnSizingChange: F,
		onGroupingChange: L,
		onExpandedChange: z,
		onRowSelectionChange: B,
		onColumnPinningChange: te,
		getCoreRowModel: We(),
		getSortedRowModel: tt(),
		getFilteredRowModel: Z(),
		getGroupedRowModel: Qe(),
		getExpandedRowModel: Ge(),
		getPaginationRowModel: d ? et() : void 0,
		getFacetedRowModel: Xe(),
		getFacetedUniqueValues: Ze(),
		enableRowSelection: u !== !1,
		enableMultiRowSelection: u === "multiple",
		enableColumnResizing: !0,
		columnResizeMode: "onChange",
		enableGrouping: !0,
		enableSorting: !0,
		enableFilters: !0,
		enableMultiSort: !0,
		getRowId: l ? (e, t) => l(e, t) : void 0,
		initialState: { pagination: { pageSize: se } }
	});
	return m(() => {
		if (!_ || !b) return;
		let e = setTimeout(() => {
			let e = {
				version: 3,
				density: H,
				columnOrder: M,
				columnSizing: P,
				columnVisibility: A,
				sorting: a(w),
				columnFilters: i(E),
				grouping: I,
				expanded: typeof R == "boolean" ? {} : R,
				pageSize: ue.getState().pagination.pageSize,
				columnPinning: {
					left: V.left || [],
					right: V.right || []
				},
				columnDecimals: ae,
				columnAlignment: ie
			};
			Ct(b, e);
		}, 300);
		return () => clearTimeout(e);
	}, [
		_,
		b,
		M,
		P,
		A,
		H,
		w,
		E,
		I,
		R,
		V,
		ae,
		ie
	]), {
		table: ue,
		sorting: w,
		columnFilters: E,
		globalFilter: O,
		columnVisibility: A,
		columnOrder: M,
		columnSizing: P,
		grouping: I,
		expanded: R,
		rowSelectionState: ee,
		columnPinning: V,
		density: H,
		columnAlignment: W,
		setSorting: T,
		setColumnFilters: D,
		setGlobalFilter: k,
		setColumnVisibility: j,
		setColumnOrder: N,
		setColumnSizing: F,
		setGrouping: L,
		setExpanded: z,
		setRowSelectionState: B,
		setColumnPinning: te,
		setDensity: ne,
		setColumnAlignment: G,
		columnDecimals: ae,
		setColumnDecimals: oe,
		resetState: p(() => {
			b && Et(b), T([]), D([]), k(""), j({}), N([]), F({}), L([]), z({}), B({}), te({
				left: u === !1 ? [] : [Dt],
				right: []
			}), oe({}), U({});
		}, [b, u])
	};
}
//#endregion
//#region src/styles/themes.ts
var kt = {
	airtable: {},
	quartz: {
		"--jt-grid-col-border-width": "0px",
		"--jt-grid-border": "#e8e9ec",
		"--jt-grid-header-bg": "#ffffff",
		"--jt-grid-header-weight": "600",
		"--jt-grid-font-base": "0.875rem",
		"--jt-grid-shadow": "0 1px 2px rgb(0 0 0 / 0.04)"
	},
	minimal: {
		"--jt-grid-col-border-width": "0px",
		"--jt-grid-row-border-width": "0px",
		"--jt-grid-header-bg": "transparent",
		"--jt-grid-header-text": "#6b7280",
		"--jt-grid-header-weight": "600",
		"--jt-grid-font-sm": "0.6875rem",
		"--jt-grid-outer-radius": "0px",
		"--jt-grid-shadow": "none",
		"--jt-grid-border-strong": "#e0e6ed",
		"--jt-grid-row-hover": "#f5f6f8"
	},
	striped: {
		"--jt-grid-col-border-width": "0px",
		"--jt-grid-row-border-width": "0px",
		"--jt-grid-stripe-bg": "#f8fafc",
		"--jt-grid-header-bg": "#f3f4f6"
	},
	dense: {
		"--jt-grid-cell-px": "6px",
		"--jt-grid-font-base": "0.75rem",
		"--jt-grid-font-sm": "0.6875rem",
		"--jt-grid-outer-radius": "4px",
		"--jt-grid-header-height": "30px",
		"--jt-grid-density-scale": "0.82"
	},
	midnight: {
		"--jt-grid-bg": "#0d1117",
		"--jt-grid-bg-alt": "#151b23",
		"--jt-grid-border": "#21262d",
		"--jt-grid-border-strong": "#30363d",
		"--jt-grid-header-bg": "#161b22",
		"--jt-grid-header-text": "#e6edf3",
		"--jt-grid-header-icon": "#6e7681",
		"--jt-grid-text": "#d1d5db",
		"--jt-grid-text-secondary": "#8b949e",
		"--jt-grid-row-hover": "#1c2431",
		"--jt-grid-stripe-bg": "#11161d",
		"--jt-grid-cell-edit": "#3b2f11",
		"--jt-grid-toolbar-bg": "#0d1117",
		"--jt-grid-menu-bg": "#1c2128",
		"--jt-grid-menu-shadow": "0 4px 16px rgb(0 0 0 / 0.5)",
		"--jt-grid-input-bg": "#161b22",
		"--jt-grid-input-border": "#30363d",
		"--jt-grid-scrollbar": "#30363d",
		"--jt-grid-scrollbar-hover": "#484f58",
		"--jt-grid-chart-grid": "#21262d",
		"--jt-grid-chart-card-bg": "#161b22",
		"--jt-grid-shadow": "0 1px 3px rgb(0 0 0 / 0.4)"
	}
}, At = {
	blue: {
		accent: "#2f6fe0",
		hover: "#2560c8",
		light: "#dbe7fd",
		rowSelected: "#e8f0fe",
		chipBg: "#dbe7fd",
		chipText: "#1e429f"
	},
	violet: {
		accent: "#7a5af8",
		hover: "#6941c6",
		light: "#ebe5ff",
		rowSelected: "#f2eeff",
		chipBg: "#ebe5ff",
		chipText: "#5925dc"
	},
	teal: {
		accent: "#0e9384",
		hover: "#107569",
		light: "#d5f5f0",
		rowSelected: "#e8faf7",
		chipBg: "#d5f5f0",
		chipText: "#125d56"
	},
	green: {
		accent: "#129d5a",
		hover: "#0e7c47",
		light: "#d9f4e4",
		rowSelected: "#eafaf1",
		chipBg: "#d9f4e4",
		chipText: "#085d3a"
	},
	amber: {
		accent: "#dc8a06",
		hover: "#b96a02",
		light: "#fdeccb",
		rowSelected: "#fef6e6",
		chipBg: "#fdeccb",
		chipText: "#93470c"
	},
	rose: {
		accent: "#e0426f",
		hover: "#c22557",
		light: "#fbe1ea",
		rowSelected: "#fdf0f5",
		chipBg: "#fbe1ea",
		chipText: "#a11043"
	},
	slate: {
		accent: "#475467",
		hover: "#344054",
		light: "#e6e9ee",
		rowSelected: "#f0f2f5",
		chipBg: "#e6e9ee",
		chipText: "#344054"
	},
	orange: {
		accent: "#ec5f2a",
		hover: "#cf4a1c",
		light: "#fde5d8",
		rowSelected: "#fef3ec",
		chipBg: "#fde5d8",
		chipText: "#932f19"
	}
};
function jt(e, t) {
	let n = At[e];
	return t ? {
		"--jt-grid-accent": n.accent,
		"--jt-grid-accent-hover": n.hover,
		"--jt-grid-accent-light": `color-mix(in srgb, ${n.accent} 22%, transparent)`,
		"--jt-grid-row-selected": `color-mix(in srgb, ${n.accent} 16%, transparent)`,
		"--jt-grid-chip-bg": `color-mix(in srgb, ${n.accent} 28%, transparent)`,
		"--jt-grid-chip-text": "#e6edf3"
	} : {
		"--jt-grid-accent": n.accent,
		"--jt-grid-accent-hover": n.hover,
		"--jt-grid-accent-light": n.light,
		"--jt-grid-row-selected": n.rowSelected,
		"--jt-grid-chip-bg": n.chipBg,
		"--jt-grid-chip-text": n.chipText
	};
}
var Mt = [
	{
		value: "airtable",
		label: "Airtable"
	},
	{
		value: "quartz",
		label: "Quartz"
	},
	{
		value: "minimal",
		label: "Minimal"
	},
	{
		value: "striped",
		label: "Striped"
	},
	{
		value: "dense",
		label: "Dense"
	},
	{
		value: "midnight",
		label: "Midnight"
	}
], Nt = Object.keys(At).map((e) => ({
	value: e,
	label: e[0].toUpperCase() + e.slice(1),
	color: At[e].accent
})), Pt = ["midnight"], Ft = {
	compact: 30,
	normal: 36,
	comfortable: 44
};
function It(e) {
	let { look: t, accent: n, density: r, themeTokens: i, rowHeight: a, headerHeight: o } = e, s = Pt.includes(t), c = {
		...kt[t],
		...jt(n, s)
	}, l = parseFloat(c["--jt-grid-density-scale"] || "1");
	if (c["--jt-grid-row-height"] = `${a ?? Math.round(Ft[r] * l)}px`, o && (c["--jt-grid-header-height"] = `${o}px`), i && typeof i == "object") for (let [e, t] of Object.entries(i)) t != null && (c[e] = t);
	return {
		style: c,
		isDark: s
	};
}
//#endregion
//#region src/core/useClickOutside.ts
function Lt(e, t, n) {
	let r = n?.enabled ?? !0, i = n?.escape ?? !1;
	m(() => {
		if (!r) return;
		let n = (n) => {
			e.current && !e.current.contains(n.target) && t();
		}, a = (e) => {
			e.key === "Escape" && t();
		};
		return document.addEventListener("mousedown", n), i && document.addEventListener("keydown", a), () => {
			document.removeEventListener("mousedown", n), i && document.removeEventListener("keydown", a);
		};
	}, [
		r,
		i,
		t,
		e
	]);
}
//#endregion
//#region src/components/GridToolbar.tsx
function Rt(e) {
	let t = _(null);
	return Lt(t, e), t;
}
function zt({ look: e }) {
	let t = (t, n) => kt[e][t] || n, n = t("--jt-grid-bg", "#ffffff"), r = t("--jt-grid-header-bg", "#f7f8fa"), i = t("--jt-grid-border", "#e0e6ed"), a = t("--jt-grid-stripe-bg", "transparent"), o = t("--jt-grid-row-border-width", "1px");
	return /* @__PURE__ */ x("span", {
		className: "block h-[38px] w-full overflow-hidden rounded",
		style: {
			backgroundColor: n,
			border: `1px solid ${t("--jt-grid-border-strong", "#d0d7de")}`
		},
		"aria-hidden": !0,
		children: [/* @__PURE__ */ b("span", {
			className: "block h-[10px]",
			style: {
				backgroundColor: r === "transparent" ? n : r,
				borderBottom: `1px solid ${i}`
			}
		}), [
			0,
			1,
			2
		].map((e) => /* @__PURE__ */ b("span", {
			className: "block h-[9px]",
			style: {
				backgroundColor: e === 1 && a !== "transparent" ? a : "transparent",
				borderBottom: o === "0px" ? "none" : `1px solid ${i}`
			}
		}, e))]
	});
}
function Bt({ table: e, config: t, globalFilter: n, onGlobalFilterChange: r, density: i, onDensityChange: a, onResetState: o, onToggleColumnManager: s, onExportCsv: c, onExportExcel: l, onExportImage: u, onExportEmail: d, onExportSchedule: f, view: p = "grid", onViewChange: m, appearance: h, onAppearanceChange: g, onExportPdf: _, onRefresh: y, onToggleStylePanel: S, showFloatingFilters: C, onToggleFloatingFilters: T }) {
	let [E, D] = v(!1), [O, k] = v(!1), [A, j] = v(!1), [M, N] = v(!1), P = Rt(() => D(!1)), F = Rt(() => j(!1)), I = Rt(() => N(!1)), L = typeof t.export == "object" ? t.export : {}, R = e.getPreFilteredRowModel().rows.length, z = e.getFilteredRowModel().rows.length, ee = R !== z, B = t.charts && m, V = t.themeSwitcher !== !1 && h && g;
	return /* @__PURE__ */ x("div", {
		className: "jt-toolbar flex h-11 items-center gap-1.5 px-2.5",
		style: {
			backgroundColor: "var(--jt-grid-toolbar-bg)",
			borderBottom: "1px solid var(--jt-grid-border)"
		},
		children: [
			t.search && /* @__PURE__ */ x("div", {
				className: "relative w-60 max-w-full shrink",
				children: [
					/* @__PURE__ */ b("svg", {
						className: "absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2",
						style: { color: "var(--jt-grid-text-secondary)" },
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ b("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						})
					}),
					/* @__PURE__ */ b("input", {
						type: "text",
						placeholder: "Search all columns...",
						className: "jt-input h-7 w-full pl-8 pr-6",
						value: n,
						onChange: (e) => r(e.target.value)
					}),
					n && /* @__PURE__ */ b("button", {
						className: "absolute right-2 top-1/2 -translate-y-1/2 text-grid-text-secondary hover:text-grid-text",
						onClick: () => r(""),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ x("span", {
				className: "whitespace-nowrap px-1 text-grid-sm text-grid-text-secondary",
				children: [ee ? `${z.toLocaleString()} of ${R.toLocaleString()}` : R.toLocaleString(), " rows"]
			}),
			B && /* @__PURE__ */ b("div", {
				className: "ml-1 flex items-center rounded-md p-0.5",
				style: { backgroundColor: "var(--jt-grid-row-hover)" },
				role: "tablist",
				children: ["grid", "charts"].map((e) => /* @__PURE__ */ x("button", {
					role: "tab",
					"aria-selected": p === e,
					className: w("flex h-6 items-center gap-1.5 rounded px-2.5 text-grid-sm font-medium capitalize transition-colors duration-100"),
					style: p === e ? {
						backgroundColor: "var(--jt-grid-bg)",
						color: "var(--jt-grid-accent)",
						boxShadow: "0 1px 2px rgb(16 24 40 / 0.08)"
					} : { color: "var(--jt-grid-text-secondary)" },
					onClick: () => m(e),
					children: [e === "grid" ? /* @__PURE__ */ x("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.4",
						"aria-hidden": !0,
						children: [/* @__PURE__ */ b("rect", {
							x: "1.5",
							y: "2.5",
							width: "13",
							height: "11",
							rx: "1.5"
						}), /* @__PURE__ */ b("path", { d: "M1.5 6h13M6 6v7.5M10.5 6v7.5" })]
					}) : /* @__PURE__ */ b("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.4",
						strokeLinecap: "round",
						"aria-hidden": !0,
						children: /* @__PURE__ */ b("path", { d: "M2 14h12M3.5 14V9M7 14V4.5M10.5 14V7M14 14V2.5" })
					}), e]
				}, e))
			}),
			/* @__PURE__ */ b("div", { className: "flex-1" }),
			y && /* @__PURE__ */ b("button", {
				className: "jt-btn jt-tip",
				"data-tip": "Refresh data",
				onClick: async () => {
					try {
						k(!0), await y();
					} finally {
						k(!1);
					}
				},
				children: /* @__PURE__ */ b("svg", {
					className: w("h-4 w-4", O && "animate-spin"),
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: /* @__PURE__ */ b("path", { d: "M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" })
				})
			}),
			t.filterToggle !== !1 && T && /* @__PURE__ */ b("button", {
				className: w("jt-btn jt-tip", C && "jt-btn-active"),
				"data-tip": C ? "Hide column filters" : "Show column filters",
				onClick: T,
				children: /* @__PURE__ */ b("svg", {
					className: "h-4 w-4",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: /* @__PURE__ */ b("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" })
				})
			}),
			t.stylePanel !== !1 && S && /* @__PURE__ */ b("button", {
				className: "jt-btn jt-tip",
				"data-tip": "Style settings",
				onClick: S,
				children: /* @__PURE__ */ x("svg", {
					className: "h-4 w-4",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [
						/* @__PURE__ */ b("path", { d: "M12 19l7-7 3 3-7 7-3-3z" }),
						/* @__PURE__ */ b("path", { d: "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" }),
						/* @__PURE__ */ b("circle", {
							cx: "11",
							cy: "11",
							r: "2"
						})
					]
				})
			}),
			/* @__PURE__ */ b("button", {
				className: "jt-btn jt-tip",
				onClick: o,
				"data-tip": "Reset grid settings",
				children: "Reset"
			}),
			t.columnManager && /* @__PURE__ */ b("button", {
				className: "jt-btn jt-tip",
				onClick: s,
				"data-tip": "Manage columns",
				children: /* @__PURE__ */ b("svg", {
					className: "h-4 w-4",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					children: /* @__PURE__ */ b("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
						d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
					})
				})
			}),
			t.density && /* @__PURE__ */ x("div", {
				ref: F,
				className: "relative",
				children: [/* @__PURE__ */ b("button", {
					className: w("jt-btn jt-tip", A && "jt-btn-active"),
					onClick: () => j(!A),
					"data-tip": "Row height",
					children: /* @__PURE__ */ b("svg", {
						className: "h-4 w-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ b("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M4 6h16M4 12h16M4 18h16"
						})
					})
				}), A && /* @__PURE__ */ b("div", {
					className: "jt-menu absolute right-0 top-full mt-1 w-36",
					children: [
						"compact",
						"normal",
						"comfortable"
					].map((e) => /* @__PURE__ */ x("button", {
						className: w("jt-menu-item capitalize", i === e && "jt-menu-item-active"),
						onClick: () => {
							a(e), j(!1);
						},
						children: [i === e && /* @__PURE__ */ b("svg", {
							width: "13",
							height: "13",
							viewBox: "0 0 16 16",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": !0,
							children: /* @__PURE__ */ b("path", { d: "M3 8.5l3.5 3.5L13 5" })
						}), /* @__PURE__ */ b("span", {
							className: i === e ? "" : "ml-[21px]",
							children: e
						})]
					}, e))
				})]
			}),
			t.export && /* @__PURE__ */ x("div", {
				ref: P,
				className: "relative",
				children: [/* @__PURE__ */ b("button", {
					className: w("jt-btn jt-tip", E && "jt-btn-active"),
					onClick: () => D(!E),
					"data-tip": "Export",
					children: /* @__PURE__ */ b("svg", {
						className: "h-4 w-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ b("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						})
					})
				}), E && /* @__PURE__ */ x("div", {
					className: "jt-menu absolute right-0 top-full mt-1 min-w-[180px]",
					children: [
						L.csv !== !1 && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								c?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "📄" }), " Download CSV"]
						}),
						L.excel && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								l?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "📊" }), " Download Excel"]
						}),
						L.pdf && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								_?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "📑" }), " Download PDF"]
						}),
						L.psd && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								u?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "🖼️" }), " Export as Image"]
						}),
						L.email && /* @__PURE__ */ b("hr", {
							className: "my-1",
							style: { borderColor: "var(--jt-grid-border)" }
						}),
						L.email && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								d?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "📧" }), " Email Report"]
						}),
						L.scheduleEmail && /* @__PURE__ */ x("button", {
							className: "jt-menu-item",
							onClick: () => {
								f?.(), D(!1);
							},
							children: [/* @__PURE__ */ b("span", { children: "🕐" }), " Schedule Email"]
						})
					]
				})]
			}),
			V && /* @__PURE__ */ x("div", {
				ref: I,
				className: "relative",
				children: [/* @__PURE__ */ b("button", {
					className: w("jt-btn jt-tip", M && "jt-btn-active"),
					onClick: () => N(!M),
					"data-tip": "Grid appearance",
					children: /* @__PURE__ */ x("svg", {
						className: "h-4 w-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: "1.8",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ b("path", { d: "M12 21a9 9 0 110-18c4.97 0 9 3.58 9 8 0 2.76-2.24 5-5 5h-1.77c-.84 0-1.52.68-1.52 1.52 0 .36.13.7.35.97.24.29.44.65.44 1.01A1.5 1.5 0 0112 21z" }),
							/* @__PURE__ */ b("circle", {
								cx: "7.5",
								cy: "10.5",
								r: "1",
								fill: "currentColor",
								stroke: "none"
							}),
							/* @__PURE__ */ b("circle", {
								cx: "12",
								cy: "7.5",
								r: "1",
								fill: "currentColor",
								stroke: "none"
							}),
							/* @__PURE__ */ b("circle", {
								cx: "16.5",
								cy: "10.5",
								r: "1",
								fill: "currentColor",
								stroke: "none"
							})
						]
					})
				}), M && /* @__PURE__ */ x("div", {
					className: "jt-menu absolute right-0 top-full z-50 mt-1 w-[248px] !p-3",
					children: [
						/* @__PURE__ */ b("div", {
							className: "mb-1.5 text-grid-sm font-semibold text-grid-text",
							children: "Look"
						}),
						/* @__PURE__ */ b("div", {
							className: "mb-3 grid grid-cols-3 gap-1.5",
							children: Mt.map((e) => /* @__PURE__ */ x("button", {
								className: "group/look rounded-md p-0.5 text-left transition-shadow",
								style: h.look === e.value ? { boxShadow: "0 0 0 2px var(--jt-grid-accent)" } : void 0,
								onClick: () => g({
									...h,
									look: e.value
								}),
								children: [/* @__PURE__ */ b(zt, { look: e.value }), /* @__PURE__ */ b("span", {
									className: "mt-0.5 block truncate text-center text-[10px] text-grid-text-secondary",
									children: e.label
								})]
							}, e.value))
						}),
						/* @__PURE__ */ b("div", {
							className: "mb-1.5 text-grid-sm font-semibold text-grid-text",
							children: "Accent"
						}),
						/* @__PURE__ */ b("div", {
							className: "flex items-center gap-1.5",
							children: Nt.map((e) => /* @__PURE__ */ b("button", {
								className: "relative flex h-5 w-5 items-center justify-center rounded-full transition-transform hover:scale-110",
								style: {
									backgroundColor: e.color,
									boxShadow: h.accent === e.value ? `0 0 0 2px var(--jt-grid-menu-bg), 0 0 0 3.5px ${e.color}` : void 0
								},
								title: e.label,
								"aria-label": e.label,
								onClick: () => g({
									...h,
									accent: e.value
								}),
								children: h.accent === e.value && /* @__PURE__ */ b("svg", {
									width: "11",
									height: "11",
									viewBox: "0 0 16 16",
									fill: "none",
									stroke: "#fff",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									"aria-hidden": !0,
									children: /* @__PURE__ */ b("path", { d: "M3 8.5l3.5 3.5L13 5" })
								})
							}, e.value))
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/renderers.tsx
var Vt = {
	width: 14,
	height: 14,
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.4,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
function Ht({ dataType: e }) {
	if (!e) return null;
	let t = (() => {
		switch (e) {
			case "text": return /* @__PURE__ */ b("text", {
				x: "8",
				y: "12",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "600",
				fill: "currentColor",
				stroke: "none",
				children: "A"
			});
			case "number": return /* @__PURE__ */ b("text", {
				x: "8",
				y: "12",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "600",
				fill: "currentColor",
				stroke: "none",
				children: "#"
			});
			case "currency": return /* @__PURE__ */ b("text", {
				x: "8",
				y: "12",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "600",
				fill: "currentColor",
				stroke: "none",
				children: "$"
			});
			case "percent": return /* @__PURE__ */ b("text", {
				x: "8",
				y: "12",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "600",
				fill: "currentColor",
				stroke: "none",
				children: "%"
			});
			case "date": return /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("rect", {
				x: "2",
				y: "3",
				width: "12",
				height: "11",
				rx: "1.5"
			}), /* @__PURE__ */ b("path", { d: "M2 6.5h12M5.5 1.5v3M10.5 1.5v3" })] });
			case "select": return /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("circle", {
				cx: "8",
				cy: "8",
				r: "6"
			}), /* @__PURE__ */ b("path", { d: "M5.5 7l2.5 2.5L10.5 7" })] });
			case "multiSelect": return /* @__PURE__ */ b("path", { d: "M2 4h8M2 8h12M2 12h6" });
			case "checkbox": return /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("rect", {
				x: "2.5",
				y: "2.5",
				width: "11",
				height: "11",
				rx: "2"
			}), /* @__PURE__ */ b("path", { d: "M5.5 8l2 2 3.5-4" })] });
			case "rating": return /* @__PURE__ */ b("path", { d: "M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.2L8 11.5l-3.8 2 .7-4.2-3.1-3 4.3-.6L8 1.8z" });
			case "progress": return /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("rect", {
				x: "2",
				y: "6",
				width: "12",
				height: "4",
				rx: "2"
			}), /* @__PURE__ */ b("rect", {
				x: "2",
				y: "6",
				width: "7",
				height: "4",
				rx: "2",
				fill: "currentColor",
				stroke: "none"
			})] });
			case "link": return /* @__PURE__ */ b("path", {
				d: "M6.5 9.5l3-3M5 11l-1.2 1.2a2.5 2.5 0 01-3.5-3.5L3.5 5.5M12.5 10.5L14 9a2.5 2.5 0 00-3.5-3.5L9 7",
				transform: "translate(0.5 -0.5)"
			});
			case "user": return /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("circle", {
				cx: "8",
				cy: "5.5",
				r: "3"
			}), /* @__PURE__ */ b("path", { d: "M2.5 14a5.5 5.5 0 0111 0" })] });
			default: return null;
		}
	})();
	return t ? /* @__PURE__ */ b("svg", {
		...Vt,
		className: "jt-field-icon shrink-0",
		style: { color: "var(--jt-grid-header-icon)" },
		"aria-hidden": !0,
		children: t
	}) : null;
}
var Ut = [
	{
		bg: "#dbe7fd",
		text: "#1e429f"
	},
	{
		bg: "#d9f4e4",
		text: "#085d3a"
	},
	{
		bg: "#fdeccb",
		text: "#93470c"
	},
	{
		bg: "#fbe1ea",
		text: "#a11043"
	},
	{
		bg: "#ebe5ff",
		text: "#5925dc"
	},
	{
		bg: "#d5f5f0",
		text: "#125d56"
	},
	{
		bg: "#fde5d8",
		text: "#932f19"
	},
	{
		bg: "#e6e9ee",
		text: "#344054"
	},
	{
		bg: "#d8f0fd",
		text: "#0b5394"
	},
	{
		bg: "#f2e8d5",
		text: "#6b4e16"
	}
];
function Wt(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t = t * 31 + e.charCodeAt(n) | 0;
	return Math.abs(t);
}
function Gt(e) {
	return Ut[Wt(e) % Ut.length];
}
function Kt({ value: e }) {
	let { bg: t, text: n } = Gt(e);
	return /* @__PURE__ */ b("span", {
		className: "jt-chip",
		style: {
			backgroundColor: t,
			color: n
		},
		children: e
	});
}
function qt({ value: e }) {
	let t = Math.max(0, Math.min(5, Math.round(Number(e) || 0)));
	return /* @__PURE__ */ b("span", {
		className: "inline-flex items-center gap-0.5",
		title: `${e} / 5`,
		children: Array.from({ length: 5 }, (e, n) => /* @__PURE__ */ b("svg", {
			width: "13",
			height: "13",
			viewBox: "0 0 16 16",
			"aria-hidden": !0,
			children: /* @__PURE__ */ b("path", {
				d: "M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.2L8 11.5l-3.8 2 .7-4.2-3.1-3 4.3-.6L8 1.8z",
				fill: n < t ? "#f7b32b" : "none",
				stroke: n < t ? "#f7b32b" : "var(--jt-grid-border-strong)",
				strokeWidth: "1.2"
			})
		}, n))
	});
}
function Jt({ value: e }) {
	let t = Math.max(0, Math.min(100, Number(e) || 0));
	return /* @__PURE__ */ x("span", {
		className: "flex items-center gap-2 w-full min-w-0",
		children: [/* @__PURE__ */ b("span", {
			className: "h-1.5 flex-1 min-w-[36px] rounded-full overflow-hidden",
			style: { backgroundColor: "var(--jt-grid-accent-light)" },
			children: /* @__PURE__ */ b("span", {
				className: "block h-full rounded-full",
				style: {
					width: `${t}%`,
					backgroundColor: "var(--jt-grid-accent)"
				}
			})
		}), /* @__PURE__ */ x("span", {
			className: "text-grid-sm text-grid-text-secondary tabular-nums shrink-0",
			children: [Math.round(t), "%"]
		})]
	});
}
function Yt({ value: e }) {
	let t = String(e), n = t.split(/\s+/).map((e) => e[0]).filter(Boolean).slice(0, 2).join("").toUpperCase(), { bg: r, text: i } = Gt(t);
	return /* @__PURE__ */ x("span", {
		className: "inline-flex items-center gap-2 min-w-0",
		children: [/* @__PURE__ */ b("span", {
			className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
			style: {
				backgroundColor: r,
				color: i
			},
			children: n
		}), /* @__PURE__ */ b("span", {
			className: "truncate",
			children: t
		})]
	});
}
function Xt({ value: e }) {
	let t = e === !0 || e === "true" || e === 1;
	return /* @__PURE__ */ x("svg", {
		width: "15",
		height: "15",
		viewBox: "0 0 16 16",
		"aria-hidden": !0,
		children: [/* @__PURE__ */ b("rect", {
			x: "1.5",
			y: "1.5",
			width: "13",
			height: "13",
			rx: "3.5",
			fill: t ? "var(--jt-grid-accent)" : "transparent",
			stroke: t ? "var(--jt-grid-accent)" : "var(--jt-grid-border-strong)",
			strokeWidth: "1.4"
		}), t && /* @__PURE__ */ b("path", {
			d: "M4.5 8.2l2.3 2.3 4.7-5",
			fill: "none",
			stroke: "#fff",
			strokeWidth: "1.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	});
}
function Zt(e, t, n) {
	if (t == null || t === "") return null;
	switch (e) {
		case "select": return /* @__PURE__ */ b(Kt, { value: String(t) });
		case "multiSelect": return /* @__PURE__ */ b("span", {
			className: "inline-flex items-center gap-1 min-w-0 overflow-hidden",
			children: (Array.isArray(t) ? t : String(t).split(",").map((e) => e.trim())).filter(Boolean).map((e, t) => /* @__PURE__ */ b(Kt, { value: String(e) }, `${e}-${t}`))
		});
		case "checkbox": return /* @__PURE__ */ b(Xt, { value: t });
		case "rating": return /* @__PURE__ */ b(qt, { value: Number(t) });
		case "progress": return /* @__PURE__ */ b(Jt, { value: Number(t) });
		case "user": return /* @__PURE__ */ b(Yt, { value: String(t) });
		case "link": {
			let e = String(t), r = n || e.replace(/^https?:\/\//, "");
			return /* @__PURE__ */ b("a", {
				href: e.startsWith("http") ? e : `https://${e}`,
				target: "_blank",
				rel: "noreferrer",
				className: "truncate underline-offset-2 hover:underline",
				style: { color: "var(--jt-grid-accent)" },
				onClick: (e) => e.stopPropagation(),
				children: r
			});
		}
		default: return null;
	}
}
function Qt({ type: e, values: t, width: n = 96, height: r = 22 }) {
	let i = (t || []).map(Number).filter((e) => !isNaN(e));
	if (i.length === 0) return null;
	let a = Math.min(...i), o = Math.max(...i), s = o - a || 1;
	if (e === "line") {
		let e = i.map((e, t) => {
			let o = 2 + t / Math.max(i.length - 1, 1) * (n - 4), c = r - 2 - (e - a) / s * (r - 4);
			return `${o.toFixed(1)},${c.toFixed(1)}`;
		}), t = (i[i.length - 1] ?? 0) >= (i[0] ?? 0);
		return /* @__PURE__ */ b("svg", {
			width: n,
			height: r,
			className: "inline-block align-middle",
			"aria-hidden": !0,
			children: /* @__PURE__ */ b("polyline", {
				points: e.join(" "),
				fill: "none",
				stroke: t ? "var(--jt-grid-success)" : "var(--jt-grid-error)",
				strokeWidth: "1.5",
				strokeLinejoin: "round",
				strokeLinecap: "round"
			})
		});
	}
	let c = Math.max(2, (n - 4) / i.length - 1.5);
	return /* @__PURE__ */ b("svg", {
		width: n,
		height: r,
		className: "inline-block align-middle",
		"aria-hidden": !0,
		children: i.map((t, l) => {
			let u = 2 + l * (n - 4) / i.length;
			if (e === "winloss") {
				let e = r / 2, n = Math.max(2, Math.abs(t) / Math.max(Math.abs(a), Math.abs(o), 1) * (r / 2 - 2));
				return /* @__PURE__ */ b("rect", {
					x: u,
					y: t >= 0 ? e - n : e,
					width: c,
					height: n,
					rx: "1",
					fill: t >= 0 ? "var(--jt-grid-success)" : "var(--jt-grid-error)"
				}, l);
			}
			let d = Math.max(2, (t - a) / s * (r - 4));
			return /* @__PURE__ */ b("rect", {
				x: u,
				y: r - 2 - d,
				width: c,
				height: d,
				rx: "1",
				fill: "var(--jt-grid-accent)"
			}, l);
		})
	});
}
function $t({ value: e, columnMax: t, children: n }) {
	return /* @__PURE__ */ x("span", {
		className: "relative block w-full",
		children: [/* @__PURE__ */ b("span", {
			className: "absolute inset-y-0.5 left-0 rounded-sm",
			style: {
				width: `${t > 0 ? Math.max(0, Math.min(100, Number(e) / t * 100)) : 0}%`,
				backgroundColor: "color-mix(in srgb, var(--jt-grid-accent) 18%, transparent)"
			},
			"aria-hidden": !0
		}), /* @__PURE__ */ b("span", {
			className: "relative block truncate",
			children: n
		})]
	});
}
//#endregion
//#region src/components/HeaderCell.tsx
function en({ header: e, alignment: t, onDragStart: n, onDragOver: r, onDragEnd: i, isDragTarget: a, onHeaderContextMenu: o }) {
	let s = e.column, c = s.columnDef.meta, l = t ?? (c?.colDef?.filter === "number" || ct(c?.dataType) ? "right" : void 0), u = s.getCanSort(), d = s.getIsSorted(), f = s.getCanGroup(), m = s.getIsGrouped(), h = s.getIsPinned(), g = p((e) => {
		u && s.toggleSorting(void 0, e.shiftKey);
	}, [u, s]), _ = s.getSortIndex(), v = {};
	return h === "left" && (v.left = s.getStart("left")), h === "right" && (v.right = s.getAfter("right")), /* @__PURE__ */ x("th", {
		className: w("jt-header-cell group", "relative select-none text-left", u && "cursor-pointer", h && "sticky z-10 jt-cell-pinned", h === "left" && s.getIsLastColumn("left") && "jt-cell-pinned-edge-left", h === "right" && s.getIsFirstColumn("right") && "jt-cell-pinned-edge-right", m && "!bg-grid-accent-light"),
		style: {
			width: e.getSize(),
			minWidth: s.columnDef.minSize,
			maxWidth: s.columnDef.maxSize,
			textAlign: l,
			boxShadow: a ? "inset 2px 0 0 var(--jt-grid-accent)" : void 0,
			...v
		},
		title: c?.headerTooltip,
		draggable: !c?.colDef?.suppressMovable,
		onDragStart: (e) => {
			e.dataTransfer.setData("text/plain", s.id), n?.(s.id);
		},
		onDragOver: (e) => {
			e.preventDefault(), r?.(s.id);
		},
		onDrop: (e) => {
			e.preventDefault(), i?.();
		},
		onContextMenu: (e) => {
			o && (e.preventDefault(), o(s.id, e.clientX, e.clientY));
		},
		children: [/* @__PURE__ */ x("div", {
			className: w("flex h-full items-center gap-1.5", l === "right" && "justify-end", l === "center" && "justify-center"),
			onClick: g,
			children: [
				/* @__PURE__ */ b(Ht, { dataType: c?.dataType }),
				/* @__PURE__ */ b("span", {
					className: "min-w-0 truncate",
					children: e.isPlaceholder ? null : nt(s.columnDef.header, e.getContext())
				}),
				d && /* @__PURE__ */ x("span", {
					className: "flex shrink-0 items-center",
					style: { color: "var(--jt-grid-accent)" },
					children: [/* @__PURE__ */ b("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": !0,
						children: d === "asc" ? /* @__PURE__ */ b("path", { d: "M4 10l4-4 4 4" }) : /* @__PURE__ */ b("path", { d: "M4 6l4 4 4-4" })
					}), _ !== void 0 && _ > 0 && /* @__PURE__ */ b("sup", {
						className: "ml-0.5 text-[8px] font-semibold",
						children: _ + 1
					})]
				}),
				/* @__PURE__ */ b("span", { className: "flex-1" }),
				f && /* @__PURE__ */ b("button", {
					className: w("flex h-4 w-4 shrink-0 items-center justify-center rounded transition-opacity duration-100", m ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100 text-grid-header-icon hover:text-grid-accent"),
					style: m ? { backgroundColor: "var(--jt-grid-accent)" } : void 0,
					onClick: (e) => {
						e.stopPropagation(), s.toggleGrouping();
					},
					title: m ? "Ungroup" : "Group by this column",
					"aria-label": m ? "Ungroup" : "Group by this column",
					children: /* @__PURE__ */ b("svg", {
						width: "11",
						height: "11",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.6",
						strokeLinecap: "round",
						"aria-hidden": !0,
						children: /* @__PURE__ */ b("path", { d: "M2 4h12M4.5 8h7M7 12h2" })
					})
				})
			]
		}), s.getCanResize() && /* @__PURE__ */ b("div", {
			className: w("absolute -right-[2px] top-0 z-10 h-full w-[5px] cursor-col-resize select-none touch-none", "after:absolute after:right-[1.5px] after:top-0 after:h-full after:w-[2px] after:transition-opacity after:duration-100", e.column.getIsResizing() ? "after:bg-grid-accent after:opacity-100" : "after:bg-grid-accent after:opacity-0 hover:after:opacity-100"),
			onMouseDown: e.getResizeHandler(),
			onTouchStart: e.getResizeHandler(),
			onClick: (e) => e.stopPropagation(),
			onDoubleClick: () => s.resetSize()
		})]
	});
}
//#endregion
//#region src/components/GridHeader.tsx
function tn({ table: e, columnAlignment: t, onHeaderContextMenu: r }) {
	let [i, a] = v(null), [o, s] = v(null), c = p((e) => {
		a(e);
	}, []), l = p((e) => {
		s(e);
	}, []), u = p(() => {
		i && o && i !== o && o !== "__select__" && n(e, i, o), a(null), s(null);
	}, [
		i,
		o,
		e
	]);
	return /* @__PURE__ */ b("thead", {
		className: "jt-header sticky top-0 z-20",
		children: e.getHeaderGroups().map((n) => /* @__PURE__ */ b("tr", { children: n.headers.map((n) => n.column.id === "__select__" ? /* @__PURE__ */ b("th", {
			className: "jt-header-cell jt-cell-pinned sticky left-0 z-10 !p-0 text-center",
			style: { width: n.getSize() },
			children: /* @__PURE__ */ b("input", {
				type: "checkbox",
				className: "h-[15px] w-[15px] rounded accent-[var(--jt-grid-accent)] align-middle cursor-pointer",
				checked: e.getIsAllRowsSelected(),
				ref: (t) => {
					t && (t.indeterminate = e.getIsSomeRowsSelected());
				},
				onChange: e.getToggleAllRowsSelectedHandler()
			})
		}, n.id) : /* @__PURE__ */ b(en, {
			header: n,
			alignment: t?.[n.column.id],
			isDragTarget: o === n.column.id && i !== null && i !== n.column.id,
			onDragStart: c,
			onDragOver: l,
			onDragEnd: u,
			onHeaderContextMenu: r
		}, n.id)) }, n.id))
	});
}
//#endregion
//#region src/components/GridCell.tsx
var nn = d.memo(function({ cell: e, rowIndex: t, alignment: n, decimals: r, indent: i, columnMax: a, onCellClick: o, onCellDoubleClick: s, onCellValueChanged: c, onExpandRecord: l }) {
	let u = e.column.columnDef.meta, d = u?.colDef, f = e.getValue(), h = e.row, y = e.column.getIsPinned(), S = e.getIsGrouped(), C = e.getIsAggregated(), T = e.getIsPlaceholder(), [E, D] = v(!1), [O, k] = v(f), A = _(null), j = g(() => d?.editable ? typeof d.editable == "function" ? d.editable({
		data: h.original,
		colDef: d,
		rowIndex: t
	}) : d.editable : !1, [
		d,
		h.original,
		t
	]), M = g(() => {
		if (u?.valueFormatter && f != null) return u.valueFormatter({
			value: f,
			data: h.original,
			colDef: d || {},
			rowIndex: t
		});
		let e = ut(u?.dataType, f, r);
		if (e !== null) return e;
		if (u?.autoNumeric && f != null && !isNaN(Number(f))) {
			let e = r ?? 0;
			return Number(f).toLocaleString("en-US", {
				minimumFractionDigits: e,
				maximumFractionDigits: e
			});
		}
		return f == null ? "" : String(f);
	}, [
		u,
		f,
		h.original,
		d,
		t,
		r
	]), N = g(() => {
		let r;
		if (u?.cellStyle && (r = typeof u.cellStyle == "function" ? u.cellStyle({
			value: f,
			data: h.original,
			colDef: d || {},
			rowIndex: t
		}) : u.cellStyle), n && (r = {
			...r,
			textAlign: n
		}), i && (r = {
			...r,
			paddingLeft: `calc(var(--jt-grid-cell-px) + ${i}px)`
		}), u?.cellColorRules && !r?.backgroundColor) {
			let e = u.cellColorRules.find((e) => e.when(f, h.original));
			e && (r = {
				...r,
				backgroundColor: e.color
			});
		}
		return y === "left" && (r = {
			...r,
			left: e.column.getStart("left")
		}), y === "right" && (r = {
			...r,
			right: e.column.getAfter("right")
		}), r;
	}, [
		u,
		f,
		h.original,
		d,
		t,
		n,
		i,
		y,
		e.column
	]), P = g(() => u?.cellClass ? typeof u.cellClass == "function" ? u.cellClass({
		value: f,
		data: h.original,
		colDef: d || {},
		rowIndex: t
	}) : u.cellClass : "", [
		u,
		f,
		h.original,
		d,
		t
	]), F = p(() => {
		!j || S || (k(f), D(!0));
	}, [
		j,
		S,
		f
	]), I = p(() => {
		D(!1), O !== f && c?.(e, f, O);
	}, [
		O,
		f,
		e,
		c
	]), L = p(() => {
		D(!1), k(f);
	}, [f]);
	m(() => {
		E && A.current && (A.current.focus(), A.current.select());
	}, [E]);
	let R = p((e) => {
		E ? e.key === "Enter" ? (e.preventDefault(), I()) : e.key === "Escape" && (e.preventDefault(), L()) : j && (e.key === "Enter" || e.key === "F2") && (e.preventDefault(), F());
	}, [
		E,
		j,
		I,
		L,
		F
	]);
	if (u?.isSelectColumn) {
		let n = h.getCanSelect(), r = h.getIsSelected();
		return /* @__PURE__ */ b("td", {
			className: "jt-cell jt-cell-select jt-cell-pinned sticky left-0 z-10 !p-0 text-center",
			style: { width: e.column.getSize() },
			children: /* @__PURE__ */ x("span", {
				className: "relative flex h-full items-center justify-center gap-1",
				children: [/* @__PURE__ */ b("span", {
					className: "jt-rownum",
					children: S || h.getIsGrouped() ? "" : t + 1
				}), /* @__PURE__ */ x("span", {
					className: "jt-select-hover items-center justify-center gap-1",
					children: [n && /* @__PURE__ */ b("input", {
						type: "checkbox",
						className: "h-[15px] w-[15px] rounded accent-[var(--jt-grid-accent)] cursor-pointer",
						checked: r,
						onChange: h.getToggleSelectedHandler(),
						onClick: (e) => e.stopPropagation()
					}), l && !h.getIsGrouped() && /* @__PURE__ */ b("button", {
						className: "jt-expand-btn flex h-[18px] w-[18px] items-center justify-center rounded hover:bg-grid-accent-light",
						style: { color: "var(--jt-grid-accent)" },
						title: "Expand record",
						"aria-label": "Expand record",
						onClick: (e) => {
							e.stopPropagation(), l(h.id);
						},
						children: /* @__PURE__ */ b("svg", {
							width: "12",
							height: "12",
							viewBox: "0 0 16 16",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.6",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": !0,
							children: /* @__PURE__ */ b("path", { d: "M9 2h5v5M14 2L9 7M7 14H2V9M2 14l5-5" })
						})
					})]
				})]
			})
		});
	}
	if (S) return /* @__PURE__ */ b("td", {
		className: w("jt-cell jt-cell-grouped", "font-semibold text-grid-header-text", P),
		style: {
			...N,
			backgroundColor: "var(--jt-grid-bg-alt)"
		},
		children: /* @__PURE__ */ x("div", {
			className: "flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ b("button", {
					className: "flex h-4 w-4 shrink-0 items-center justify-center rounded text-grid-text-secondary transition-transform duration-100 hover:bg-grid-accent-light hover:text-grid-accent",
					style: { transform: h.getIsExpanded() ? "rotate(90deg)" : void 0 },
					onClick: () => h.toggleExpanded(),
					children: /* @__PURE__ */ b("svg", {
						width: "11",
						height: "11",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": !0,
						children: /* @__PURE__ */ b("path", { d: "M6 3l5 5-5 5" })
					})
				}),
				/* @__PURE__ */ b("span", {
					className: "truncate",
					children: M
				}),
				/* @__PURE__ */ b("span", {
					className: "jt-chip shrink-0",
					style: {
						backgroundColor: "var(--jt-grid-accent-light)",
						color: "var(--jt-grid-accent)"
					},
					children: h.subRows.length
				})
			]
		})
	});
	if (T) return /* @__PURE__ */ b("td", { className: "jt-cell" });
	let z = u?.cellRenderer, ee = u?.cellRendererParams || {};
	if (C) return /* @__PURE__ */ b("td", {
		className: w("jt-cell jt-cell-aggregated", "font-medium italic", P),
		style: {
			...N,
			color: "var(--jt-grid-accent)"
		},
		children: nt(e.column.columnDef.aggregatedCell ?? e.column.columnDef.cell, e.getContext())
	});
	let B;
	if (E) B = /* @__PURE__ */ b("input", {
		ref: A,
		type: d?.cellEditor === "number" ? "number" : "text",
		className: "w-full border-none bg-transparent outline-none text-grid-base",
		value: O ?? "",
		onChange: (e) => k(e.target.value),
		onBlur: I
	});
	else if (z) B = /* @__PURE__ */ b(z, {
		value: f,
		formattedValue: M,
		data: h.original,
		colDef: d || {},
		rowIndex: t,
		isGroupRow: !1,
		isExpanded: h.getIsExpanded(),
		node: {
			id: h.id,
			data: h.original,
			rowIndex: t,
			isSelected: h.getIsSelected(),
			isExpanded: h.getIsExpanded(),
			isGroupRow: !1,
			depth: h.depth
		},
		...ee
	});
	else if (u?.sparkline && Array.isArray(f)) B = /* @__PURE__ */ b(Qt, {
		type: u.sparkline,
		values: f
	});
	else {
		let e = u?.dataType ? Zt(u.dataType, f, M) : null;
		B = e === null ? u?.dataBar && f != null && !isNaN(Number(f)) && a != null ? /* @__PURE__ */ b($t, {
			value: Number(f),
			columnMax: a,
			children: M
		}) : /* @__PURE__ */ b("span", {
			className: "block truncate",
			children: M
		}) : e;
	}
	return /* @__PURE__ */ b("td", {
		className: w("jt-cell text-grid-text", E && "bg-grid-cell-edit ring-2 ring-grid-accent ring-inset", y && "sticky z-10 jt-cell-pinned", y === "left" && e.column.getIsLastColumn("left") && "jt-cell-pinned-edge-left", y === "right" && e.column.getIsFirstColumn("right") && "jt-cell-pinned-edge-right", P),
		style: N,
		onClick: (t) => o?.(e, t),
		onDoubleClick: (t) => {
			s?.(e, t), F();
		},
		onKeyDown: R,
		tabIndex: 0,
		children: B
	});
}), rn = d.memo(function({ row: e, rowIndex: t, columnAlignment: n, columnDecimals: r, rowColorRules: i, columnMaxes: a, onCellClick: o, onCellDoubleClick: s, onCellValueChanged: c, onExpandRecord: l }) {
	let u = e.getIsSelected(), d = e.getIsGrouped(), f = e.depth, p;
	if (i && !d) {
		let t = i.find((t) => t.when(e.original));
		t && (p = t.target === "leftBar" ? { boxShadow: `inset 3px 0 0 ${t.color}` } : { backgroundColor: t.color });
	}
	let m = e.getVisibleCells(), h = m.findIndex((e) => !e.column.columnDef.meta?.isSelectColumn);
	return /* @__PURE__ */ b("tr", {
		className: w("jt-row", d && "font-medium"),
		style: p,
		"data-row-index": t,
		"data-selected": u,
		"data-group": d,
		children: m.map((e, i) => /* @__PURE__ */ b(nn, {
			cell: e,
			rowIndex: t,
			alignment: n?.[e.column.id],
			decimals: r?.[e.column.id],
			indent: i === h && f > 0 && !d ? f * 24 : void 0,
			columnMax: a?.[e.column.id],
			onCellClick: o,
			onCellDoubleClick: s,
			onCellValueChanged: c,
			onExpandRecord: l
		}, e.id))
	});
});
//#endregion
//#region src/components/GridBody.tsx
function an({ table: e, columnAlignment: t, columnDecimals: n, rowColorRules: r, noRowsComponent: i, noRowsMessage: a, onCellClick: o, onCellDoubleClick: s, onCellValueChanged: c, onExpandRecord: l }) {
	let u = e.getRowModel().rows, d = e.getAllLeafColumns().filter((e) => e.columnDef.meta?.dataBar).map((e) => e.id), f = e.getFilteredRowModel().rows, p = g(() => {
		if (d.length === 0) return;
		let e = {};
		for (let t of d) {
			let n = 0;
			for (let e of f) {
				let r = Number(e.getValue(t));
				!isNaN(r) && r > n && (n = r);
			}
			e[t] = n;
		}
		return e;
	}, [d.join(","), f]);
	return u.length === 0 ? /* @__PURE__ */ b("tbody", { children: /* @__PURE__ */ b("tr", { children: /* @__PURE__ */ b("td", {
		colSpan: e.getVisibleLeafColumns().length,
		className: "px-6 py-16 text-center text-grid-text-secondary",
		children: i ? /* @__PURE__ */ b(i, {}) : /* @__PURE__ */ x("div", {
			className: "flex flex-col items-center gap-2",
			children: [/* @__PURE__ */ b("svg", {
				className: "h-12 w-12",
				style: { color: "var(--jt-grid-border-strong)" },
				fill: "none",
				viewBox: "0 0 24 24",
				stroke: "currentColor",
				children: /* @__PURE__ */ b("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: 1,
					d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				})
			}), /* @__PURE__ */ b("span", {
				className: "text-sm",
				children: a || "No data to display"
			})]
		})
	}) }) }) : /* @__PURE__ */ b("tbody", {
		className: "jt-body",
		children: u.map((e, i) => /* @__PURE__ */ b(rn, {
			row: e,
			rowIndex: i,
			columnAlignment: t,
			columnDecimals: n,
			rowColorRules: r,
			columnMaxes: p,
			onCellClick: o,
			onCellDoubleClick: s,
			onCellValueChanged: c,
			onExpandRecord: l
		}, e.id))
	});
}
//#endregion
//#region src/components/FloatingFilter.tsx
function on({ table: e }) {
	return /* @__PURE__ */ b("thead", {
		className: "jt-floating-filters",
		children: e.getHeaderGroups().map((e) => /* @__PURE__ */ b("tr", { children: e.headers.map((e) => /* @__PURE__ */ b(sn, { header: e }, e.id)) }, `ff-${e.id}`))
	});
}
function sn({ header: e }) {
	let t = e.column, n = t.columnDef.meta?.filterType, r = t.getCanFilter() && n, i = t.getFilterValue();
	return !r || e.isPlaceholder ? /* @__PURE__ */ b("th", { style: { width: e.getSize() } }) : n === "number" ? /* @__PURE__ */ b("th", {
		style: { width: e.getSize() },
		children: /* @__PURE__ */ b("input", {
			type: "number",
			className: "jt-input w-full px-1.5 py-0.5 text-xs",
			placeholder: "Filter...",
			value: i ?? "",
			onChange: (e) => t.setFilterValue(e.target.value ? Number(e.target.value) : void 0)
		})
	}) : n === "date" ? /* @__PURE__ */ b("th", {
		style: { width: e.getSize() },
		children: /* @__PURE__ */ b("input", {
			type: "date",
			className: "jt-input w-full px-1.5 py-0.5 text-xs",
			value: i ?? "",
			onChange: (e) => t.setFilterValue(e.target.value || void 0)
		})
	}) : n === "set" ? /* @__PURE__ */ b("th", {
		style: { width: e.getSize() },
		children: /* @__PURE__ */ b(cn, { column: t })
	}) : /* @__PURE__ */ b("th", {
		style: { width: e.getSize() },
		children: /* @__PURE__ */ b("input", {
			type: "text",
			className: "jt-input w-full px-1.5 py-0.5 text-xs",
			placeholder: "Filter...",
			value: i ?? "",
			onChange: (e) => t.setFilterValue(e.target.value || void 0)
		})
	});
}
function cn({ column: e }) {
	let [t, n] = v(!1), [r, i] = v(""), a = e.getFilterValue() ?? [], o = e.getFacetedUniqueValues?.(), s = o ? Array.from(o.keys()).sort() : [], c = r.trim().toLowerCase(), l = c ? s.filter((e) => String(e).toLowerCase().includes(c)) : s, u = (t) => {
		let n = [...a], r = n.indexOf(t);
		r >= 0 ? n.splice(r, 1) : n.push(t), e.setFilterValue(n.length > 0 ? n : void 0);
	};
	return /* @__PURE__ */ x("div", {
		className: "relative",
		children: [/* @__PURE__ */ b("button", {
			className: w("w-full rounded-md border px-1.5 py-0.5 text-left text-xs", a.length > 0 ? "border-grid-accent text-grid-accent bg-grid-accent-light" : "jt-input text-grid-text-secondary"),
			onClick: () => n(!t),
			children: a.length > 0 ? `${a.length} selected` : "All"
		}), t && /* @__PURE__ */ x("div", {
			className: "jt-menu absolute left-0 top-full z-50 mt-1 max-h-48 w-48 overflow-y-auto",
			children: [
				/* @__PURE__ */ b("div", {
					className: "px-1.5 pt-1.5",
					children: /* @__PURE__ */ b("input", {
						type: "text",
						autoFocus: !0,
						className: "jt-input mb-1 w-full px-1.5 py-0.5 text-xs",
						placeholder: "Search values...",
						"aria-label": "Search filter values",
						value: r,
						onChange: (e) => i(e.target.value),
						onKeyDown: (e) => {
							e.key === "Escape" && (e.stopPropagation(), n(!1));
						}
					})
				}),
				/* @__PURE__ */ b("div", {
					className: "px-2 py-1",
					style: { borderBottom: "1px solid var(--jt-grid-border)" },
					children: /* @__PURE__ */ b("button", {
						className: "text-xs text-grid-accent hover:underline",
						onClick: () => e.setFilterValue(void 0),
						children: "Clear all"
					})
				}),
				l.map((e) => /* @__PURE__ */ x("label", {
					className: "jt-menu-item !h-6 cursor-pointer text-xs",
					children: [
						/* @__PURE__ */ b("input", {
							type: "checkbox",
							className: "h-3 w-3 rounded accent-[var(--jt-grid-accent)]",
							checked: a.includes(String(e)),
							onChange: () => u(String(e))
						}),
						/* @__PURE__ */ b("span", {
							className: "truncate",
							children: String(e)
						}),
						o && /* @__PURE__ */ b("span", {
							className: "ml-auto text-grid-text-secondary",
							children: o.get(e)
						})
					]
				}, String(e)))
			]
		})]
	});
}
//#endregion
//#region src/components/GroupPanel.tsx
function ln({ table: e, grouping: t, onGroupingChange: n }) {
	let r = (e) => {
		e.preventDefault(), e.dataTransfer.dropEffect = "move";
	}, i = (r) => {
		r.preventDefault();
		let i = r.dataTransfer.getData("text/plain");
		i && !t.includes(i) && e.getColumn(i)?.getCanGroup() && n([...t, i]);
	}, a = (e) => {
		n(t.filter((t) => t !== e));
	}, s = (t) => {
		let n = e.getColumn(t);
		return n ? o(n) : t;
	};
	return /* @__PURE__ */ b("div", {
		className: w("jt-group-panel", "flex min-h-[38px] items-center gap-2 px-3 py-1.5"),
		style: {
			backgroundColor: "var(--jt-grid-header-bg)",
			borderBottom: "1px solid var(--jt-grid-border)"
		},
		onDragOver: r,
		onDrop: i,
		children: t.length === 0 ? /* @__PURE__ */ b("span", {
			className: "text-grid-sm text-grid-text-secondary italic",
			children: "Drag column headers here to group rows"
		}) : /* @__PURE__ */ x(y, { children: [
			/* @__PURE__ */ b("span", {
				className: "text-grid-sm text-grid-text-secondary mr-1",
				children: "Grouped by:"
			}),
			t.map((e, t) => /* @__PURE__ */ x(d.Fragment, { children: [t > 0 && /* @__PURE__ */ b("span", {
				className: "text-grid-text-secondary text-xs",
				children: "→"
			}), /* @__PURE__ */ x("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-grid-accent-light px-2.5 py-0.5 text-grid-sm font-medium text-grid-accent",
				children: [s(e), /* @__PURE__ */ b("button", {
					className: "ml-0.5 text-grid-accent hover:text-grid-accent-hover",
					onClick: () => a(e),
					children: "×"
				})]
			})] }, e)),
			/* @__PURE__ */ b("button", {
				className: "ml-2 text-grid-sm text-grid-text-secondary hover:text-grid-text",
				onClick: () => n([]),
				children: "Clear all"
			})
		] })
	});
}
//#endregion
//#region src/components/TypeaheadSelect.tsx
function Q({ value: e, options: t, onChange: n, className: r, ariaLabel: i, title: a, placeholder: o = "Search..." }) {
	let [s, c] = v(!1), [l, u] = v(""), [d, f] = v(0), h = _(null), y = _(null), S = t.find((t) => t.value === e), C = g(() => {
		let e = l.trim().toLowerCase();
		return e ? t.filter((t) => t.label.toLowerCase().includes(e)) : t;
	}, [t, l]);
	m(() => {
		if (!s) return;
		u(""), f(Math.max(0, t.findIndex((t) => t.value === e)));
		let n = setTimeout(() => y.current?.focus(), 0);
		return () => clearTimeout(n);
	}, [s]), Lt(h, p(() => c(!1), []), { enabled: s }), m(() => f(0), [l]);
	let T = (e) => {
		n(e.value), c(!1);
	};
	return /* @__PURE__ */ x("div", {
		ref: h,
		className: "relative",
		children: [/* @__PURE__ */ x("button", {
			type: "button",
			role: "combobox",
			"aria-expanded": s,
			"aria-haspopup": "listbox",
			"aria-label": i,
			title: a,
			className: w("jt-input flex items-center justify-between gap-1 text-left", r),
			onClick: () => c((e) => !e),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !s && (e.preventDefault(), c(!0));
			},
			children: [/* @__PURE__ */ b("span", {
				className: "truncate",
				children: S?.label ?? ""
			}), /* @__PURE__ */ b("svg", {
				className: "h-3 w-3 flex-shrink-0 opacity-50",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.5",
				children: /* @__PURE__ */ b("polyline", { points: "6 9 12 15 18 9" })
			})]
		}), s && /* @__PURE__ */ x("div", {
			className: "absolute left-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded-md shadow-lg",
			style: {
				backgroundColor: "var(--jt-grid-menu-bg)",
				border: "1px solid var(--jt-grid-border)"
			},
			children: [/* @__PURE__ */ b("input", {
				ref: y,
				type: "text",
				className: "jt-input m-1.5 w-[calc(100%-12px)] px-1.5 py-1 text-xs",
				placeholder: o,
				"aria-label": `${i || "Options"} search`,
				value: l,
				onChange: (e) => u(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Escape") e.stopPropagation(), c(!1);
					else if (e.key === "ArrowDown") e.preventDefault(), f((e) => Math.min(C.length - 1, e + 1));
					else if (e.key === "ArrowUp") e.preventDefault(), f((e) => Math.max(0, e - 1));
					else if (e.key === "Enter") {
						e.preventDefault();
						let t = C[d];
						t && T(t);
					}
				}
			}), /* @__PURE__ */ b("div", {
				role: "listbox",
				className: "max-h-52 overflow-y-auto pb-1",
				children: C.length === 0 ? /* @__PURE__ */ b("div", {
					className: "px-2.5 py-1.5 text-xs text-grid-text-secondary",
					children: "No matches"
				}) : C.map((t, n) => /* @__PURE__ */ b("button", {
					type: "button",
					role: "option",
					"aria-selected": t.value === e,
					className: w("block w-full px-2.5 py-1.5 text-left text-xs text-grid-text", n === d && "bg-grid-row-hover", t.value === e && "font-semibold text-grid-accent"),
					onMouseEnter: () => f(n),
					onClick: () => T(t),
					children: t.label
				}, t.value))
			})]
		})]
	});
}
//#endregion
//#region src/components/ColumnManager.tsx
var un = [
	0,
	1,
	2,
	3,
	4
], dn = [
	{
		value: "left",
		title: "Align left"
	},
	{
		value: "center",
		title: "Align center"
	},
	{
		value: "right",
		title: "Align right"
	}
];
function fn({ table: e, isOpen: t, onClose: r, columnAlignment: i, onColumnAlignmentChange: a, columnDecimals: s, onColumnDecimalsChange: c }) {
	let [l, u] = v(""), [d, f] = v(null), [p, m] = v(null);
	if (!t) return null;
	let h = e.getAllLeafColumns().filter((e) => !e.columnDef.meta?.isSelectColumn), g = l ? h.filter((e) => o(e).toLowerCase().includes(l.toLowerCase())) : h, _ = () => {
		d && p && d !== p && n(e, d, p), f(null), m(null);
	};
	return /* @__PURE__ */ b("div", {
		className: "fixed inset-0 z-50 flex items-start justify-end",
		style: { backgroundColor: "rgb(16 24 40 / 0.2)" },
		onClick: r,
		children: /* @__PURE__ */ x("div", {
			className: "mr-4 mt-12 flex max-h-[70vh] w-[320px] flex-col overflow-hidden rounded-xl",
			style: {
				backgroundColor: "var(--jt-grid-menu-bg)",
				border: "1px solid var(--jt-grid-border)",
				boxShadow: "var(--jt-grid-menu-shadow)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ x("div", {
					className: "flex items-center justify-between px-4 py-3",
					style: { borderBottom: "1px solid var(--jt-grid-border)" },
					children: [/* @__PURE__ */ b("h3", {
						className: "text-grid-lg font-semibold text-grid-text",
						children: "Manage Columns"
					}), /* @__PURE__ */ b("button", {
						className: "jt-btn !px-1.5",
						onClick: r,
						children: /* @__PURE__ */ b("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 16 16",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.8",
							strokeLinecap: "round",
							children: /* @__PURE__ */ b("path", { d: "M4 4l8 8M12 4l-8 8" })
						})
					})]
				}),
				/* @__PURE__ */ b("div", {
					className: "px-4 py-2",
					style: { borderBottom: "1px solid var(--jt-grid-border)" },
					children: /* @__PURE__ */ b("input", {
						type: "text",
						placeholder: "Search columns...",
						className: "jt-input h-7 w-full px-2",
						value: l,
						onChange: (e) => u(e.target.value)
					})
				}),
				/* @__PURE__ */ x("div", {
					className: "flex items-center gap-2 px-4 py-2",
					style: { borderBottom: "1px solid var(--jt-grid-border)" },
					children: [/* @__PURE__ */ b("input", {
						type: "checkbox",
						className: "h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]",
						checked: e.getIsAllColumnsVisible(),
						onChange: e.getToggleAllColumnsVisibilityHandler()
					}), /* @__PURE__ */ b("span", {
						className: "text-grid-sm font-medium text-grid-text-secondary",
						children: "Toggle All"
					})]
				}),
				/* @__PURE__ */ b("div", {
					className: "flex-1 overflow-y-auto px-2 py-1",
					children: g.map((e) => {
						let t = e.columnDef.meta;
						if (t?.colDef?.lockVisible) return null;
						let n = o(e), r = i[e.id] || "left";
						return /* @__PURE__ */ x("div", {
							className: w("flex h-8 cursor-grab items-center gap-2 rounded-md px-2 text-grid-base transition-colors duration-100", p === e.id && "bg-grid-accent-light", p !== e.id && "hover:bg-grid-row-hover"),
							draggable: !0,
							onDragStart: () => f(e.id),
							onDragOver: (t) => {
								t.preventDefault(), m(e.id);
							},
							onDrop: (e) => {
								e.preventDefault(), _();
							},
							onDragEnd: _,
							children: [
								/* @__PURE__ */ x("svg", {
									width: "10",
									height: "12",
									viewBox: "0 0 8 12",
									className: "shrink-0",
									style: { color: "var(--jt-grid-header-icon)" },
									fill: "currentColor",
									"aria-hidden": !0,
									children: [
										/* @__PURE__ */ b("circle", {
											cx: "2",
											cy: "2",
											r: "1"
										}),
										/* @__PURE__ */ b("circle", {
											cx: "6",
											cy: "2",
											r: "1"
										}),
										/* @__PURE__ */ b("circle", {
											cx: "2",
											cy: "6",
											r: "1"
										}),
										/* @__PURE__ */ b("circle", {
											cx: "6",
											cy: "6",
											r: "1"
										}),
										/* @__PURE__ */ b("circle", {
											cx: "2",
											cy: "10",
											r: "1"
										}),
										/* @__PURE__ */ b("circle", {
											cx: "6",
											cy: "10",
											r: "1"
										})
									]
								}),
								/* @__PURE__ */ b("input", {
									type: "checkbox",
									className: "h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]",
									checked: e.getIsVisible(),
									onChange: e.getToggleVisibilityHandler()
								}),
								/* @__PURE__ */ b(Ht, { dataType: t?.dataType }),
								/* @__PURE__ */ b("span", {
									className: "flex-1 truncate text-grid-text",
									children: n
								}),
								/* @__PURE__ */ b("div", {
									className: "flex items-center overflow-hidden rounded",
									style: { border: "1px solid var(--jt-grid-border)" },
									children: dn.map((t) => /* @__PURE__ */ b("button", {
										className: w("px-1.5 py-0.5 leading-none transition-colors duration-100"),
										style: r === t.value ? {
											backgroundColor: "var(--jt-grid-accent)",
											color: "var(--jt-grid-accent-text)"
										} : { color: "var(--jt-grid-header-icon)" },
										onClick: () => a(e.id, t.value),
										title: t.title,
										children: t.value === "left" ? /* @__PURE__ */ x("svg", {
											width: "10",
											height: "10",
											viewBox: "0 0 10 10",
											children: [
												/* @__PURE__ */ b("rect", {
													x: "0",
													y: "1",
													width: "10",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "0",
													y: "4.5",
													width: "7",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "0",
													y: "8",
													width: "9",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												})
											]
										}) : t.value === "center" ? /* @__PURE__ */ x("svg", {
											width: "10",
											height: "10",
											viewBox: "0 0 10 10",
											children: [
												/* @__PURE__ */ b("rect", {
													x: "0",
													y: "1",
													width: "10",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "1.5",
													y: "4.5",
													width: "7",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "0.5",
													y: "8",
													width: "9",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												})
											]
										}) : /* @__PURE__ */ x("svg", {
											width: "10",
											height: "10",
											viewBox: "0 0 10 10",
											children: [
												/* @__PURE__ */ b("rect", {
													x: "0",
													y: "1",
													width: "10",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "3",
													y: "4.5",
													width: "7",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												}),
												/* @__PURE__ */ b("rect", {
													x: "1",
													y: "8",
													width: "9",
													height: "1.5",
													fill: "currentColor",
													rx: "0.5"
												})
											]
										})
									}, t.value))
								}),
								t?.autoNumeric && /* @__PURE__ */ b(Q, {
									className: "h-5 w-11 text-[10px]",
									title: "Decimal places",
									ariaLabel: "Decimal places",
									value: String(s[e.id] ?? 0),
									options: un.map((e) => ({
										value: String(e),
										label: "." + String(e)
									})),
									onChange: (t) => c(e.id, Number(t))
								}),
								/* @__PURE__ */ b("button", {
									className: w("rounded px-1 text-xs", e.getIsPinned() === "left" ? "bg-grid-accent-light text-grid-accent" : "text-grid-header-icon hover:text-grid-text"),
									onClick: () => e.pin(e.getIsPinned() !== "left" && "left"),
									title: "Pin left",
									"aria-label": "Pin left",
									children: "◀"
								}),
								/* @__PURE__ */ b("button", {
									className: w("rounded px-1 text-xs", e.getIsPinned() === "right" ? "bg-grid-accent-light text-grid-accent" : "text-grid-header-icon hover:text-grid-text"),
									onClick: () => e.pin(e.getIsPinned() !== "right" && "right"),
									title: "Pin right",
									"aria-label": "Pin right",
									children: "▶"
								})
							]
						}, e.id);
					})
				})
			]
		})
	});
}
//#endregion
//#region src/charts/aggregate.ts
function pn(e, t) {
	if (e === "count") return t.length;
	if (t.length === 0) return 0;
	switch (e) {
		case "sum": return t.reduce((e, t) => e + t, 0);
		case "avg": return t.reduce((e, t) => e + t, 0) / t.length;
		case "min": return Math.min(...t);
		case "max": return Math.max(...t);
	}
}
var mn = 12;
function hn(e, t, n) {
	let { categoryColId: r, seriesColIds: i, aggregation: a } = t, o = t.topN ?? mn, s = a === "count" || i.length === 0, c = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.getValue(r), n = e == null || e === "" ? "(empty)" : String(e), a = c.get(n);
		if (a || (a = {}, c.set(n, a)), s) (a.__count__ ||= []).push(1);
		else for (let e of i) {
			let n = Number(t.getValue(e));
			isNaN(n) || (a[e] ||= []).push(n);
		}
	}
	let l = s ? ["__count__"] : i, u = Array.from(c.entries()).map(([e, t]) => ({
		cat: e,
		values: l.map((e) => pn(s ? "count" : a, t[e] || []))
	}));
	u.sort((e, t) => Math.abs(t.values[0] ?? 0) - Math.abs(e.values[0] ?? 0));
	let d = !1;
	if (u.length > o) {
		d = !0;
		let e = u.slice(0, o), t = s ? "count" : a;
		if (t === "count" || t === "sum") {
			let t = u.slice(o);
			e.push({
				cat: "Other",
				values: l.map((e, n) => t.reduce((e, t) => e + (t.values[n] ?? 0), 0))
			});
		}
		u = e;
	}
	return {
		categories: u.map((e) => e.cat),
		series: l.map((e, t) => ({
			colId: e,
			label: e === "__count__" ? "Count" : n[e] || e,
			values: u.map((e) => e.values[t] ?? 0)
		})),
		truncated: d
	};
}
//#endregion
//#region src/charts/ChartSvg.tsx
var gn = [
	"var(--jt-grid-chart-1)",
	"var(--jt-grid-chart-2)",
	"var(--jt-grid-chart-3)",
	"var(--jt-grid-chart-4)",
	"var(--jt-grid-chart-5)",
	"var(--jt-grid-chart-6)"
];
function _n(e) {
	return gn[e % gn.length];
}
var vn = 480, yn = 240, $ = {
	top: 12,
	right: 12,
	bottom: 34,
	left: 48
}, bn = vn - $.left - $.right, xn = yn - $.top - $.bottom;
function Sn(e) {
	if (e <= 0) return 1;
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * t;
}
function Cn(e) {
	return Math.abs(e) >= 1e6 ? `${(e / 1e6).toFixed(1)}M` : Math.abs(e) >= 1e3 ? `${(e / 1e3).toFixed(1)}K` : Number.isInteger(e) ? String(e) : e.toFixed(1);
}
function wn(e, t = 9) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Tn({ max: e, categories: t }) {
	let n = [
		0,
		.25,
		.5,
		.75,
		1
	], r = bn / t.length;
	return /* @__PURE__ */ x(y, { children: [n.map((t) => {
		let n = $.top + xn - t * xn;
		return /* @__PURE__ */ x("g", { children: [/* @__PURE__ */ b("line", {
			x1: $.left,
			y1: n,
			x2: $.left + bn,
			y2: n,
			stroke: "var(--jt-grid-chart-grid)",
			strokeWidth: "1"
		}), /* @__PURE__ */ b("text", {
			x: $.left - 6,
			y: n + 3.5,
			textAnchor: "end",
			fontSize: "10",
			fill: "var(--jt-grid-text-secondary)",
			children: Cn(e * t)
		})] }, t);
	}), t.map((e, t) => /* @__PURE__ */ x("text", {
		x: $.left + r * t + r / 2,
		y: yn - $.bottom + 14,
		textAnchor: "middle",
		fontSize: "10",
		fill: "var(--jt-grid-text-secondary)",
		children: [/* @__PURE__ */ b("title", { children: e }), wn(e)]
	}, t))] });
}
function En({ data: e, stacked: t }) {
	let { categories: n, series: r } = e, i = n.map((e, n) => t ? r.reduce((e, t) => e + Math.max(0, t.values[n] ?? 0), 0) : Math.max(...r.map((e) => e.values[n] ?? 0))), a = Sn(Math.max(...i, 0)), o = bn / n.length, s = o * .68, c = t ? s : s / r.length;
	return /* @__PURE__ */ x("svg", {
		viewBox: `0 0 ${vn} ${yn}`,
		className: "w-full",
		role: "img",
		children: [/* @__PURE__ */ b(Tn, {
			max: a,
			categories: n
		}), n.map((e, n) => {
			let i = $.top + xn;
			return /* @__PURE__ */ b("g", { children: r.map((r, l) => {
				let u = Math.max(0, r.values[n] ?? 0) / a * xn, d = t ? $.left + o * n + (o - s) / 2 : $.left + o * n + (o - s) / 2 + l * c, f = t ? i - u : $.top + xn - u;
				return t && (i -= u), /* @__PURE__ */ b("rect", {
					x: d + .5,
					y: f,
					width: Math.max(c - 1, 1),
					height: u,
					rx: "3",
					fill: _n(l),
					children: /* @__PURE__ */ b("title", { children: `${e} · ${r.label}: ${(r.values[n] ?? 0).toLocaleString()}` })
				}, l);
			}) }, n);
		})]
	});
}
function Dn({ data: e, area: t }) {
	let { categories: n, series: r } = e, i = Sn(Math.max(...r.flatMap((e) => e.values), 0)), a = bn / n.length, o = (e) => $.left + a * e + a / 2, s = (e) => $.top + xn - Math.max(0, e) / i * xn;
	return /* @__PURE__ */ x("svg", {
		viewBox: `0 0 ${vn} ${yn}`,
		className: "w-full",
		role: "img",
		children: [/* @__PURE__ */ b(Tn, {
			max: i,
			categories: n
		}), r.map((e, r) => {
			let i = e.values.map((e, t) => `${o(t).toFixed(1)},${s(e).toFixed(1)}`), c = _n(r);
			return /* @__PURE__ */ x("g", { children: [
				t && /* @__PURE__ */ b("polygon", {
					points: `${$.left + a / 2},${$.top + xn} ${i.join(" ")} ${o(n.length - 1)},${$.top + xn}`,
					fill: c,
					opacity: "0.14"
				}),
				/* @__PURE__ */ b("polyline", {
					points: i.join(" "),
					fill: "none",
					stroke: c,
					strokeWidth: "2",
					strokeLinejoin: "round",
					strokeLinecap: "round"
				}),
				e.values.map((t, r) => /* @__PURE__ */ b("circle", {
					cx: o(r),
					cy: s(t),
					r: "2.5",
					fill: c,
					children: /* @__PURE__ */ b("title", { children: `${n[r]} · ${e.label}: ${t.toLocaleString()}` })
				}, r))
			] }, r);
		})]
	});
}
function On({ data: e }) {
	let t = e.series[0]?.values || [], n = t.reduce((e, t) => e + Math.max(0, t), 0) || 1, r = vn / 2 - 70, i = yn / 2, a = -Math.PI / 2, o = t.map((e, t) => {
		let r = Math.max(0, e) / n, i = a, o = a + r * Math.PI * 2;
		return a = o, {
			i: t,
			v: e,
			frac: r,
			a0: i,
			a1: o
		};
	}), s = (e, t) => `${r + Math.cos(e) * t},${i + Math.sin(e) * t}`;
	return /* @__PURE__ */ x("svg", {
		viewBox: `0 0 ${vn} ${yn}`,
		className: "w-full",
		role: "img",
		children: [
			o.map(({ i: t, v: n, frac: r, a0: i, a1: a }) => {
				if (r <= 0) return null;
				let o = +(a - i > Math.PI);
				return /* @__PURE__ */ b("path", {
					d: r >= .999 ? `M ${s(0, 82)} A 82 82 0 1 1 ${s(Math.PI, 82)} A 82 82 0 1 1 ${s(0, 82)} M ${s(0, 48)} A 48 48 0 1 0 ${s(Math.PI, 48)} A 48 48 0 1 0 ${s(0, 48)}` : `M ${s(i, 48)} L ${s(i, 82)} A 82 82 0 ${o} 1 ${s(a, 82)} L ${s(a, 48)} A 48 48 0 ${o} 0 ${s(i, 48)} Z`,
					fill: _n(t),
					fillRule: "evenodd",
					stroke: "var(--jt-grid-chart-card-bg)",
					strokeWidth: "1.5",
					children: /* @__PURE__ */ b("title", { children: `${e.categories[t]}: ${n.toLocaleString()} (${(r * 100).toFixed(1)}%)` })
				}, t);
			}),
			/* @__PURE__ */ b("text", {
				x: r,
				y: 124,
				textAnchor: "middle",
				fontSize: "13",
				fontWeight: "600",
				fill: "var(--jt-grid-text)",
				children: Cn(n)
			}),
			e.categories.slice(0, 8).map((e, t) => /* @__PURE__ */ x("g", {
				transform: `translate(280, ${$.top + 14 + t * 22})`,
				children: [/* @__PURE__ */ b("rect", {
					width: "10",
					height: "10",
					rx: "2",
					fill: _n(t)
				}), /* @__PURE__ */ x("text", {
					x: "16",
					y: "9",
					fontSize: "11",
					fill: "var(--jt-grid-text)",
					children: [/* @__PURE__ */ b("title", { children: e }), wn(e, 18)]
				})]
			}, t))
		]
	});
}
function kn({ type: e, data: t }) {
	if (t.categories.length === 0) return /* @__PURE__ */ b("div", {
		className: "flex h-40 items-center justify-center text-grid-sm text-grid-text-secondary",
		children: "No data for this chart"
	});
	switch (e) {
		case "bar": return /* @__PURE__ */ b(En, {
			data: t,
			stacked: !1
		});
		case "stackedBar": return /* @__PURE__ */ b(En, {
			data: t,
			stacked: !0
		});
		case "line": return /* @__PURE__ */ b(Dn, {
			data: t,
			area: !1
		});
		case "area": return /* @__PURE__ */ b(Dn, {
			data: t,
			area: !0
		});
		case "donut": return /* @__PURE__ */ b(On, { data: t });
	}
}
//#endregion
//#region src/components/ChartPanel.tsx
var An = 8, jn = [
	{
		value: "bar",
		label: "Bar"
	},
	{
		value: "stackedBar",
		label: "Stacked bar"
	},
	{
		value: "line",
		label: "Line"
	},
	{
		value: "area",
		label: "Area"
	},
	{
		value: "donut",
		label: "Donut"
	}
], Mn = [
	"count",
	"sum",
	"avg",
	"min",
	"max"
];
function Nn({ table: t, charts: n, onChartsChange: r }) {
	let [i, a] = v(null), [s, c] = v(null), l = t.getAllLeafColumns().filter((e) => !e.columnDef.meta?.isSelectColumn), u = l.filter((e) => {
		let t = e.columnDef.meta;
		return t?.autoNumeric || ct(t?.dataType);
	}), d = g(() => {
		let e = {};
		for (let t of l) e[t.id] = o(t);
		return e;
	}, [l]), f = t.getFilteredRowModel().rows, p = g(() => new Map(n.map((e) => [e.id, hn(f, {
		...e,
		topN: e.topN ?? (e.type === "donut" ? 6 : 12)
	}, d)])), [
		n,
		f,
		d
	]), m = () => {
		let e = l.find((e) => !u.includes(e)) || l[0];
		a({
			isNew: !0,
			config: {
				id: `chart_${Math.random().toString(36).slice(2, 9)}`,
				type: "bar",
				categoryColId: e?.id || "",
				seriesColIds: u[0] ? [u[0].id] : [],
				aggregation: u[0] ? "sum" : "count"
			}
		});
	}, h = () => {
		if (!i) return;
		let e = i.config;
		r(i.isNew ? [...n, e] : n.map((t) => t.id === e.id ? e : t)), a(null);
	}, _ = (e) => {
		r(n.filter((t) => t.id !== e)), c(null);
	}, S = async (t) => {
		c(null);
		let r = document.getElementById(`jt-chart-${t}`);
		if (!r) return;
		let { default: i } = await import("./html2canvas-DECPJJGt.js").then((t) => /* @__PURE__ */ e(t.default, 1)), a = await i(r, {
			backgroundColor: getComputedStyle(r).backgroundColor || "#ffffff",
			scale: 2
		}), o = document.createElement("a");
		o.download = `${n.find((e) => e.id === t)?.title || "chart"}.png`, o.href = a.toDataURL("image/png"), o.click();
	};
	return /* @__PURE__ */ x("div", {
		className: "flex-1 overflow-auto p-4",
		onClick: () => c(null),
		children: [/* @__PURE__ */ x("div", {
			className: "grid gap-4",
			style: { gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" },
			children: [n.map((e) => {
				let t = p.get(e.id), n = e.title || `${e.aggregation === "count" ? "Count" : `${e.aggregation} of ${e.seriesColIds.map((e) => d[e] || e).join(", ")}`} by ${d[e.categoryColId] || e.categoryColId}`;
				return /* @__PURE__ */ x("div", {
					id: `jt-chart-${e.id}`,
					className: "jt-chart-card relative",
					children: [
						/* @__PURE__ */ x("div", {
							className: "mb-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ b("h4", {
								className: "truncate text-grid-base font-semibold text-grid-text capitalize",
								title: n,
								children: n
							}), /* @__PURE__ */ x("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ b("button", {
									className: "jt-btn !h-6 !px-1.5",
									onClick: (t) => {
										t.stopPropagation(), c(s === e.id ? null : e.id);
									},
									title: "Chart options",
									"aria-label": "Chart options",
									children: /* @__PURE__ */ x("svg", {
										width: "14",
										height: "14",
										viewBox: "0 0 16 16",
										fill: "currentColor",
										"aria-hidden": !0,
										children: [
											/* @__PURE__ */ b("circle", {
												cx: "8",
												cy: "3",
												r: "1.4"
											}),
											/* @__PURE__ */ b("circle", {
												cx: "8",
												cy: "8",
												r: "1.4"
											}),
											/* @__PURE__ */ b("circle", {
												cx: "8",
												cy: "13",
												r: "1.4"
											})
										]
									})
								}), s === e.id && /* @__PURE__ */ x("div", {
									className: "jt-menu absolute right-0 top-full mt-1 w-40",
									onClick: (e) => e.stopPropagation(),
									children: [
										/* @__PURE__ */ b("button", {
											className: "jt-menu-item",
											onClick: () => {
												a({
													config: { ...e },
													isNew: !1
												}), c(null);
											},
											children: "Edit"
										}),
										/* @__PURE__ */ b("button", {
											className: "jt-menu-item",
											onClick: () => S(e.id),
											children: "Download PNG"
										}),
										/* @__PURE__ */ b("button", {
											className: "jt-menu-item",
											style: { color: "var(--jt-grid-error)" },
											onClick: () => _(e.id),
											children: "Remove"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ b(kn, {
							type: e.type,
							data: t
						}),
						e.type !== "donut" && t.series.length > 1 && /* @__PURE__ */ b("div", {
							className: "mt-2 flex flex-wrap gap-3",
							children: t.series.map((e, t) => /* @__PURE__ */ x("span", {
								className: "inline-flex items-center gap-1.5 text-grid-sm text-grid-text-secondary",
								children: [/* @__PURE__ */ b("span", {
									className: "h-2.5 w-2.5 rounded-sm",
									style: { backgroundColor: _n(t) }
								}), e.label]
							}, e.colId))
						}),
						t.truncated && /* @__PURE__ */ x("div", {
							className: "mt-1 text-grid-sm text-grid-text-secondary",
							children: [
								"Top ",
								e.topN ?? (e.type === "donut" ? 6 : 12),
								" shown",
								t.categories.includes("Other") ? "; remainder grouped as “Other”." : " by magnitude."
							]
						})
					]
				}, e.id);
			}), n.length < An && /* @__PURE__ */ x("button", {
				className: "flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-grid-border text-grid-text-secondary transition-colors hover:border-grid-accent hover:text-grid-accent",
				onClick: m,
				children: [/* @__PURE__ */ b("svg", {
					width: "22",
					height: "22",
					viewBox: "0 0 16 16",
					stroke: "currentColor",
					strokeWidth: "1.6",
					fill: "none",
					strokeLinecap: "round",
					"aria-hidden": !0,
					children: /* @__PURE__ */ b("path", { d: "M8 3v10M3 8h10" })
				}), /* @__PURE__ */ b("span", {
					className: "text-grid-base font-medium",
					children: "Add chart"
				})]
			})]
		}), i && /* @__PURE__ */ b("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center",
			style: { backgroundColor: "rgb(16 24 40 / 0.25)" },
			onClick: () => a(null),
			children: /* @__PURE__ */ x("div", {
				className: "jt-menu w-[340px] !p-4",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ b("h4", {
						className: "mb-3 text-grid-lg font-semibold text-grid-text",
						children: i.isNew ? "Add chart" : "Edit chart"
					}),
					/* @__PURE__ */ b("label", {
						className: "mb-1 block text-grid-sm font-medium text-grid-text-secondary",
						children: "Chart type"
					}),
					/* @__PURE__ */ b("div", {
						className: "mb-3 flex flex-wrap gap-1",
						children: jn.map((e) => /* @__PURE__ */ b("button", {
							className: w("jt-btn !h-7", i.config.type === e.value && "jt-btn-active"),
							onClick: () => a({
								...i,
								config: {
									...i.config,
									type: e.value
								}
							}),
							children: e.label
						}, e.value))
					}),
					/* @__PURE__ */ b("label", {
						className: "mb-1 block text-grid-sm font-medium text-grid-text-secondary",
						children: "Category (X axis)"
					}),
					/* @__PURE__ */ b("div", {
						className: "mb-3",
						children: /* @__PURE__ */ b(Q, {
							className: "w-full px-2 py-1.5",
							ariaLabel: "Category (X axis)",
							value: i.config.categoryColId,
							options: l.map((e) => ({
								value: e.id,
								label: String(d[e.id] ?? e.id)
							})),
							onChange: (e) => a({
								...i,
								config: {
									...i.config,
									categoryColId: e
								}
							})
						})
					}),
					/* @__PURE__ */ b("label", {
						className: "mb-1 block text-grid-sm font-medium text-grid-text-secondary",
						children: "Aggregation"
					}),
					/* @__PURE__ */ b("div", {
						className: "mb-3",
						children: /* @__PURE__ */ b(Q, {
							className: "w-full px-2 py-1.5 capitalize",
							ariaLabel: "Aggregation",
							value: i.config.aggregation,
							options: Mn.map((e) => ({
								value: e,
								label: e
							})),
							onChange: (e) => a({
								...i,
								config: {
									...i.config,
									aggregation: e
								}
							})
						})
					}),
					i.config.aggregation !== "count" && /* @__PURE__ */ x(y, { children: [/* @__PURE__ */ b("label", {
						className: "mb-1 block text-grid-sm font-medium text-grid-text-secondary",
						children: "Value columns (up to 3)"
					}), /* @__PURE__ */ x("div", {
						className: "mb-3 max-h-32 overflow-y-auto rounded-md border border-grid-border p-1",
						children: [u.map((e) => {
							let t = i.config.seriesColIds.includes(e.id);
							return /* @__PURE__ */ x("label", {
								className: "jt-menu-item !h-7 cursor-pointer",
								children: [/* @__PURE__ */ b("input", {
									type: "checkbox",
									checked: t,
									disabled: !t && i.config.seriesColIds.length >= 3,
									onChange: () => a({
										...i,
										config: {
											...i.config,
											seriesColIds: t ? i.config.seriesColIds.filter((t) => t !== e.id) : [...i.config.seriesColIds, e.id]
										}
									})
								}), /* @__PURE__ */ b("span", {
									className: "truncate",
									children: d[e.id]
								})]
							}, e.id);
						}), u.length === 0 && /* @__PURE__ */ b("div", {
							className: "px-2 py-1 text-grid-sm text-grid-text-secondary",
							children: "No numeric columns — use count"
						})]
					})] }),
					/* @__PURE__ */ x("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ b("button", {
							className: "jt-btn",
							onClick: () => a(null),
							children: "Cancel"
						}), /* @__PURE__ */ b("button", {
							className: "jt-btn !text-white",
							style: { backgroundColor: "var(--jt-grid-accent)" },
							disabled: !i.config.categoryColId || i.config.aggregation !== "count" && i.config.seriesColIds.length === 0,
							onClick: h,
							children: i.isNew ? "Add chart" : "Save"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
//#region src/components/RecordPanel.tsx
function Pn({ table: e, rowId: t, onClose: n, onNavigate: r }) {
	let i = g(() => e.getSortedRowModel().rows.flatMap((e) => e.getIsGrouped() ? e.getLeafRows() : [e]).filter((e) => !e.getIsGrouped()), [e.getSortedRowModel().rows]), a = i.findIndex((e) => e.id === t), o = a >= 0 ? i[a] : void 0;
	if (m(() => {
		if (!t) return;
		let e = (e) => {
			e.key === "Escape" && n(), e.key === "ArrowUp" && a > 0 && r(i[a - 1].id), e.key === "ArrowDown" && a < i.length - 1 && r(i[a + 1].id);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		t,
		a,
		i,
		n,
		r
	]), !t || !o) return null;
	let s = e.getAllLeafColumns().filter((e) => !e.columnDef.meta?.isSelectColumn);
	return /* @__PURE__ */ b("div", {
		className: "fixed inset-0 z-50 flex justify-end",
		style: { backgroundColor: "rgb(16 24 40 / 0.2)" },
		onClick: n,
		children: /* @__PURE__ */ x("div", {
			className: "jt-datagrid-panel flex h-full w-[380px] flex-col overflow-hidden",
			style: {
				backgroundColor: "var(--jt-grid-menu-bg)",
				boxShadow: "var(--jt-grid-menu-shadow)",
				borderLeft: "1px solid var(--jt-grid-border)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ x("div", {
				className: "flex items-center justify-between gap-2 px-4 py-3",
				style: { borderBottom: "1px solid var(--jt-grid-border)" },
				children: [/* @__PURE__ */ x("h3", {
					className: "text-grid-lg font-semibold text-grid-text",
					children: [
						"Record ",
						a + 1,
						" ",
						/* @__PURE__ */ x("span", {
							className: "font-normal text-grid-text-secondary",
							children: ["of ", i.length]
						})
					]
				}), /* @__PURE__ */ x("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ b("button", {
							className: "jt-btn !px-1.5",
							disabled: a <= 0,
							style: a <= 0 ? {
								opacity: .4,
								cursor: "default"
							} : void 0,
							onClick: () => a > 0 && r(i[a - 1].id),
							title: "Previous record (↑)",
							"aria-label": "Previous record",
							children: /* @__PURE__ */ b("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ b("path", { d: "M4 10l4-4 4 4" })
							})
						}),
						/* @__PURE__ */ b("button", {
							className: "jt-btn !px-1.5",
							disabled: a >= i.length - 1,
							style: a >= i.length - 1 ? {
								opacity: .4,
								cursor: "default"
							} : void 0,
							onClick: () => a < i.length - 1 && r(i[a + 1].id),
							title: "Next record (↓)",
							"aria-label": "Next record",
							children: /* @__PURE__ */ b("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ b("path", { d: "M4 6l4 4 4-4" })
							})
						}),
						/* @__PURE__ */ b("button", {
							className: "jt-btn !px-1.5",
							onClick: n,
							title: "Close (Esc)",
							"aria-label": "Close record panel",
							children: /* @__PURE__ */ b("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 16 16",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.8",
								strokeLinecap: "round",
								children: /* @__PURE__ */ b("path", { d: "M4 4l8 8M12 4l-8 8" })
							})
						})
					]
				})]
			}), /* @__PURE__ */ b("div", {
				className: "flex-1 overflow-y-auto px-4 py-3",
				children: s.map((e) => {
					let t = e.columnDef.meta, n = typeof e.columnDef.header == "string" ? e.columnDef.header : e.id, r;
					try {
						r = o.getValue(e.id);
					} catch {
						r = void 0;
					}
					let i = t?.valueFormatter && r != null ? t.valueFormatter({
						value: r,
						data: o.original,
						colDef: t.colDef,
						rowIndex: a
					}) : ut(t?.dataType, r) ?? (r == null ? "" : Array.isArray(r) ? r.join(", ") : String(r)), s = t?.dataType ? Zt(t.dataType, r, i) : null;
					return /* @__PURE__ */ x("div", {
						className: "mb-3.5",
						children: [/* @__PURE__ */ x("div", {
							className: "mb-1 flex items-center gap-1.5 text-grid-sm font-medium text-grid-text-secondary",
							children: [
								/* @__PURE__ */ b(Ht, { dataType: t?.dataType }),
								/* @__PURE__ */ b("span", {
									className: "truncate",
									children: n
								}),
								!e.getIsVisible() && /* @__PURE__ */ b("span", {
									className: "text-[10px] uppercase tracking-wide opacity-60",
									children: "hidden"
								})
							]
						}), /* @__PURE__ */ b("div", {
							className: "min-h-[20px] text-grid-base text-grid-text break-words whitespace-pre-wrap",
							children: s ?? (i === "" ? /* @__PURE__ */ b("span", {
								className: "text-grid-text-secondary",
								children: "—"
							}) : i)
						})]
					}, e.id);
				})
			})]
		})
	});
}
//#endregion
//#region src/components/TotalsRow.tsx
function Fn({ table: e, config: t, columnAlignment: n, columnDecimals: r }) {
	let i = t.aggFunc || "sum", a = t.label || "Total", o = e.getVisibleLeafColumns(), s = e.getFilteredRowModel().rows, c = g(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of o) {
			let n = t.columnDef.meta;
			if (!(n?.autoNumeric || ct(n?.dataType) || n?.filterType === "number") || n?.isSelectColumn) continue;
			let r = [];
			for (let e of s) {
				if (e.getIsGrouped()) continue;
				let n = Number(e.getValue(t.id));
				isNaN(n) || r.push(n);
			}
			r.length > 0 && e.set(t.id, pn(i, r));
		}
		return e;
	}, [
		o,
		s,
		i
	]), l = o.find((e) => !e.columnDef.meta?.isSelectColumn)?.id;
	return /* @__PURE__ */ b("tfoot", {
		className: "jt-totals sticky bottom-0 z-20",
		children: /* @__PURE__ */ b("tr", { children: o.map((e) => {
			let t = e.columnDef.meta, o = e.getIsPinned(), u = {};
			o === "left" && (u.left = e.getStart("left")), o === "right" && (u.right = e.getAfter("right"));
			let d = c.get(e.id), f = r?.[e.id];
			return /* @__PURE__ */ b("td", {
				className: o ? "jt-totals-cell sticky z-10" : "jt-totals-cell",
				style: {
					width: e.getSize(),
					textAlign: n?.[e.id] || (d === void 0 ? "left" : "right"),
					...u
				},
				title: d === void 0 ? void 0 : `${i} of ${s.length.toLocaleString()} rows`,
				children: t?.isSelectColumn ? "" : d === void 0 ? e.id === l ? /* @__PURE__ */ x("span", {
					className: "uppercase tracking-wide text-[10px]",
					children: [
						a,
						" (",
						i,
						")"
					]
				}) : "" : d.toLocaleString("en-US", {
					minimumFractionDigits: f ?? 0,
					maximumFractionDigits: f ?? 2
				})
			}, e.id);
		}) })
	});
}
//#endregion
//#region src/components/StylePanel.tsx
var In = [
	{
		label: "System Default",
		value: ""
	},
	{
		label: "Arial / Helvetica",
		value: "Arial, Helvetica, sans-serif"
	},
	{
		label: "Georgia",
		value: "Georgia, serif"
	},
	{
		label: "Trebuchet MS",
		value: "'Trebuchet MS', Helvetica, sans-serif"
	},
	{
		label: "Verdana",
		value: "Verdana, Geneva, sans-serif"
	},
	{
		label: "Courier New",
		value: "'Courier New', Courier, monospace"
	},
	{
		label: "Times New Roman",
		value: "'Times New Roman', Times, serif"
	},
	{
		label: "Tahoma",
		value: "Tahoma, Geneva, sans-serif"
	},
	{
		label: "Lucida Console",
		value: "'Lucida Console', Monaco, monospace"
	}
], Ln = [
	"10px",
	"11px",
	"12px",
	"13px",
	"14px",
	"15px",
	"16px",
	"18px",
	"20px"
];
function Rn({ label: e, children: t }) {
	return /* @__PURE__ */ x("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ b("span", {
			className: "w-24 shrink-0 text-grid-sm text-grid-text-secondary",
			children: e
		}), /* @__PURE__ */ b("div", {
			className: "flex-1 min-w-0",
			children: t
		})]
	});
}
function zn({ value: e, onChange: t }) {
	return /* @__PURE__ */ x("div", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ b("input", {
				type: "color",
				className: "h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0",
				value: e || "#000000",
				onChange: (e) => t(e.target.value)
			}),
			/* @__PURE__ */ b("input", {
				type: "text",
				className: "jt-input h-6 w-full px-1.5 text-xs",
				placeholder: "Default",
				value: e || "",
				onChange: (e) => t(e.target.value || void 0)
			}),
			e && /* @__PURE__ */ b("button", {
				className: "jt-btn !h-6 !px-1.5 text-xs",
				onClick: () => t(void 0),
				title: "Reset",
				"aria-label": "Reset style",
				children: "✕"
			})
		]
	});
}
function Bn({ children: e }) {
	return /* @__PURE__ */ b("div", {
		className: "mb-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-grid-text-secondary",
		style: { borderBottom: "1px solid var(--jt-grid-border)" },
		children: e
	});
}
function Vn({ isOpen: e, onClose: t, styles: n, onStylesChange: r, showSelectionToggle: i }) {
	if (!e) return null;
	let a = (e, t) => {
		r({
			...n,
			[e]: t === "" ? void 0 : t
		});
	};
	return /* @__PURE__ */ b("div", {
		className: "fixed inset-0 z-50 flex items-start justify-end",
		style: { backgroundColor: "rgb(16 24 40 / 0.2)" },
		onClick: t,
		children: /* @__PURE__ */ x("div", {
			className: "mr-4 mt-12 flex max-h-[78vh] w-[320px] flex-col overflow-hidden rounded-xl",
			style: {
				backgroundColor: "var(--jt-grid-menu-bg)",
				border: "1px solid var(--jt-grid-border)",
				boxShadow: "var(--jt-grid-menu-shadow)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ x("div", {
				className: "flex items-center justify-between px-4 py-3",
				style: { borderBottom: "1px solid var(--jt-grid-border)" },
				children: [/* @__PURE__ */ b("h3", {
					className: "text-grid-lg font-semibold text-grid-text",
					children: "Style Settings"
				}), /* @__PURE__ */ b("button", {
					className: "jt-btn !px-1.5",
					onClick: t,
					children: /* @__PURE__ */ b("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.8",
						strokeLinecap: "round",
						children: /* @__PURE__ */ b("path", { d: "M4 4l8 8M12 4l-8 8" })
					})
				})]
			}), /* @__PURE__ */ x("div", {
				className: "flex-1 space-y-5 overflow-y-auto px-4 py-3",
				children: [
					/* @__PURE__ */ x("section", { children: [/* @__PURE__ */ b(Bn, { children: "Header Row" }), /* @__PURE__ */ x("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ b(Rn, {
								label: "Font family",
								children: /* @__PURE__ */ b(Q, {
									className: "h-7 w-full px-1.5 text-xs",
									ariaLabel: "Header font family",
									value: n.headerFontFamily || "",
									options: In.map((e) => ({
										value: e.value,
										label: e.label
									})),
									onChange: (e) => a("headerFontFamily", e)
								})
							}),
							/* @__PURE__ */ b(Rn, {
								label: "Font size",
								children: /* @__PURE__ */ b(Q, {
									className: "h-7 w-full px-1.5 text-xs",
									ariaLabel: "Header font size",
									value: n.headerFontSize || "",
									options: [{
										value: "",
										label: "Default"
									}, ...Ln.map((e) => ({
										value: e,
										label: e
									}))],
									onChange: (e) => a("headerFontSize", e)
								})
							}),
							/* @__PURE__ */ b(Rn, {
								label: "Font style",
								children: /* @__PURE__ */ b("div", {
									className: "flex gap-1",
									children: [
										"normal",
										"bold",
										"italic"
									].map((e) => /* @__PURE__ */ b("button", {
										className: "flex-1 rounded-md px-2 py-1 text-xs capitalize transition-colors",
										style: {
											border: "1px solid var(--jt-grid-border)",
											...e === "bold" ? { fontWeight: 700 } : e === "italic" ? { fontStyle: "italic" } : {},
											...(n.headerFontStyle || "normal") === e ? {
												borderColor: "var(--jt-grid-accent)",
												backgroundColor: "var(--jt-grid-accent-light)",
												color: "var(--jt-grid-accent)"
											} : { color: "var(--jt-grid-text-secondary)" }
										},
										onClick: () => a("headerFontStyle", e),
										children: e
									}, e))
								})
							}),
							/* @__PURE__ */ b(Rn, {
								label: "Font color",
								children: /* @__PURE__ */ b(zn, {
									value: n.headerFontColor,
									onChange: (e) => a("headerFontColor", e)
								})
							})
						]
					})] }),
					/* @__PURE__ */ x("section", { children: [/* @__PURE__ */ b(Bn, { children: "Data Rows" }), /* @__PURE__ */ x("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ b(Rn, {
								label: "Font family",
								children: /* @__PURE__ */ b(Q, {
									className: "h-7 w-full px-1.5 text-xs",
									ariaLabel: "Row font family",
									value: n.rowFontFamily || "",
									options: In.map((e) => ({
										value: e.value,
										label: e.label
									})),
									onChange: (e) => a("rowFontFamily", e)
								})
							}),
							/* @__PURE__ */ b(Rn, {
								label: "Font size",
								children: /* @__PURE__ */ b(Q, {
									className: "h-7 w-full px-1.5 text-xs",
									ariaLabel: "Row font size",
									value: n.rowFontSize || "",
									options: [{
										value: "",
										label: "Default"
									}, ...Ln.map((e) => ({
										value: e,
										label: e
									}))],
									onChange: (e) => a("rowFontSize", e)
								})
							}),
							/* @__PURE__ */ b(Rn, {
								label: "Alt-row color",
								children: /* @__PURE__ */ b(zn, {
									value: n.altRowBgColor,
									onChange: (e) => a("altRowBgColor", e)
								})
							})
						]
					})] }),
					i && /* @__PURE__ */ x("section", { children: [/* @__PURE__ */ b(Bn, { children: "Layout" }), /* @__PURE__ */ x("label", {
						className: "flex cursor-pointer items-center gap-2 text-grid-base text-grid-text",
						children: [/* @__PURE__ */ b("input", {
							type: "checkbox",
							className: "h-3.5 w-3.5 rounded accent-[var(--jt-grid-accent)]",
							checked: n.showCheckboxColumn !== !1,
							onChange: (e) => a("showCheckboxColumn", e.target.checked)
						}), "Show row-number / selection column"]
					})] }),
					/* @__PURE__ */ b("button", {
						className: "jt-btn w-full justify-center",
						style: { border: "1px solid var(--jt-grid-border)" },
						onClick: () => r({}),
						children: "Reset all styles"
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/export/csvExport.ts
function Hn(e, t) {
	let { fileName: n = "export.csv", ...r } = t || {}, i = Un(e, r);
	l(new Blob([i], { type: "text/csv;charset=utf-8;" }), n);
}
function Un(e, t) {
	let { includeHeaders: n = !0, onlySelected: r = !1, columnIds: i } = t || {}, a = e.getAllLeafColumns().filter((e) => !(!e.getIsVisible() || i && !i.includes(e.id))), s = r ? e.getSelectedRowModel().rows : e.getFilteredRowModel().rows, c = [];
	n && c.push(a.map((e) => Wn(o(e))).join(","));
	for (let e of s) {
		if (e.getIsGrouped()) continue;
		let t = a.map((t) => {
			let n = e.getValue(t.id), r = t.columnDef.meta, i = n;
			return r?.valueFormatter && n != null && (i = r.valueFormatter({
				value: n,
				data: e.original,
				colDef: r.colDef || {},
				rowIndex: e.index
			})), Wn(i);
		}).join(",");
		c.push(t);
	}
	return c.join("\n");
}
function Wn(e) {
	if (e == null) return "";
	let t = String(e);
	return t.includes(",") || t.includes("\"") || t.includes("\n") || t.includes("\r") ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
//#endregion
//#region src/export/pdfExport.ts
var Gn = /* @__PURE__ */ t({
	exportToPdf: () => Jn,
	generateHtmlTable: () => Xn,
	generatePdfBase64: () => Yn
});
function Kn(e, t) {
	let n = t.getValue(e.id), r = e.columnDef.meta;
	return r?.valueFormatter && n != null ? r.valueFormatter({
		value: n,
		data: t.original,
		colDef: r.colDef || {},
		rowIndex: t.index
	}) : r?.autoNumeric && n != null && !isNaN(Number(n)) ? Number(n).toLocaleString("en-US") : Array.isArray(n) ? n.join(", ") : n == null ? "" : String(n);
}
function qn(e, t) {
	return e.getAllLeafColumns().filter((e) => !(!e.getIsVisible() || e.columnDef.meta?.isSelectColumn || t && !t.includes(e.id)));
}
async function Jn(e, t) {
	let { fileName: n = "export.pdf", ...r } = t || {}, i = await Yn(e, r), a = Uint8Array.from(atob(i), (e) => e.charCodeAt(0));
	l(new Blob([a], { type: "application/pdf" }), n);
}
async function Yn(e, t) {
	let { title: n, subtitle: r, onlySelected: i = !1, columnIds: a } = t || {}, [{ default: s }, { default: c }] = await Promise.all([import("./jspdf.es.min-DbzZMH0w.js"), import("./jspdf.plugin.autotable-D1ivibs9.js")]), l = qn(e, a), u = (i ? e.getSelectedRowModel().rows : e.getFilteredRowModel().rows).filter((e) => !e.getIsGrouped()), d = l.map((e) => o(e)), f = u.map((e) => l.map((t) => Kn(t, e))), p = new s({
		orientation: l.length > 6 ? "landscape" : "portrait",
		unit: "mm",
		format: "a4"
	}), m = 15;
	return n && (p.setFontSize(14), p.setFont("helvetica", "bold"), p.text(n, 14, m), m += 8), r && (p.setFontSize(9), p.setFont("helvetica", "normal"), p.text(r, 14, m), m += 6), c(p, {
		head: [d],
		body: f,
		startY: m,
		styles: {
			fontSize: 8,
			cellPadding: 2
		},
		headStyles: {
			fillColor: [
				47,
				111,
				224
			],
			textColor: 255,
			fontStyle: "bold"
		},
		alternateRowStyles: { fillColor: [
			249,
			250,
			251
		] },
		margin: {
			left: 14,
			right: 14
		}
	}), p.output("datauristring").split(",")[1];
}
function Xn(e, t, n) {
	let r = qn(e), i = e.getFilteredRowModel().rows.filter((e) => !e.getIsGrouped()), a = r.map((e) => `<th style="padding: 8px 12px; text-align: left; background: #2f6fe0; color: #fff; font-size: 12px; font-weight: 600;">${o(e)}</th>`).join(""), s = i.map((e, t) => `<tr style="background:${t % 2 == 0 ? "#ffffff" : "#f9fafb"}">${r.map((t) => `<td style="padding: 6px 12px; font-size: 11px; border-bottom: 1px solid #e5e7eb;">${Kn(t, e)}</td>`).join("")}</tr>`).join("");
	return `${t ? `<h2 style="font-family:sans-serif;margin:0 0 4px;font-size:16px;color:#111827">${t}</h2>${n ? `<p style="font-family:sans-serif;margin:0 0 12px;font-size:12px;color:#6b7280">${n}</p>` : ""}` : ""}<table style="border-collapse:collapse;width:100%;font-family:-apple-system,sans-serif"><thead><tr>${a}</tr></thead><tbody>${s}</tbody></table>`;
}
//#endregion
//#region src/components/ExportModal.tsx
var Zn = {
	html: "HTML table (inline)",
	pdf: "PDF attachment",
	csv: "CSV attachment"
}, Qn = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
async function $n(e, t, n) {
	return t === "html" ? { bodyHtml: Xn(e, n) } : t === "csv" ? { attachment: {
		type: "csv",
		content: Un(e)
	} } : { attachment: {
		type: "pdf",
		contentBase64: await Yn(e, { title: n })
	} };
}
function er({ isOpen: e, initialTab: t = "email", onClose: n, table: r, title: i = "Report", emailEndpoint: a, scheduleEndpoint: o, fetchHeaders: s }) {
	let [c, l] = v(t), [u, d] = v(""), [f, p] = v(""), [m, h] = v(i), [g, _] = v(""), [y, S] = v("html"), [C, T] = v("weekly"), [E, D] = v(1), [O, k] = v(1), [A, j] = v("09:00"), [M, N] = v("idle"), [P, F] = v("");
	if (!e) return null;
	let I = c === "email" ? a : o || a, L = async () => {
		if (I) {
			N("busy"), F("");
			try {
				let e = {
					to: u.split(/[,;\s]+/).filter(Boolean),
					cc: f.split(/[,;\s]+/).filter(Boolean),
					subject: m,
					message: g,
					format: y,
					...await $n(r, y, m)
				}, t = c === "email" ? e : {
					...e,
					schedule: {
						frequency: C,
						dayOfWeek: E,
						dayOfMonth: O,
						time: A
					}
				}, n = await fetch(I, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...s
					},
					body: JSON.stringify(t)
				});
				if (!n.ok) throw Error(`${n.status} ${n.statusText}`);
				N("done");
			} catch (e) {
				N("error"), F(e?.message || "Request failed");
			}
		}
	}, R = "jt-input h-7 w-full px-2", z = "mb-1 block text-grid-sm font-medium text-grid-text-secondary";
	return /* @__PURE__ */ b("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center",
		style: { backgroundColor: "rgb(16 24 40 / 0.25)" },
		onClick: n,
		children: /* @__PURE__ */ x("div", {
			className: "w-[400px] max-w-[92vw] rounded-xl p-4",
			style: {
				backgroundColor: "var(--jt-grid-menu-bg)",
				border: "1px solid var(--jt-grid-border)",
				boxShadow: "var(--jt-grid-menu-shadow)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ x("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ b("h3", {
						className: "text-grid-lg font-semibold text-grid-text",
						children: "Send Report"
					}), /* @__PURE__ */ b("button", {
						className: "jt-btn !px-1.5",
						onClick: n,
						children: /* @__PURE__ */ b("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 16 16",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.8",
							strokeLinecap: "round",
							children: /* @__PURE__ */ b("path", { d: "M4 4l8 8M12 4l-8 8" })
						})
					})]
				}),
				/* @__PURE__ */ b("div", {
					className: "mb-3 flex items-center rounded-md p-0.5",
					style: { backgroundColor: "var(--jt-grid-row-hover)" },
					children: ["email", "schedule"].map((e) => /* @__PURE__ */ b("button", {
						className: "flex h-6 flex-1 items-center justify-center rounded text-grid-sm font-medium capitalize transition-colors",
						style: c === e ? {
							backgroundColor: "var(--jt-grid-bg)",
							color: "var(--jt-grid-accent)",
							boxShadow: "0 1px 2px rgb(16 24 40 / 0.08)"
						} : { color: "var(--jt-grid-text-secondary)" },
						onClick: () => {
							l(e), N("idle");
						},
						children: e === "email" ? "Email now" : "Schedule"
					}, e))
				}),
				I ? /* @__PURE__ */ x("div", {
					className: "space-y-2.5",
					children: [
						/* @__PURE__ */ x("div", { children: [/* @__PURE__ */ b("label", {
							className: z,
							children: "To (comma-separated)"
						}), /* @__PURE__ */ b("input", {
							className: R,
							value: u,
							onChange: (e) => d(e.target.value),
							placeholder: "alice@company.com, bob@company.com"
						})] }),
						/* @__PURE__ */ x("div", { children: [/* @__PURE__ */ b("label", {
							className: z,
							children: "CC"
						}), /* @__PURE__ */ b("input", {
							className: R,
							value: f,
							onChange: (e) => p(e.target.value)
						})] }),
						/* @__PURE__ */ x("div", { children: [/* @__PURE__ */ b("label", {
							className: z,
							children: "Subject"
						}), /* @__PURE__ */ b("input", {
							className: R,
							value: m,
							onChange: (e) => h(e.target.value)
						})] }),
						/* @__PURE__ */ x("div", { children: [/* @__PURE__ */ b("label", {
							className: z,
							children: "Message"
						}), /* @__PURE__ */ b("textarea", {
							className: "jt-input w-full px-2 py-1",
							rows: 2,
							value: g,
							onChange: (e) => _(e.target.value)
						})] }),
						/* @__PURE__ */ x("div", { children: [/* @__PURE__ */ b("label", {
							className: z,
							children: "Format"
						}), /* @__PURE__ */ b("div", {
							className: "flex gap-1",
							children: Object.keys(Zn).map((e) => /* @__PURE__ */ b("button", {
								className: w("jt-btn flex-1 justify-center !h-7", y === e && "jt-btn-active"),
								style: { border: "1px solid var(--jt-grid-border)" },
								onClick: () => S(e),
								children: Zn[e]
							}, e))
						})] }),
						c === "schedule" && /* @__PURE__ */ x("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ x("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ b("label", {
										className: z,
										children: "Frequency"
									}), /* @__PURE__ */ b(Q, {
										className: "w-full",
										ariaLabel: "Frequency",
										value: C,
										options: [
											{
												value: "daily",
												label: "Daily"
											},
											{
												value: "weekly",
												label: "Weekly"
											},
											{
												value: "monthly",
												label: "Monthly"
											}
										],
										onChange: (e) => T(e)
									})]
								}),
								C === "weekly" && /* @__PURE__ */ x("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ b("label", {
										className: z,
										children: "Day"
									}), /* @__PURE__ */ b(Q, {
										className: "w-full",
										ariaLabel: "Day of week",
										value: String(E),
										options: Qn.map((e, t) => ({
											value: String(t),
											label: e
										})),
										onChange: (e) => D(Number(e))
									})]
								}),
								C === "monthly" && /* @__PURE__ */ x("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ b("label", {
										className: z,
										children: "Day of month"
									}), /* @__PURE__ */ b(Q, {
										className: "w-full",
										ariaLabel: "Day of month",
										value: String(O),
										options: Array.from({ length: 28 }, (e, t) => ({
											value: String(t + 1),
											label: String(t + 1)
										})),
										onChange: (e) => k(Number(e))
									})]
								}),
								/* @__PURE__ */ x("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ b("label", {
										className: z,
										children: "Time"
									}), /* @__PURE__ */ b("input", {
										type: "time",
										className: R,
										value: A,
										onChange: (e) => j(e.target.value)
									})]
								})
							]
						}),
						M === "error" && /* @__PURE__ */ x("div", {
							className: "flex items-center justify-between rounded-md px-2 py-1.5 text-grid-sm",
							style: {
								backgroundColor: "color-mix(in srgb, var(--jt-grid-error) 10%, transparent)",
								color: "var(--jt-grid-error)"
							},
							children: [/* @__PURE__ */ b("span", {
								className: "truncate",
								children: P
							}), /* @__PURE__ */ b("button", {
								className: "underline",
								onClick: () => navigator.clipboard?.writeText(P),
								children: "copy"
							})]
						}),
						M === "done" && /* @__PURE__ */ b("div", {
							className: "rounded-md px-2 py-1.5 text-grid-sm",
							style: {
								backgroundColor: "color-mix(in srgb, var(--jt-grid-success) 12%, transparent)",
								color: "var(--jt-grid-success)"
							},
							children: c === "email" ? "Report sent." : "Schedule saved."
						}),
						/* @__PURE__ */ x("div", {
							className: "flex justify-end gap-2 pt-1",
							children: [/* @__PURE__ */ b("button", {
								className: "jt-btn",
								onClick: n,
								children: "Close"
							}), /* @__PURE__ */ b("button", {
								className: "jt-btn !text-white",
								style: {
									backgroundColor: "var(--jt-grid-accent)",
									opacity: M === "busy" || !u ? .6 : 1
								},
								disabled: M === "busy" || !u,
								onClick: L,
								children: M === "busy" ? "Sending…" : c === "email" ? "Send now" : "Save schedule"
							})]
						})
					]
				}) : /* @__PURE__ */ x("p", {
					className: "py-4 text-center text-grid-sm text-grid-text-secondary",
					children: [
						"No ",
						c,
						" endpoint configured — set ",
						/* @__PURE__ */ b("code", { children: "emailExportEndpoint" }),
						" on the grid."
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/HeaderContextMenu.tsx
function tr({ column: e, position: t, onClose: n, themeStyle: r }) {
	let i = _(null);
	if (Lt(i, n, {
		enabled: !!t,
		escape: !0
	}), m(() => {
		if (!i.current || !t) return;
		let e = i.current.getBoundingClientRect();
		e.right > window.innerWidth && (i.current.style.left = `${t.x - e.width}px`), e.bottom > window.innerHeight && (i.current.style.top = `${t.y - e.height}px`);
	}, [t]), !e || !t) return null;
	let a = e.getIsSorted(), o = e.getIsPinned(), s = e.getIsGrouped(), c = [];
	return e.getCanSort() && (c.push({
		label: "Sort ascending",
		active: a === "asc",
		action: () => e.toggleSorting(!1, !1)
	}, {
		label: "Sort descending",
		active: a === "desc",
		action: () => e.toggleSorting(!0, !1)
	}), a && c.push({
		label: "Clear sort",
		action: () => e.clearSorting()
	}), c.push({
		label: "",
		action: () => {},
		divider: !0
	})), e.getCanPin() && c.push({
		label: o === "left" ? "Unpin" : "Pin left",
		active: o === "left",
		action: () => e.pin(o !== "left" && "left")
	}, {
		label: o === "right" ? "Unpin" : "Pin right",
		active: o === "right",
		action: () => e.pin(o !== "right" && "right")
	}), e.getCanGroup() && c.push({
		label: s ? "Ungroup" : "Group by this column",
		active: s,
		action: () => e.toggleGrouping()
	}), e.getCanResize() && c.push({
		label: "Reset column width",
		action: () => e.resetSize()
	}), e.getCanHide() && (c.push({
		label: "",
		action: () => {},
		divider: !0
	}), c.push({
		label: "Hide column",
		action: () => e.toggleVisibility(!1)
	})), S(/* @__PURE__ */ b("div", {
		ref: i,
		className: "jt-datagrid jt-context-menu jt-menu fixed z-[70] min-w-[190px]",
		style: {
			left: t.x,
			top: t.y,
			...r,
			boxShadow: "var(--jt-grid-menu-shadow)"
		},
		children: c.map((e, t) => e.divider ? /* @__PURE__ */ b("hr", {
			className: "my-1",
			style: { borderColor: "var(--jt-grid-border)" }
		}, t) : /* @__PURE__ */ b("button", {
			className: w("jt-menu-item", e.active && "jt-menu-item-active"),
			onClick: () => {
				e.action(), n();
			},
			children: e.label
		}, t))
	}), document.body);
}
//#endregion
//#region src/components/Pagination.tsx
function nr({ disabled: e, onClick: t, title: n, children: r }) {
	return /* @__PURE__ */ b("button", {
		className: w("flex h-[26px] min-w-[26px] items-center justify-center rounded-md px-1 text-grid-sm transition-colors duration-100", !e && "text-grid-text hover:bg-grid-row-hover"),
		style: e ? {
			color: "var(--jt-grid-border-strong)",
			cursor: "default"
		} : void 0,
		onClick: t,
		disabled: e,
		title: n,
		"aria-label": n,
		children: r
	});
}
function rr({ table: e, pageSizeOptions: t }) {
	let n = e.getPageCount(), r = e.getState().pagination.pageIndex, i = e.getState().pagination.pageSize, a = e.getFilteredRowModel().rows.length, o = a === 0 ? 0 : r * i + 1, s = Math.min((r + 1) * i, a);
	return /* @__PURE__ */ x("div", {
		className: "jt-pagination flex h-9 items-center justify-between px-2.5",
		style: {
			backgroundColor: "var(--jt-grid-toolbar-bg)",
			borderTop: "1px solid var(--jt-grid-border)"
		},
		children: [
			/* @__PURE__ */ x("div", {
				className: "flex items-center gap-2 text-grid-sm text-grid-text-secondary",
				children: [/* @__PURE__ */ b("span", { children: "Rows per page:" }), /* @__PURE__ */ b(Q, {
					className: "h-6 px-1.5 text-grid-sm",
					ariaLabel: "Rows per page",
					value: String(i),
					options: t.map((e) => ({
						value: String(e),
						label: String(e)
					})),
					onChange: (t) => e.setPageSize(Number(t))
				})]
			}),
			/* @__PURE__ */ x("span", {
				className: "text-grid-sm text-grid-text-secondary tabular-nums",
				children: [
					o.toLocaleString(),
					"-",
					s.toLocaleString(),
					" of ",
					a.toLocaleString()
				]
			}),
			/* @__PURE__ */ x("div", {
				className: "flex items-center gap-0.5",
				children: [
					/* @__PURE__ */ b(nr, {
						disabled: !e.getCanPreviousPage(),
						onClick: () => e.setPageIndex(0),
						title: "First page",
						children: "«"
					}),
					/* @__PURE__ */ b(nr, {
						disabled: !e.getCanPreviousPage(),
						onClick: () => e.previousPage(),
						title: "Previous page",
						children: "‹"
					}),
					Array.from({ length: Math.min(n, 7) }, (t, i) => {
						let a;
						a = n <= 7 || r < 3 ? i : r > n - 4 ? n - 7 + i : r - 3 + i;
						let o = a === r;
						return /* @__PURE__ */ b("button", {
							className: w("h-[26px] min-w-[26px] rounded-md px-1 text-grid-sm tabular-nums transition-colors duration-100", !o && "text-grid-text hover:bg-grid-row-hover"),
							style: o ? {
								backgroundColor: "var(--jt-grid-accent-light)",
								color: "var(--jt-grid-accent)",
								fontWeight: 600
							} : void 0,
							onClick: () => e.setPageIndex(a),
							children: a + 1
						}, a);
					}),
					/* @__PURE__ */ b(nr, {
						disabled: !e.getCanNextPage(),
						onClick: () => e.nextPage(),
						title: "Next page",
						children: "›"
					}),
					/* @__PURE__ */ b(nr, {
						disabled: !e.getCanNextPage(),
						onClick: () => e.setPageIndex(n - 1),
						title: "Last page",
						children: "»"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/StatusBar.tsx
function ir({ table: e }) {
	let t = e.getPreFilteredRowModel().rows.length, n = e.getFilteredRowModel().rows.length, r = e.getSelectedRowModel().rows.length, i = t !== n;
	return /* @__PURE__ */ x("div", {
		className: "jt-status-bar flex items-center gap-4 px-3 py-1.5 text-grid-sm text-grid-text-secondary tabular-nums",
		style: {
			backgroundColor: "var(--jt-grid-header-bg)",
			borderTop: "1px solid var(--jt-grid-border)"
		},
		children: [
			/* @__PURE__ */ x("span", { children: ["Total: ", /* @__PURE__ */ b("strong", {
				className: "text-grid-text",
				children: t.toLocaleString()
			})] }),
			i && /* @__PURE__ */ x("span", { children: ["Showing: ", /* @__PURE__ */ b("strong", {
				className: "text-grid-text",
				children: n.toLocaleString()
			})] }),
			r > 0 && /* @__PURE__ */ x("span", { children: ["Selected: ", /* @__PURE__ */ b("strong", {
				className: "text-grid-accent",
				children: r.toLocaleString()
			})] })
		]
	});
}
//#endregion
//#region src/components/Overlay.tsx
function ar({ loading: e, loadingComponent: t }) {
	return e ? /* @__PURE__ */ b("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center",
		style: { backgroundColor: "color-mix(in srgb, var(--jt-grid-bg) 72%, transparent)" },
		children: t ? /* @__PURE__ */ b(t, {}) : /* @__PURE__ */ x("div", {
			className: "flex flex-col items-center gap-2",
			children: [/* @__PURE__ */ b("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-grid-border border-t-grid-accent" }), /* @__PURE__ */ b("span", {
				className: "text-sm text-grid-text-secondary",
				children: "Loading..."
			})]
		})
	}) : null;
}
//#endregion
//#region src/components/DataGrid.tsx
var or = {
	pagination: !0,
	paginationPageSize: 100,
	rowSelection: "multiple",
	floatingFilters: !0,
	statusBar: !0,
	toolbar: !0
}, sr = {
	regular: or,
	normal: or,
	drilldown: {
		groupPanel: !0,
		groupDefaultExpanded: 1,
		rowSelection: "multiple",
		floatingFilters: !0,
		statusBar: !0,
		toolbar: !0
	},
	finance: {
		pagination: !1,
		density: "compact",
		rowSelection: !1,
		floatingFilters: !0,
		statusBar: !0,
		toolbar: {
			search: !0,
			columnManager: !0,
			export: {
				csv: !0,
				excel: !0
			},
			density: !0,
			charts: !0,
			themeSwitcher: !0
		}
	},
	editable: {
		pagination: !0,
		paginationPageSize: 50,
		rowSelection: "single",
		floatingFilters: !1,
		statusBar: !0,
		toolbar: {
			search: !0,
			columnManager: !0,
			export: { csv: !0 },
			density: !0,
			charts: !0,
			themeSwitcher: !0
		}
	},
	highvol: {
		pagination: !0,
		paginationPageSize: 500,
		paginationPageSizeOptions: [
			100,
			250,
			500,
			1e3,
			5e3
		],
		density: "compact",
		rowSelection: "multiple",
		floatingFilters: !0,
		statusBar: !0,
		toolbar: !0
	}
};
function cr(e, t) {
	let { gridType: n = "regular", enableRowGroup: c, ...l } = e, u = {
		...sr[n],
		...l
	};
	c === !0 && (u.groupPanel = !0);
	let { rowSelection: d = !1, pagination: f = !1, paginationPageSizeOptions: y = [
		25,
		50,
		100,
		250,
		500,
		1e3
	], groupPanel: S = !1, groupDefaultExpanded: C, floatingFilters: T = !1, statusBar: E = !0, toolbar: D = !0, theme: O = "light", gridLook: k, accentTheme: A, showThemeSwitcher: j = !0, onAppearanceChange: M, charts: N = !0, defaultCharts: P, rowColorRules: F, recordPanel: I = !0, totalsRow: L, onRefresh: R, defaultStyleSettings: z, emailExportEndpoint: ee, scheduleExportEndpoint: B, fetchHeaders: V, className: te, gridId: H, persistSettings: ne = !1, rowHeight: re, headerHeight: ie, height: U = 600, loading: W = !1, loadingComponent: G, noRowsComponent: ae, noRowsMessage: oe, onGridReady: se, onCellClicked: ce, onCellDoubleClicked: le, onCellValueChanged: ue, onSelectionChanged: de, onSortChanged: fe, onFilterChanged: pe } = u, me = g(() => ({
		...u,
		enableRowGroup: c ?? !0,
		rowSelection: d,
		pagination: f,
		paginationPageSizeOptions: y,
		groupPanel: S,
		groupDefaultExpanded: C,
		floatingFilters: T,
		statusBar: E,
		toolbar: D,
		theme: O,
		height: U,
		loading: W
	}), [u]), he = g(() => ne ? wt(H) : null, [ne, H]), [ge, _e] = v(he?.styleSettings ?? z ?? {}), K = Ot(me, { hideSelectColumn: ge.showCheckboxColumn === !1 }), { table: q, globalFilter: ve, setGlobalFilter: ye, grouping: be, setGrouping: xe, density: Se, setDensity: Ce, columnAlignment: we, setColumnAlignment: Te, columnDecimals: Ee, setColumnDecimals: De, resetState: Oe } = K, ke = _(null), [Ae, je] = v(!1), [Me, Ne] = v("grid"), [Pe, Fe] = v(null), Ie = _(!1), Le = k ?? (O === "dark" ? "midnight" : "airtable"), [J, Re] = v({
		look: he?.look ?? Le,
		accent: he?.accent ?? A ?? "blue"
	}), [ze, Be] = v(he?.charts ?? P ?? []), [Y, Ve] = v(!1), [X, He] = v(he?.showFloatingFilters ?? !0), [Ue, We] = v(null), [Ge, Ke] = v(null);
	m(() => {
		if (!ne || !H) return;
		let e = setTimeout(() => {
			Tt(H, {
				look: J.look,
				accent: J.accent,
				charts: ze,
				styleSettings: ge,
				showFloatingFilters: X
			});
		}, 300);
		return () => clearTimeout(e);
	}, [
		ne,
		H,
		J,
		ze,
		ge,
		X
	]);
	let qe = p((e) => {
		Re(e), M?.(e);
	}, [M]), Je = typeof O == "object" ? O : void 0, { style: Ye, isDark: Xe } = g(() => {
		let e = It({
			look: J.look,
			accent: J.accent,
			density: Se,
			themeTokens: Je,
			rowHeight: re,
			headerHeight: ie
		}), t = ge, n = e.style;
		return t.headerFontFamily && (n["--jt-grid-header-font-family"] = t.headerFontFamily), t.headerFontSize && (n["--jt-grid-header-font-size"] = t.headerFontSize), t.headerFontStyle === "italic" && (n["--jt-grid-header-font-style"] = "italic"), t.headerFontStyle === "bold" && (n["--jt-grid-header-weight"] = "700"), t.headerFontStyle === "normal" && (n["--jt-grid-header-weight"] = "400"), t.headerFontColor && (n["--jt-grid-header-text"] = t.headerFontColor), t.rowFontFamily && (n["--jt-grid-font-family"] = t.rowFontFamily), t.rowFontSize && (n["--jt-grid-font-base"] = t.rowFontSize), t.altRowBgColor && (n["--jt-grid-stripe-bg"] = t.altRowBgColor), e;
	}, [
		J,
		Se,
		Je,
		re,
		ie,
		ge
	]), Ze = g(() => {
		let e = typeof D == "boolean" ? D ? {
			search: !0,
			columnManager: !0,
			export: { csv: !0 },
			density: !0
		} : {} : { ...D };
		return Object.keys(e).length === 0 ? e : (e.charts === void 0 && (e.charts = N), e.themeSwitcher === void 0 && (e.themeSwitcher = j), e);
	}, [
		D,
		N,
		j
	]), Z = g(() => ({
		getRowData: () => q.getCoreRowModel().rows.map((e) => e.original),
		getDisplayedRowCount: () => q.getRowModel().rows.length,
		getSelectedRows: () => q.getSelectedRowModel().rows.map((e) => e.original),
		autoSizeAllColumns: () => q.resetColumnSizing(),
		setColumnVisible: (e, t) => {
			q.getColumn(e)?.toggleVisibility(t);
		},
		moveColumn: (e, t) => {
			let n = q.getState().columnOrder, r = q.getAllLeafColumns().map((e) => e.id), i = n.length ? [...n] : [...r], a = i.indexOf(e);
			a !== -1 && (i.splice(a, 1), i.splice(t, 0, e), q.setColumnOrder(i));
		},
		setColumnPinned: (e, t) => {
			q.getColumn(e)?.pin(t);
		},
		setSortModel: (e) => K.setSorting(s(e)),
		getSortModel: () => a(K.sorting),
		setFilterModel: (e) => K.setColumnFilters(r(e)),
		getFilterModel: () => i(K.columnFilters),
		setQuickFilter: (e) => ye(e),
		selectAll: () => q.toggleAllRowsSelected(!0),
		deselectAll: () => q.toggleAllRowsSelected(!1),
		startEditingCell: () => {},
		stopEditing: () => {},
		exportCsv: (e) => Hn(q, e),
		exportExcel: async (e) => {
			let { exportToExcel: t } = await Promise.resolve().then(() => ur);
			t(q, e);
		},
		exportImage: async (e) => {
			let { exportToImage: t } = await Promise.resolve().then(() => fr);
			t(ke.current, e);
		},
		exportPdf: async (e) => {
			let { exportToPdf: t } = await Promise.resolve().then(() => Gn);
			t(q, e);
		},
		getState: () => ({
			columnOrder: q.getState().columnOrder,
			columnSizing: q.getState().columnSizing,
			columnVisibility: q.getState().columnVisibility,
			sorting: a(K.sorting),
			columnFilters: i(K.columnFilters),
			grouping: K.grouping,
			expanded: typeof K.expanded == "boolean" ? {} : K.expanded,
			pageSize: q.getState().pagination.pageSize,
			columnPinning: q.getState().columnPinning
		}),
		applyState: (e) => {
			e.columnOrder && K.setColumnOrder(e.columnOrder), e.columnSizing && K.setColumnSizing(e.columnSizing), e.columnVisibility && K.setColumnVisibility(e.columnVisibility), e.sorting && K.setSorting(s(e.sorting)), e.columnFilters && K.setColumnFilters(r(e.columnFilters)), e.grouping && K.setGrouping(e.grouping), e.expanded && K.setExpanded(e.expanded), e.columnPinning && K.setColumnPinning(e.columnPinning), e.pageSize && q.setPageSize(e.pageSize);
		},
		resetState: Oe,
		refreshCells: () => {},
		ensureRowVisible: (e) => {
			ke.current?.querySelector(`[data-row-index="${e}"]`)?.scrollIntoView({ block: "nearest" });
		}
	}), [
		q,
		K.sorting,
		K.columnFilters,
		K.grouping,
		K.expanded,
		Oe,
		ye
	]);
	h(t, () => Z, [Z]);
	let Qe = _(Z);
	Qe.current = Z;
	let $e = g(() => new Proxy({}, { get: (e, t) => Qe.current[t] }), []);
	m(() => {
		se?.({ api: $e }), Ie.current = !0;
	}, []), m(() => {
		Ie.current && fe?.({ sortModel: a(K.sorting) });
	}, [K.sorting]), m(() => {
		Ie.current && pe?.({ filterModel: i(K.columnFilters) });
	}, [K.columnFilters]), m(() => {
		Ie.current && de?.({
			selectedRows: q.getSelectedRowModel().rows.map((e) => e.original),
			selectedRowIds: Object.keys(K.rowSelectionState)
		});
	}, [K.rowSelectionState]);
	let et = p((e, t) => {
		let n = e.column.columnDef.meta;
		ce?.({
			data: e.row.original,
			value: e.getValue(),
			colDef: n?.colDef || {},
			rowIndex: e.row.index,
			event: t
		});
	}, [ce]), tt = p((e, t) => {
		let n = e.column.columnDef.meta;
		le?.({
			data: e.row.original,
			value: e.getValue(),
			colDef: n?.colDef || {},
			rowIndex: e.row.index,
			event: t
		});
	}, [le]), nt = p((e, t, n) => {
		let r = e.column.columnDef.meta;
		ue?.({
			data: e.row.original,
			colDef: r?.colDef || {},
			oldValue: t,
			newValue: n,
			rowIndex: e.row.index
		});
	}, [ue]), rt = p((e) => Fe(e), []), it = p((e) => {
		if (!(e.ctrlKey || e.metaKey) || e.key !== "c" || window.getSelection()?.toString()) return;
		let t = q.getSelectedRowModel().rows;
		if (t.length > 0) {
			let n = q.getVisibleLeafColumns().filter((e) => !e.columnDef.meta?.isSelectColumn), r = n.map((e) => o(e)), i = t.map((e) => n.map((t) => {
				let n = e.getValue(t.id);
				return n == null ? "" : Array.isArray(n) ? n.join(", ") : String(n);
			}).join("	"));
			navigator.clipboard?.writeText([r.join("	"), ...i].join("\n")), e.preventDefault();
			return;
		}
		let n = document.activeElement;
		n?.classList.contains("jt-cell") && (navigator.clipboard?.writeText((n.textContent || "").trim()), e.preventDefault());
	}, [q]), at = typeof U == "number" ? `${U}px` : U, ot = Object.keys(K.rowSelectionState).length > 0;
	return /* @__PURE__ */ x("div", {
		ref: ke,
		className: w("jt-datagrid", "flex flex-col overflow-hidden", Xe && "dark", te),
		style: {
			height: at,
			...Ye
		},
		"data-look": J.look,
		"data-accent": J.accent,
		"data-anyselected": ot,
		onKeyDown: it,
		children: [
			Object.keys(Ze).length > 0 && /* @__PURE__ */ b(Bt, {
				table: q,
				config: Ze,
				globalFilter: ve,
				onGlobalFilterChange: ye,
				density: Se,
				onDensityChange: Ce,
				onResetState: Oe,
				onToggleColumnManager: () => je(!Ae),
				onExportCsv: () => Z.exportCsv(),
				onExportExcel: () => Z.exportExcel(),
				onExportImage: () => Z.exportImage(),
				view: Me,
				onViewChange: Ne,
				appearance: J,
				onAppearanceChange: qe,
				onExportPdf: () => Z.exportPdf(),
				onExportEmail: () => We("email"),
				onExportSchedule: () => We("schedule"),
				onRefresh: R,
				onToggleStylePanel: () => Ve(!0),
				showFloatingFilters: T && X,
				onToggleFloatingFilters: T ? () => He((e) => !e) : void 0
			}),
			S && Me === "grid" && /* @__PURE__ */ b(ln, {
				table: q,
				grouping: be,
				onGroupingChange: xe
			}),
			Me === "charts" ? /* @__PURE__ */ b(Nn, {
				table: q,
				charts: ze,
				onChartsChange: Be
			}) : /* @__PURE__ */ b("div", {
				className: "flex-1 overflow-auto",
				children: /* @__PURE__ */ x("table", {
					className: "jt-table w-full border-collapse text-grid-base",
					children: [
						/* @__PURE__ */ b(tn, {
							table: q,
							columnAlignment: we,
							onHeaderContextMenu: (e, t, n) => Ke({
								columnId: e,
								x: t,
								y: n
							})
						}),
						T && X && /* @__PURE__ */ b(on, { table: q }),
						/* @__PURE__ */ b(an, {
							table: q,
							columnAlignment: we,
							columnDecimals: Ee,
							rowColorRules: F,
							noRowsComponent: ae,
							noRowsMessage: oe,
							onCellClick: et,
							onCellDoubleClick: tt,
							onCellValueChanged: nt,
							onExpandRecord: I && d !== !1 ? rt : void 0
						}),
						L && /* @__PURE__ */ b(Fn, {
							table: q,
							config: typeof L == "object" ? L : {},
							columnAlignment: we,
							columnDecimals: Ee
						})
					]
				})
			}),
			/* @__PURE__ */ b(ar, {
				loading: W,
				loadingComponent: G
			}),
			f && Me === "grid" && /* @__PURE__ */ b(rr, {
				table: q,
				pageSizeOptions: y
			}),
			E && /* @__PURE__ */ b(ir, { table: q }),
			/* @__PURE__ */ b(fn, {
				table: q,
				isOpen: Ae,
				onClose: () => je(!1),
				columnAlignment: we,
				onColumnAlignmentChange: (e, t) => Te((n) => ({
					...n,
					[e]: t
				})),
				columnDecimals: Ee,
				onColumnDecimalsChange: (e, t) => De((n) => ({
					...n,
					[e]: t
				}))
			}),
			/* @__PURE__ */ b(Pn, {
				table: q,
				rowId: Pe,
				onClose: () => Fe(null),
				onNavigate: Fe
			}),
			/* @__PURE__ */ b(Vn, {
				isOpen: Y,
				onClose: () => Ve(!1),
				styles: ge,
				onStylesChange: _e,
				showSelectionToggle: d !== !1
			}),
			/* @__PURE__ */ b(er, {
				isOpen: Ue !== null,
				initialTab: Ue ?? "email",
				onClose: () => We(null),
				table: q,
				emailEndpoint: ee,
				scheduleEndpoint: B,
				fetchHeaders: V
			}),
			/* @__PURE__ */ b(tr, {
				column: Ge ? q.getColumn(Ge.columnId) ?? null : null,
				position: Ge,
				onClose: () => Ke(null),
				themeStyle: Ye
			})
		]
	});
}
var lr = f(cr), ur = /* @__PURE__ */ t({ exportToExcel: () => dr });
async function dr(t, n) {
	let { fileName: r = "export.xlsx", sheetName: i = "Sheet1", includeHeaders: a = !0, onlySelected: s = !1, columnIds: c } = n || {}, u = new (await (import("./exceljs.min-wg-KMLw5.js").then((t) => /* @__PURE__ */ e(t.default, 1)))).Workbook(), d = u.addWorksheet(i), f = t.getAllLeafColumns().filter((e) => !(!e.getIsVisible() || c && !c.includes(e.id))), p = f.map(() => 0);
	if (a) {
		let e = f.map((e) => o(e)), t = d.addRow(e);
		t.font = { bold: !0 }, t.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFE5E7EB" }
		}, t.border = { bottom: {
			style: "thin",
			color: { argb: "FFD1D5DB" }
		} }, e.forEach((e, t) => {
			p[t] = e.length;
		});
	}
	let m = s ? t.getSelectedRowModel().rows : t.getFilteredRowModel().rows;
	for (let e of m) {
		if (e.getIsGrouped()) continue;
		let t = f.map((t, n) => {
			let r = e.getValue(t.id) ?? "", i = String(r).length;
			return i > (p[n] ?? 0) && (p[n] = i), r;
		});
		d.addRow(t);
	}
	f.forEach((e, t) => {
		d.getColumn(t + 1).width = Math.min((p[t] ?? 0) + 4, 50);
	});
	let h = await u.xlsx.writeBuffer();
	l(new Blob([h], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), r);
}
//#endregion
//#region src/export/psdExport.ts
var fr = /* @__PURE__ */ t({ exportToImage: () => pr });
async function pr(t, n) {
	let { fileName: r = "export.png", format: i = "png", quality: a = 1 } = n || {}, o = (await import("./html2canvas-DECPJJGt.js").then((t) => /* @__PURE__ */ e(t.default, 1))).default, s = await o(t, {
		scale: 2,
		useCORS: !0,
		backgroundColor: "#ffffff"
	}), l = i === "jpeg" ? "image/jpeg" : "image/png";
	c(s.toDataURL(l, a), r);
}
//#endregion
//#region src/export/emailExport.ts
async function mr(e, t) {
	let { to: n, subject: r = "Grid Report", body: i = "", endpoint: a } = t, o = Un(e), s = new Blob([o], { type: "text/csv" }), c = new FormData();
	c.append("to", JSON.stringify(n)), c.append("subject", r), c.append("body", i), c.append("file", s, "report.csv");
	let l = await fetch(a, {
		method: "POST",
		body: c
	});
	if (!l.ok) throw Error(`Email export failed: ${l.statusText}`);
}
//#endregion
//#region src/export/scheduleExport.ts
async function hr(e) {
	let { endpoint: t, ...n } = e, r = await fetch(t, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			action: "schedule",
			...n
		})
	});
	if (!r.ok) throw Error(`Schedule export failed: ${r.statusText}`);
}
//#endregion
export { Nt as ACCENTS, lr as DataGrid, Ht as FieldTypeIcon, Mt as LOOKS, kt as LOOK_PRESETS, Qt as Sparkline, Q as TypeaheadSelect, pn as aggregate, hn as buildChartData, mr as emailExport, Hn as exportToCsv, dr as exportToExcel, pr as exportToImage, Jn as exportToPdf, Xn as generateHtmlTable, Yn as generatePdfBase64, It as resolveAppearance, hr as scheduleExport };
