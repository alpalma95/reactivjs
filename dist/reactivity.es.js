const w = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), g = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(c) {
      var o;
      return c.getAttribute("ref") == e || c.getAttributeNames().some((i) => i.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = c.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  );
  let s;
  for (; s = r.nextNode(); )
    n.push(s);
  return n;
}, p = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let l = null, h = /* @__PURE__ */ new WeakMap();
class v {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let u = (t) => {
  l = new v(t), l.cb();
  let e = l;
  return l = null, e;
}, S = (t, e) => {
  if (l === null)
    return;
  let n;
  h.has(t) ? n = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), l._set.add(n), n.add(l);
}, R = (t, e, n) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: s }) => s(n));
}, T = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = x(1);
    return u(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? x(n) : n
      ])
    );
}, x = (t) => {
  let e = T(t);
  return new Proxy(e, {
    get(n, r, s) {
      return S(n, r), Reflect.get(n, r, s);
    },
    set(n, r, s, c) {
      if (n[r] !== s) {
        let o = n[r];
        Reflect.set(n, r, s, c), R(n, r, o);
      }
      return !0;
    }
  });
};
const W = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, s] of Object.entries(e)) {
      let c = u(() => {
        !t.classList.contains(r) && p(s, t) && t.classList.add(r), t.classList.contains(r) && !p(s, t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, y = /* @__PURE__ */ new WeakMap(), A = (t, e) => {
  let { isArray: n } = Array, r = y.get(t);
  r ? y.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : y.set(t, [e]);
}, F = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), y.delete(t), t == null || t.remove();
}, _ = (t, e, n) => {
  let r = u(() => t.setAttribute(e, n(t)));
  A(t, r);
}, P = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((i) => o.dataset.key == i[s])
  ).forEach((o) => {
    F(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const i = c[s] == r[o].dataset.key, d = t.length === r.length, f = `[data-key="${c[s]}"]`;
    if (!i && d) {
      const a = e.querySelector(f) ?? n(c);
      e.replaceChild(a, r[o]);
    }
    if (!i && !d) {
      const a = e.querySelector(f) ?? n(c);
      e.insertBefore(a, r[o]);
    }
  });
}, j = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return u(() => {
      P(n.val, t, r);
    });
  }
}, N = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return u(() => {
      !p(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && p(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !p(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, q = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), u(() => {
      t.value = e.val;
    });
  }
}, D = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return u(() => t.style.display = p(e, t) ? null : "none");
  }
}, I = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return u(() => {
      let n = typeof e == "function" ? e(t) : (e == null ? void 0 : e.val) ?? e;
      t.textContent === n || t instanceof Comment || (t.textContent = n);
    });
  }
}, C = [
  j,
  I,
  W,
  D,
  N,
  q
], $ = Object.fromEntries(
  C.map((t) => [t.selector, t])
), J = (t) => {
  C.push(t);
}, E = (t) => {
  for (const e in t.ctx) {
    let n = $[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let s = n.construct(t, t.ctx[e]);
      A(t.element, s);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function") {
      _(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, m = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, H = (t) => function(e, n = []) {
  let [r, s] = w(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(c), m(c.element, s), c.replaceWith ?? c.element;
}, K = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, H(e)), t[e];
    }
  }
);
class B extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const M = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((s) => {
    s.startsWith(":") && (n[s.replaceAll(":", "")] = e[t.getAttribute(s)]) && t.removeAttribute(s);
  }), n;
}, L = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = w(r, s);
      const i = [...g(t, n)];
      let d = n === "createScope" ? c : null;
      return i.forEach((f) => {
        d && (c = M(f, d)), E({ element: f, ctx: c }), m(f, o), f.$ = L(f), f.mount = function(a) {
          a(f);
        }, f.props = function(a) {
          E({ element: f, ctx: a }), m(f, o);
        };
      }), i.length === 1 ? i[0] : new B(...i);
    }
  }
), O = L();
export {
  O as $,
  K as h,
  u as hook,
  J as registerDirective,
  F as safeRemove,
  x as stream
};
