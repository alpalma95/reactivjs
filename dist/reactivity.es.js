let u = null, h = /* @__PURE__ */ new WeakMap();
class L {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let a = (t) => {
  u = new L(t), u.cb();
  let e = u;
  return u = null, e;
}, A = (t, e) => {
  if (u === null)
    return;
  let n;
  h.has(t) ? n = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), u._set.add(n), n.add(u);
}, R = (t, e, n) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: s }) => s(n));
}, S = (t) => {
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
  let e = S(t);
  return new Proxy(e, {
    get(n, r, s) {
      return A(n, r), Reflect.get(n, r, s);
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
const p = /* @__PURE__ */ new WeakMap(), w = (t, e) => p.has(t) ? p.get(t).push(e) : p.set(t, [e]), T = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = p.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), p.delete(t), t == null || t.remove();
}, F = (t, e, n) => {
  let r = a(() => t.setAttribute(e, n(t)));
  w(t, r);
}, x = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), W = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(c) {
      var o;
      return c.getAttribute("ref") == e ? NodeFilter.FILTER_ACCEPT : (o = c.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  );
  let s;
  for (; s = r.nextNode(); )
    n.push(s);
  return n;
}, _ = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, s] of Object.entries(e)) {
      let c = a(() => {
        !t.classList.contains(r) && s(t) && t.classList.add(r), t.classList.contains(r) && !s(t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, P = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[s])
  ).forEach((o) => {
    T(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const f = c[s] == r[o].dataset.key, i = t.length === r.length, d = `[data-key="${c[s]}"]`;
    if (!f && i) {
      const y = e.querySelector(d) ?? n(c);
      e.replaceChild(y, r[o]);
    }
    if (!f && !i) {
      const y = e.querySelector(d) ?? n(c);
      e.insertBefore(y, r[o]);
    }
  });
}, j = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return a(() => {
      P(n.val, t, r);
    });
  }
}, q = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return a(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, v = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return a(() => t.style.display = e(t) ? null : "none");
  }
}, I = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return a(() => {
      t.textContent === e(t) || t instanceof Comment || (t.textContent = e(t));
    });
  }
}, g = [
  j,
  I,
  _,
  v,
  q
], D = Object.fromEntries(
  g.map((t) => [t.selector, t])
), H = (t) => {
  g.push(t);
}, l = (t) => {
  for (const e in t.ctx) {
    let n = D[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init") {
      t.ctx[e](t.element), t.element.init = t.ctx[e];
      continue;
    }
    if (e === "destroy") {
      t.element.destroy = t.ctx[e];
      continue;
    }
    if (n) {
      let s = n.construct(t, t.ctx[e]);
      w(t.element, s);
      continue;
    }
    if (!n && typeof t.ctx[e] == "function" && !r) {
      F(t.element, e, t.ctx[e]);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, E = (t, e) => {
  e.length && e.forEach((n) => {
    let r;
    n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? r = n : r = new Text(n), t.appendChild(r);
  });
}, N = (t) => function(e, n = []) {
  let [r, s] = x(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return l(c), E(c.element, s), c.replaceWith ?? c.element;
}, B = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, N(e)), t[e];
    }
  }
);
class $ extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const C = (t = document) => new Proxy({}, {
  get: (e, n) => function(r, s = []) {
    let [c, o] = x(r, s);
    const f = [...W(t, n)];
    return f.forEach((i) => {
      l({ element: i, ctx: c }), E(i, o), i.$ = C(i), i.mount = function(d) {
        d(i);
      }, i.props = function(d) {
        l({ element: i, ctx: d }), E(i, o);
      };
    }), f.length === 1 ? f[0] : new $(...f);
  }
}), M = C();
export {
  M as $,
  B as h,
  a as hook,
  H as registerDirective,
  T as safeRemove,
  m as stream
};
