let a = null, h = /* @__PURE__ */ new WeakMap();
class L {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let u = (t) => {
  a = new L(t), a.cb();
  let e = a;
  return a = null, e;
}, A = (t, e) => {
  if (a === null)
    return;
  let n;
  h.has(t) ? n = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), a._set.add(n), n.add(a);
}, R = (t, e, n) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: s }) => s(n));
}, v = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = m(1);
    return u(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? m(n) : n
      ])
    );
}, m = (t) => {
  let e = v(t);
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
const p = /* @__PURE__ */ new WeakMap(), w = (t, e) => p.has(t) ? p.get(t).push(e) : p.set(t, [e]), S = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = p.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), p.delete(t), t == null || t.remove();
}, T = (t, e, n) => {
  let r = u(() => t.setAttribute(e, n(t)));
  w(t, r);
}, x = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), F = (t, e) => {
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
}, W = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, s] of Object.entries(e)) {
      let c = u(() => {
        !t.classList.contains(r) && s(t) && t.classList.add(r), t.classList.contains(r) && !s(t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, _ = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[s])
  ).forEach((o) => {
    S(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const f = c[s] == r[o].dataset.key, i = t.length === r.length, d = `[data-key="${c[s]}"]`;
    if (!f && i) {
      const l = e.querySelector(d) ?? n(c);
      e.replaceChild(l, r[o]);
    }
    if (!f && !i) {
      const l = e.querySelector(d) ?? n(c);
      e.insertBefore(l, r[o]);
    }
  });
}, P = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return u(() => {
      _(n.val, t, r);
    });
  }
}, j = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return u(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
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
    return u(() => t.style.display = e(t) ? null : "none");
  }
}, I = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return u(() => {
      t.textContent === e(t) || t instanceof Comment || (t.textContent = e(t));
    });
  }
}, g = [
  P,
  I,
  W,
  D,
  j,
  q
], N = Object.fromEntries(
  g.map((t) => [t.selector, t])
), B = (t) => {
  g.push(t);
}, y = (t) => {
  for (const e in t.ctx) {
    let n = N[e];
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
      T(t.element, e, t.ctx[e]);
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
}, $ = (t) => function(e, n = []) {
  let [r, s] = x(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return y(c), E(c.element, s), c.replaceWith ?? c.element;
}, M = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, $(e)), t[e];
    }
  }
);
class H extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const C = (t = document) => new Proxy({}, {
  get: (e, n) => function(r, s = []) {
    let [c, o] = x(r, s);
    const f = [...F(t, n)];
    return f.forEach((i) => {
      y({ element: i, ctx: c }), E(i, o), i.$ = C(i), i.mount = function(d) {
        d(i);
      }, i.props = function(d) {
        y({ element: i, ctx: d }), E(i, o);
      };
    }), f.length === 1 ? f[0] : new H(...f);
  }
}), J = C();
export {
  J as $,
  M as h,
  u as hook,
  B as registerDirective,
  S as safeRemove,
  m as stream
};
