let u = null, h = /* @__PURE__ */ new WeakMap();
class A {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let a = (t) => {
  u = new A(t), u.cb();
  let e = u;
  return u = null, e;
}, S = (t, e) => {
  if (u === null)
    return;
  let n;
  h.has(t) ? n = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), u._set.add(n), n.add(u);
}, L = (t, e, n) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: s }) => s(n));
}, W = (t) => {
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
  let e = W(t);
  return new Proxy(e, {
    get(n, r, s) {
      return S(n, r), Reflect.get(n, r, s);
    },
    set(n, r, s, c) {
      if (n[r] !== s) {
        let o = n[r];
        Reflect.set(n, r, s, c), L(n, r, o);
      }
      return !0;
    }
  });
};
const y = /* @__PURE__ */ new WeakMap(), w = (t, e) => y.has(t) ? y.get(t).push(e) : y.set(t, [e]), j = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), y.delete(t), t == null || t.remove();
}, q = (t, e, n) => {
  let r = a(() => t.setAttribute(e, n(t)));
  w(t, r);
}, E = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), v = {
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
}, P = (t, e, n = null) => {
  const r = e.children, { trackBy: s } = e.dataset;
  if (t.length < r.length) {
    [...r].filter(
      (o) => !t.some((f) => o.dataset.key == f[s])
    ).forEach((o) => {
      j(e.querySelector(`[data-key="${o.dataset.key}"]`));
    });
    return;
  }
  t.forEach((c, o) => {
    r[o] || e.appendChild(n(c));
    const f = c[s] == r[o].dataset.key, i = t.length === r.length, d = `[data-key="${c[s]}"]`;
    if (!f && i) {
      const p = e.querySelector(d) ?? n(c);
      e.replaceChild(p, r[o]);
    }
    if (!f && !i) {
      const p = e.querySelector(d) ?? n(c);
      e.insertBefore(p, r[o]);
    }
  });
}, R = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    return a(() => {
      P(e.at(0).val, t, e.at(-1));
    });
  }
}, $ = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return a(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, D = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return a(() => t.style.display = e(t) ? null : "none");
  }
}, _ = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return a(() => {
      t.textContent === e(t) || t instanceof Comment || (t.textContent = e(t));
    });
  }
}, g = [
  R,
  _,
  v,
  D,
  $
], B = Object.fromEntries(
  g.map((t) => [t.selector, t])
), T = (t) => {
  g.push(t);
}, l = (t) => {
  for (const e in t.ctx) {
    let n = B[e];
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
      q(t.element, e, t.ctx[e]);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, x = (t, e) => {
  e.length && e.forEach((n) => {
    let r;
    n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? r = n : r = new Text(n), t.appendChild(r);
  });
}, F = (t) => function(e, n = []) {
  let [r, s] = E(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return l(c), x(c.element, s), c.replaceWith ?? c.element;
}, I = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, F(e)), t[e];
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
    let [c, o] = E(r, s);
    const f = [...t.querySelectorAll(`[ref="${n}"]`)];
    return f.forEach((i) => {
      l({ element: i, ctx: c }), x(i, o), i.$ = C(i), i.mount = function(d) {
        d(i);
      }, i.state = function(d) {
        l({ element: i, ctx: d }), x(i, o);
      };
    }), f.length === 1 ? f[0] : new H(...f);
  }
}), M = C();
export {
  M as $,
  I as h,
  a as hook,
  T as registerDirective,
  j as safeRemove,
  m as stream
};
