const x = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), L = (t, e) => {
  const n = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(c) {
      var o, i;
      return c.getAttribute("ref") == e || c.dataset.ref == e || c.getAttributeNames().some((f) => f.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = c.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") || (i = c.dataset.ref) != null && i.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  ), r = [];
  let s;
  for (; s = n.nextNode(); )
    r.push(s);
  return r;
}, a = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let h = null, d = /* @__PURE__ */ new WeakMap();
class W {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let p = (t) => {
  h = new W(t), h.cb();
  let e = h;
  return h = null, e;
}, _ = (t, e) => {
  if (h === null)
    return;
  let n = ((r, s, c) => {
    let o;
    return r.has(s) && r.get(s).has(c) ? o = r.get(s).get(c) : r.has(s) && !r.get(s).has(c) ? r.get(s).set(c, o = /* @__PURE__ */ new Set()) : r.set(s, /* @__PURE__ */ new Map([[c, o = /* @__PURE__ */ new Set()]])), o;
  })(d, t, e);
  h._set.add(n), n.add(h);
}, m = (t) => {
  let e = ((n) => {
    if (Array.isArray(n) || typeof n != "function" && typeof n != "object")
      return { val: n };
    if (typeof n == "function") {
      let r = m(1);
      return p(() => r.val = n()), r;
    }
    return Object.fromEntries(Object.entries(n).map(([r, s]) => [r, typeof s == "object" || typeof s == "function" ? m(s) : s]));
  })(t);
  return new Proxy(e, { get: (n, r, s) => (_(n, r), Reflect.get(n, r, s)), set: (n, r, s, c) => (n[r] !== s && (Reflect.set(n, r, s, c), ((o, i) => {
    d.get(o) && d.get(o).get(i).forEach(({ cb: f }) => f());
  })(n, r)), !0) });
};
const F = {
  selector: "rv-class",
  construct: function({ element: t }, e) {
    return Object.entries(e).reduce((r, [s, c]) => {
      let o = p(() => {
        !t.classList.contains(s) && a(c, t) && t.classList.add(s), t.classList.contains(s) && !a(c, t) && t.classList.remove(s);
      });
      return r.push(o), r;
    }, []);
  }
}, y = /* @__PURE__ */ new WeakMap(), v = (t, e) => {
  let { isArray: n } = Array, r = y.get(t);
  r ? y.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : y.set(t, [e]);
}, N = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), y.delete(t), t == null || t.remove();
}, P = (t, e, n) => {
  let r = p(
    () => t.setAttribute(e, a(n, t))
  );
  v(t, r);
};
class T extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const j = (t, e) => {
  var n;
  return (n = t.getAttributeNames()) == null ? void 0 : n.reduce((r, s) => (s.startsWith(":") && s !== ":" && (r[s.replaceAll(":", "")] = e[t.getAttribute(s)] ?? t.getAttribute(s)) && t.removeAttribute(s), s === ":" && (r[t.tagName.toLowerCase()] = e[t.getAttribute(s)]) && t.removeAttribute(s), r), {});
}, g = (t, e = []) => {
  t.$ = C(t), t.mount = function(n) {
    n(t);
  }, t.setProps = function(n) {
    E({ element: t, ctx: n }), e.length && w(t, e);
  };
}, C = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = x(r, s);
      const i = [...L(t, n)];
      let f = n === "createScope" ? c : null;
      return f && i.push(t), i.forEach((l) => {
        f && (c = j(l, f));
        const u = { element: l, ctx: c };
        E(u), w(l, o), g(l, c), u.element.init && typeof u.element.init == "function" && u.element.init();
      }), i.length === 1 ? i[0] : new T(...i);
    }
  }
), K = C(), I = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((i) => o.dataset.key == i[s])
  ).forEach((o) => {
    N(
      e.querySelector(`[data-key="${o.dataset.key}"]`)
    );
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c, o));
    const i = c[s] == r[o].dataset.key, f = t.length === r.length, l = `[data-key="${c[s]}"]`;
    if (!i && f) {
      const u = e.querySelector(l) ?? n(c, o);
      e.replaceChild(u, r[o]);
    }
    if (!i && !f) {
      const u = e.querySelector(l) ?? n(c, o);
      e.insertBefore(u, r[o]);
    }
  });
}, q = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return g(n), (s) => (e(s)(n), n);
}, D = {
  selector: "rv-for",
  construct: function({ element: t }, e) {
    var i;
    let [n, r, s] = e, c;
    (i = t.dataset) != null && i.populate && (n.val = JSON.parse(t.dataset.populate), t.removeAttribute("data-populate"), c = q(t, r));
    const o = m(() => s ? n.val.map(s) : n.val);
    return c && o.val.forEach((f, l) => {
      const u = t.children[l];
      g(u), r(f, l)(u);
    }), p(() => {
      I(o.val, t, c ?? r);
    });
  }
}, O = {
  selector: "rv-if",
  construct: function(t, e) {
    let n = new Comment("rv-if");
    return p(() => {
      !a(e, t.element) && !t.element.parentElement && (t.replaceWith = n), n.parentElement && a(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.parentElement && !a(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, A = {
  INPUT: {
    checkbox: "checked"
  }
}, U = {
  selector: "rv-model",
  construct: function({ element: t }, e) {
    let n = A[t.tagName] ?? "value";
    return t instanceof HTMLInputElement && (n = A.INPUT[t.type] ?? "value"), t.addEventListener("input", () => {
      e.val = t[n];
    }), p(() => {
      t[n] = e.val;
    });
  }
}, $ = {
  selector: "rv-show",
  construct: function({ element: t }, e) {
    return p(() => t.style.display = a(e, t) ? null : "none");
  }
}, S = {
  selector: "rv-text",
  construct: function(t, e) {
    var r;
    let n = null;
    return ((r = t.element.tagName) == null ? void 0 : r.toLowerCase()) === this.selector && (n = new Text(), t.element.replaceWith(n)), p(() => {
      t.element.textContent === a(e, t.element) || (n == null ? void 0 : n.textContent) === a(e, t.element) || t.element instanceof Comment || (n ? n.textContent = a(e, n) : t.element.textContent = a(
        e,
        t.element
      ));
    });
  }
}, B = [
  D,
  S,
  F,
  $,
  O,
  U
], R = Object.fromEntries(
  B.map((t) => [t.selector, t])
), z = (...t) => {
  t.forEach(
    (e) => R[e.selector] = e
  );
}, E = (t) => {
  for (const e in t.ctx) {
    let n = R[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let s = n.construct(t, t.ctx[e]);
      s && v(t.element, s);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || // This is because of the data-populate attribute for the rv-for directive.
    // Maybe not the best place ?
    typeof t.ctx[e] == "object") {
      P(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, w = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    typeof n == "function" && v(
      r,
      S.construct({ element: r }, n)
    ), t.appendChild(r);
  });
}, J = (t) => function(e, n = []) {
  let [r, s] = x(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(c), w(c.element, s), c.element.init && typeof c.element.init == "function" && c.element.init(), c.replaceWith ?? c.element;
}, G = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, J(e)), t[e];
    }
  }
);
export {
  K as $,
  G as h,
  p as hook,
  z as registerDirectives,
  N as safeRemove,
  m as stream
};
