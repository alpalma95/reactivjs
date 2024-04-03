let d = null, p = /* @__PURE__ */ new WeakMap();
class g {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let u = (t) => {
  d = new g(t), d.cb();
  let e = d;
  return d = null, e;
}, L = (t, e) => {
  if (d === null)
    return;
  let n;
  p.has(t) ? n = p.get(t).get(e) : p.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), d._set.add(n), n.add(d);
}, S = (t, e, n) => {
  if (!p.get(t))
    return;
  p.get(t).get(e).forEach(({ cb: s }) => s(n));
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
      return L(n, r), Reflect.get(n, r, s);
    },
    set(n, r, s, c) {
      if (n[r] !== s) {
        let o = n[r];
        Reflect.set(n, r, s, c), S(n, r, o);
      }
      return !0;
    }
  });
};
const R = {
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
}, T = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[s])
  ).forEach((o) => {
    q(e.querySelector(`[data-key="${o.dataset.key}"]`));
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
}, W = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    const [n, r] = e;
    return u(() => {
      T(n.val, t, r);
    });
  }
}, F = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return u(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, _ = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), u(() => {
      t.value = e.val;
    });
  }
}, P = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return u(() => t.style.display = e(t) ? null : "none");
  }
}, j = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return u(() => {
      let n = typeof e == "function" ? e(t) : (e == null ? void 0 : e.val) ?? e;
      t.textContent === n || t instanceof Comment || (t.textContent = n);
    });
  }
}, x = [
  W,
  j,
  R,
  P,
  F,
  _
], N = Object.fromEntries(
  x.map((t) => [t.selector, t])
), M = (t) => {
  x.push(t);
}, l = /* @__PURE__ */ new WeakMap(), w = (t, e) => l.has(t) ? l.get(t).push(e) : l.set(t, [e]), q = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = l.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), l.delete(t), t == null || t.remove();
}, D = (t, e, n) => {
  let r = u(() => t.setAttribute(e, n(t)));
  w(t, r);
}, A = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), I = (t, e) => {
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
      D(t.element, e, t.ctx[e]);
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
  let [r, s] = A(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return y(c), E(c.element, s), c.replaceWith ?? c.element;
}, J = new Proxy(
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
const B = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((s) => {
    s.startsWith(":") && (n[s.replaceAll(":", "")] = e[t.getAttribute(s)]) && t.removeAttribute(s);
  }), n;
}, C = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = A(r, s);
      const f = [...I(t, n)];
      let h = n === "createScope" ? c : null;
      return f.forEach((i) => {
        h && (c = B(i, h)), y({ element: i, ctx: c }), E(i, o), i.$ = C(i), i.mount = function(a) {
          a(i);
        }, i.props = function(a) {
          y({ element: i, ctx: a }), E(i, o);
        };
      }), f.length === 1 ? f[0] : new H(...f);
    }
  }
), K = C();
export {
  K as $,
  J as h,
  u as hook,
  M as registerDirective,
  q as safeRemove,
  m as stream
};
