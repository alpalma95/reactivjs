const w = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), L = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(c) {
      var o;
      return c.getAttribute("ref") == e || c.getAttributeNames().some((f) => f.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = c.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  );
  let s;
  for (; s = r.nextNode(); )
    n.push(s);
  return n;
}, u = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let p = null, l = /* @__PURE__ */ new WeakMap();
class S {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let a = (t) => {
  p = new S(t), p.cb();
  let e = p;
  return p = null, e;
}, R = (t, e) => {
  if (p === null)
    return;
  let n;
  l.has(t) ? n = l.get(t).get(e) : l.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), p._set.add(n), n.add(p);
}, v = (t, e, n) => {
  if (!l.get(t))
    return;
  l.get(t).get(e).forEach(({ cb: s }) => s(n));
}, T = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = m(1);
    return a(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? m(n) : n
      ])
    );
}, m = (t) => {
  let e = T(t);
  return new Proxy(e, {
    get(n, r, s) {
      return R(n, r), Reflect.get(n, r, s);
    },
    set(n, r, s, c) {
      if (n[r] !== s) {
        let o = n[r];
        Reflect.set(n, r, s, c), v(n, r, o);
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
      let c = a(() => {
        !t.classList.contains(r) && u(s, t) && t.classList.add(r), t.classList.contains(r) && !u(s, t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, y = /* @__PURE__ */ new WeakMap(), g = (t, e) => {
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
  let r = a(
    () => t.setAttribute(e, u(n, t))
  );
  g(t, r);
}, j = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[s])
  ).forEach((o) => {
    F(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const f = c[s] == r[o].dataset.key, h = t.length === r.length, i = `[data-key="${c[s]}"]`;
    if (!f && h) {
      const d = e.querySelector(i) ?? n(c);
      e.replaceChild(d, r[o]);
    }
    if (!f && !h) {
      const d = e.querySelector(i) ?? n(c);
      e.insertBefore(d, r[o]);
    }
  });
}, P = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return a(() => {
      j(n.val, t, r);
    });
  }
}, N = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return a(() => {
      !u(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && u(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !u(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, q = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), a(() => {
      t.value = e.val;
    });
  }
}, D = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return a(() => t.style.display = u(e, t) ? null : "none");
  }
}, I = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return a(() => {
      t.textContent === u(e, t) || t instanceof Comment || (t.textContent = u(e, t));
    });
  }
}, A = [
  P,
  I,
  W,
  D,
  N,
  q
], $ = Object.fromEntries(
  A.map((t) => [t.selector, t])
), J = (t) => {
  A.push(t);
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
      g(t.element, s);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      _(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, x = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, B = (t) => function(e, n = []) {
  let [r, s] = w(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(c), x(c.element, s), c.replaceWith ?? c.element;
}, K = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, B(e)), t[e];
    }
  }
);
class H extends Array {
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
}, C = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = w(r, s);
      const f = [...L(t, n)];
      let h = n === "createScope" ? c : null;
      return f.forEach((i) => {
        h && (c = M(i, h)), E({ element: i, ctx: c }), x(i, o), i.$ = C(i), i.mount = function(d) {
          d(i);
        }, i.props = function(d) {
          E({ element: i, ctx: d }), x(i, o);
        };
      }), f.length === 1 ? f[0] : new H(...f);
    }
  }
), O = C();
export {
  O as $,
  K as h,
  a as hook,
  J as registerDirective,
  F as safeRemove,
  m as stream
};
