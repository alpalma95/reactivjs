const A = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), R = (t, e) => {
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
}, u = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let h = null, y = /* @__PURE__ */ new WeakMap();
class L {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let l = (t) => {
  h = new L(t), h.cb();
  let e = h;
  return h = null, e;
}, W = (t, e) => {
  if (h === null)
    return;
  let n = ((r, s, c) => {
    let o;
    return r.has(s) && r.get(s).has(c) ? o = r.get(s).get(c) : r.has(s) && !r.get(s).has(c) ? r.get(s).set(c, o = /* @__PURE__ */ new Set()) : r.set(s, /* @__PURE__ */ new Map([[c, o = /* @__PURE__ */ new Set()]])), o;
  })(y, t, e);
  h._set.add(n), n.add(h);
}, E = (t) => {
  let e = ((n) => {
    if (Array.isArray(n) || typeof n != "function" && typeof n != "object")
      return { val: n };
    if (typeof n == "function") {
      let r = E(1);
      return l(() => r.val = n()), r;
    }
    return Object.fromEntries(Object.entries(n).map(([r, s]) => [r, typeof s == "object" || typeof s == "function" ? E(s) : s]));
  })(t);
  return new Proxy(e, { get: (n, r, s) => (W(n, r), Reflect.get(n, r, s)), set: (n, r, s, c) => (n[r] !== s && (Reflect.set(n, r, s, c), ((o, i) => {
    y.get(o) && y.get(o).get(i).forEach(({ cb: f }) => f());
  })(n, r)), !0) });
};
const F = {
  selector: "rv-class",
  construct: function({ element: t }, e) {
    return Object.entries(e).reduce((r, [s, c]) => {
      let o = l(() => {
        !t.classList.contains(s) && u(c, t) && t.classList.add(s), t.classList.contains(s) && !u(c, t) && t.classList.remove(s);
      });
      return r.push(o), r;
    }, []);
  }
}, p = /* @__PURE__ */ new WeakMap(), g = (t, e) => {
  let { isArray: n } = Array, r = p.get(t);
  r ? p.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : p.set(t, [e]);
}, _ = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = p.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), p.delete(t), t == null || t.remove();
}, P = (t, e, n) => {
  let r = l(
    () => t.setAttribute(e, u(n, t))
  );
  g(t, r);
};
class j extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const N = (t, e) => {
  var n;
  return (n = t.getAttributeNames()) == null ? void 0 : n.reduce((r, s) => (s.startsWith(":") && s !== ":" && (r[s.replaceAll(":", "")] = e[t.getAttribute(s)] ?? t.getAttribute(s)) && t.removeAttribute(s), s === ":" && (r[t.tagName.toLowerCase()] = e[t.getAttribute(s)]) && t.removeAttribute(s), r), {});
}, m = (t, e = []) => {
  t.$ = x(t), t.mount = function(n) {
    n(t);
  }, t.setProps = function(n) {
    v({ element: t, ctx: n }), e.length && w(t, e);
  };
}, x = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = A(r, s);
      const i = [...R(t, n)];
      let f = n === "createScope" ? c : null;
      return f && i.push(t), i.forEach((a, d) => {
        f && (c = N(a, f)), v({ element: a, ctx: c }), w(a, o), m(a, c);
      }), i.length === 1 ? i[0] : new j(...i);
    }
  }
), U = x(), q = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((i) => o.dataset.key == i[s])
  ).forEach((o) => {
    _(
      e.querySelector(`[data-key="${o.dataset.key}"]`)
    );
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const i = c[s] == r[o].dataset.key, f = t.length === r.length, a = `[data-key="${c[s]}"]`;
    if (!i && f) {
      const d = e.querySelector(a) ?? n(c);
      e.replaceChild(d, r[o]);
    }
    if (!i && !f) {
      const d = e.querySelector(a) ?? n(c);
      e.insertBefore(d, r[o]);
    }
  });
}, T = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return m(n), (s) => (e(s)(n), n);
}, D = {
  selector: "rv-for",
  construct: function({ element: t }, e) {
    var o;
    let [n, r, s] = e, c;
    if ((o = t.dataset) != null && o.populate) {
      const i = JSON.parse(t.dataset.populate);
      n.val = s ? i.map(s) : i, t.removeAttribute("data-populate"), c = T(t, r);
    }
    return c && n.val.forEach((i, f) => {
      const a = t.children[f];
      m(a), r(i)(a);
    }), l(() => {
      q(n.val, t, c ?? r);
    });
  }
}, O = {
  selector: "rv-if",
  construct: function(t, e) {
    let n = new Comment("rv-if");
    return l(() => {
      !u(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && u(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !u(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, I = {
  selector: "rv-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), l(() => {
      t.value = e.val;
    });
  }
}, $ = {
  selector: "rv-show",
  construct: function({ element: t }, e) {
    return l(() => t.style.display = u(e, t) ? null : "none");
  }
}, C = {
  selector: "rv-text",
  construct: function(t, e) {
    var r;
    let n = null;
    return ((r = t.element.tagName) == null ? void 0 : r.toLowerCase()) === this.selector && (n = new Text(), t.element.replaceWith(n)), l(() => {
      t.element.textContent === u(e, t.element) || (n == null ? void 0 : n.textContent) === u(e, t.element) || t.element instanceof Comment || (n ? n.textContent = u(e, n) : t.element.textContent = u(
        e,
        t.element
      ));
    });
  }
}, B = [
  D,
  C,
  F,
  $,
  O,
  I
], S = Object.fromEntries(
  B.map((t) => [t.selector, t])
), K = (...t) => {
  t.forEach(
    (e) => S[e.selector] = e
  );
}, v = (t) => {
  for (const e in t.ctx) {
    let n = S[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let s = n.construct(t, t.ctx[e]);
      s && g(t.element, s);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      P(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, w = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    typeof n == "function" && g(
      r,
      C.construct({ element: r }, n)
    ), t.appendChild(r);
  });
}, J = (t) => function(e, n = []) {
  let [r, s] = A(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return v(c), w(c.element, s), c.replaceWith ?? c.element;
}, z = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, J(e)), t[e];
    }
  }
);
export {
  U as $,
  z as h,
  l as hook,
  K as registerDirectives,
  _ as safeRemove,
  E as stream
};
