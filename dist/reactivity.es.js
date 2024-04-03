let d = null, p = /* @__PURE__ */ new WeakMap();
class S {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let u = (t) => {
  d = new S(t), d.cb();
  let e = d;
  return d = null, e;
}, v = (t, e) => {
  if (d === null)
    return;
  let n;
  p.has(t) ? n = p.get(t).get(e) : p.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), d._set.add(n), n.add(d);
}, R = (t, e, n) => {
  if (!p.get(t))
    return;
  p.get(t).get(e).forEach(({ cb: s }) => s(n));
}, W = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = w(1);
    return u(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? w(n) : n
      ])
    );
}, w = (t) => {
  let e = W(t);
  return new Proxy(e, {
    get(n, r, s) {
      return v(n, r), Reflect.get(n, r, s);
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
const l = /* @__PURE__ */ new WeakMap(), A = (t, e) => l.has(t) ? l.get(t).push(e) : l.set(t, [e]), T = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = l.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), l.delete(t), t == null || t.remove();
}, F = (t, e, n) => {
  let r = u(() => t.setAttribute(e, n(t)));
  A(t, r);
}, x = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), P = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(c) {
      var o;
      return c.getAttribute("ref") == e || c.getAttributeNames().includes("ref") && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = c.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
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
      let c = u(() => {
        !t.classList.contains(r) && s(t) && t.classList.add(r), t.classList.contains(r) && !s(t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, j = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[s])
  ).forEach((o) => {
    T(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const f = c[s] == r[o].dataset.key, h = t.length === r.length, i = `[data-key="${c[s]}"]`;
    if (!f && h) {
      const a = e.querySelector(i) ?? n(c);
      e.replaceChild(a, r[o]);
    }
    if (!f && !h) {
      const a = e.querySelector(i) ?? n(c);
      e.insertBefore(a, r[o]);
    }
  });
}, N = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return u(() => {
      j(n.val, t, r);
    });
  }
}, q = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return u(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, D = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), u(() => {
      t.value = e.val;
    });
  }
}, I = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return u(() => t.style.display = e(t) ? null : "none");
  }
}, $ = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return u(() => {
      t.textContent === e(t) || t instanceof Comment || (t.textContent = e(t));
    });
  }
}, m = [
  N,
  $,
  _,
  I,
  q,
  D
], C = Object.fromEntries(
  m.map((t) => [t.selector, t])
), O = (t) => {
  m.push(t);
}, E = (t) => {
  for (const e in t.ctx) {
    let n = C[e];
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
      A(t.element, s);
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
}, g = (t, e) => {
  e.length && e.forEach((n) => {
    let r;
    n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? r = n : r = new Text(n), t.appendChild(r);
  });
}, B = (t) => function(e, n = []) {
  let [r, s] = x(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(c), g(c.element, s), c.replaceWith ?? c.element;
}, J = new Proxy(
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
const y = (t, e, n) => n[t.getAttribute(e)], M = (t, e) => {
  const n = t.getAttributeNames();
  let r = {};
  return n.forEach((s) => {
    s.startsWith("on:") && (r[s.replaceAll(":", "")] = y(
      t,
      s,
      e
    )) && t.removeAttribute(s), s.startsWith(":") && (r[s.replaceAll(":", "")] = y(
      t,
      s,
      e
    )) && t.removeAttribute(s), C.hasOwnProperty(s) && (r[s] = y(t, s, e)) && t.removeAttribute(s);
  }), r;
}, L = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = x(r, s);
      const f = [...P(t, n)];
      let h = n === "createScope" ? c : null;
      return f.forEach((i) => {
        h && (c = M(i, h)), E({ element: i, ctx: c }), g(i, o), i.$ = L(i), i.mount = function(a) {
          a(i);
        }, i.props = function(a) {
          E({ element: i, ctx: a }), g(i, o);
        };
      }), f.length === 1 ? f[0] : new H(...f);
    }
  }
), K = L();
export {
  K as $,
  J as h,
  u as hook,
  O as registerDirective,
  T as safeRemove,
  w as stream
};
