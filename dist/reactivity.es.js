let l = null, d = /* @__PURE__ */ new WeakMap();
class S {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let h = (t) => {
  l = new S(t), l.cb();
  let e = l;
  return l = null, e;
}, $ = (t, e) => {
  if (l === null)
    return;
  let n;
  d.has(t) ? n = d.get(t).get(e) : d.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), l._set.add(n), n.add(l);
}, q = (t, e, n) => {
  if (!d.get(t))
    return;
  d.get(t).get(e).forEach(({ cb: s }) => s(n));
}, L = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = m(1);
    return h(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? m(n) : n
      ])
    );
}, m = (t) => {
  let e = L(t);
  return new Proxy(e, {
    get(n, r, s) {
      return $(n, r), Reflect.get(n, r, s);
    },
    set(n, r, s, c) {
      if (n[r] !== s) {
        let o = n[r];
        Reflect.set(n, r, s, c), q(n, r, o);
      }
      return !0;
    }
  });
};
const p = /* @__PURE__ */ new WeakMap(), x = (t, e) => p.has(t) ? p.get(t).push(e) : p.set(t, [e]), j = (t) => {
  var e;
  typeof t.destroy == "function" && t.destroy(t), (e = p.get(t)) == null || e.forEach((n) => {
    Array.isArray(n) ? n.forEach((r) => r.unhook()) : n.unhook();
  }), p.delete(t), t == null || t.remove();
}, W = (t, e, n) => {
  let r = h(() => t.setAttribute(e, n(t)));
  x(t, r);
}, A = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), R = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, s] of Object.entries(e)) {
      let c = h(() => {
        !t.classList.contains(r) && s(t) && t.classList.add(r), t.classList.contains(r) && !s(t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, g = (t, e, n, r, s, c, o = null) => {
  const i = t.clone.cloneNode(!0);
  if (i.setAttribute("ref", e[r]), c === "append" && n.appendChild(i), c === "replace" || c === "insert") {
    const f = n.querySelector(`[data-key="${e[r]}"]`) ?? i;
    c === "replace" ? n.replaceChild(f, s[o]) : n.insertBefore(i, s[o]), f == i && n.$[e[r]]().mount(t.template(e));
  }
  n.$[e[r]]().mount(t.template(e));
}, P = (t, e, n) => {
  const r = e.children, { trackBy: s } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((i) => o.dataset.key == i[s])
  ).forEach((o) => {
    j(e.querySelector(`[data-key="${o.dataset.key}"]`));
  }), t.forEach((c, o) => {
    r[o] || (n.clone || e.appendChild(n.template(c)), n.clone && g(n, c, e, s, r, "append"));
    const i = c[s] == r[o].dataset.key, f = t.length === r.length, u = `[data-key="${c[s]}"]`;
    if (!i && f) {
      if (!n.clone) {
        const a = e.querySelector(u) ?? n.template(c);
        e.replaceChild(a, r[o]);
      }
      n.clone && g(n, c, e, s, r, "replace", o);
    }
    if (!i && !f) {
      if (!n.clone) {
        const a = e.querySelector(u) ?? n.template(c);
        e.insertBefore(a, r[o]);
      }
      n.clone && g(n, c, e, s, r, "insert", o);
    }
  });
}, _ = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    var c, o;
    const [n, r] = e, s = { template: r, clone: null };
    if (!n.val.length && t.children.length) {
      let i = [...t.querySelectorAll("[data-populate]")];
      i.forEach((u) => {
        const a = JSON.parse(u.dataset.populate);
        Object.keys(a).length && (n.val = [...n.val, a]), u.removeAttribute("data-populate");
      });
      let f = (c = i[0]) == null ? void 0 : c.getAttribute("ref");
      console.log(n.val), n.val.length && ((o = n.val) == null || o.forEach((u, a) => {
        const y = t.$[f]();
        y.length === 1 ? y.mount(s.template(u)) : y[a].mount(s.template(u));
      })), s.clone = i[0].cloneNode(!0);
    }
    return h(() => {
      P(n.val, t, s);
    });
  }
}, F = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return h(() => {
      !e(t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && e(t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !e(t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, H = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return h(() => t.style.display = e(t) ? null : "none");
  }
}, D = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return h(() => {
      t.textContent === e(t) || t instanceof Comment || (t.textContent = e(t));
    });
  }
}, C = [
  _,
  D,
  R,
  H,
  F
], I = Object.fromEntries(
  C.map((t) => [t.selector, t])
), B = (t) => {
  C.push(t);
}, w = (t) => {
  for (const e in t.ctx) {
    let n = I[e];
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
      x(t.element, s);
      continue;
    }
    if (!n && typeof t.ctx[e] == "function" && !r) {
      W(t.element, e, t.ctx[e]);
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
}, J = (t) => function(e, n = []) {
  let [r, s] = A(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return w(c), E(c.element, s), c.replaceWith ?? c.element;
}, G = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, J(e)), t[e];
    }
  }
);
class z extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const v = (t = document) => new Proxy({}, {
  get: (e, n) => function(r, s = []) {
    let [c, o] = A(r, s);
    const i = [...t.querySelectorAll(`[ref="${n}"]`)];
    return i.forEach((f) => {
      w({ element: f, ctx: c }), E(f, o), f.$ = v(f), f.mount = function(u) {
        u(f);
      }, f.props = function(u) {
        w({ element: f, ctx: u }), E(f, o);
      };
    }), i.length === 1 ? i[0] : new z(...i);
  }
}), K = v();
export {
  K as $,
  G as h,
  h as hook,
  B as registerDirective,
  j as safeRemove,
  m as stream
};
