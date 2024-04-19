const x = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), C = (t, e) => {
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
}, u = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let h = null, y = /* @__PURE__ */ new WeakMap();
class R {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let l = (t) => {
  h = new R(t), h.cb();
  let e = h;
  return h = null, e;
}, F = (t, e) => {
  if (h === null)
    return;
  let n = ((r, s, c) => {
    let o;
    return r.has(s) && r.get(s).has(c) ? o = r.get(s).get(c) : r.has(s) && !r.get(s).has(c) ? r.get(s).set(c, o = /* @__PURE__ */ new Set()) : r.set(s, /* @__PURE__ */ new Map([[c, o = /* @__PURE__ */ new Set()]])), o;
  })(y, t, e);
  h._set.add(n), n.add(h);
}, w = (t) => {
  let e = ((n) => {
    if (Array.isArray(n) || typeof n != "function" && typeof n != "object")
      return { val: n };
    if (typeof n == "function") {
      let r = w(1);
      return l(() => r.val = n()), r;
    }
    return Object.fromEntries(Object.entries(n).map(([r, s]) => [r, typeof s == "object" || typeof s == "function" ? w(s) : s]));
  })(t);
  return new Proxy(e, { get: (n, r, s) => (F(n, r), Reflect.get(n, r, s)), set: (n, r, s, c) => (n[r] !== s && (Reflect.set(n, r, s, c), ((o, i) => {
    y.get(o) && y.get(o).get(i).forEach(({ cb: f }) => f());
  })(n, r)), !0) });
};
const W = {
  selector: "rv-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, s] of Object.entries(e)) {
      let c = l(() => {
        !t.classList.contains(r) && u(s, t) && t.classList.add(r), t.classList.contains(r) && !u(s, t) && t.classList.remove(r);
      });
      n.push(c);
    }
    return n;
  }
}, d = /* @__PURE__ */ new WeakMap(), m = (t, e) => {
  let { isArray: n } = Array, r = d.get(t);
  r ? d.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : d.set(t, [e]);
}, _ = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = d.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), d.delete(t), t == null || t.remove();
}, L = (t, e, n) => {
  let r = l(
    () => t.setAttribute(e, u(n, t))
  );
  m(t, r);
};
class N extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const P = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((s) => {
    s.startsWith(":") && (n[s.replaceAll(":", "")] = e[t.getAttribute(s)] ?? t.getAttribute(s)) && t.removeAttribute(s);
  }), n;
}, g = (t, e = []) => {
  t.$ = A(t), t.mount = function(n) {
    n(t);
  }, t.setProps = function(n) {
    v({ element: t, ctx: n }), e.length && E(t, e);
  };
}, A = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, s = []) {
      let [c, o] = x(r, s);
      const i = [...C(t, n)];
      let f = n === "createScope" ? c : null;
      return f && i.push(t), i.forEach((a, p) => {
        f && (c = P(a, f)), v({ element: a, ctx: c }), E(a, o), g(a, c);
      }), i.length === 1 ? i[0] : new N(...i);
    }
  }
), z = A(), j = (t, e, n) => {
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
      const p = e.querySelector(a) ?? n(c);
      e.replaceChild(p, r[o]);
    }
    if (!i && !f) {
      const p = e.querySelector(a) ?? n(c);
      e.insertBefore(p, r[o]);
    }
  });
}, q = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return g(n), (s) => (e(s)(n), n);
}, D = {
  selector: "rv-for",
  construct: function({ element: t }, e) {
    var o;
    let [n, r, s] = e, c;
    if ((o = t.dataset) != null && o.populate) {
      const i = JSON.parse(t.dataset.populate);
      n.val = s ? i.map(s) : i, t.removeAttribute("data-populate"), c = q(t, r);
    }
    return c && n.val.forEach((i, f) => {
      const a = t.children[f];
      g(a), r(i)(a);
    }), l(() => {
      j(n.val, t, c ?? r);
    });
  }
}, I = {
  selector: "rv-if",
  construct: function(t, e) {
    let n = new Comment("z-if");
    return l(() => {
      !u(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && u(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !u(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, T = {
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
}, B = {
  selector: "rv-text",
  construct: function({ element: t }, e) {
    return l(() => {
      t.textContent === u(e, t) || t instanceof Comment || (t.textContent = u(e, t));
    });
  }
}, O = [
  D,
  B,
  W,
  $,
  I,
  T
], S = Object.fromEntries(
  O.map((t) => [t.selector, t])
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
      s && m(t.element, s);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      L(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, E = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, J = (t) => function(e, n = []) {
  let [r, s] = x(e, n), c = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return v(c), E(c.element, s), c.replaceWith ?? c.element;
}, U = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, J(e)), t[e];
    }
  }
);
export {
  z as $,
  U as h,
  l as hook,
  K as registerDirectives,
  _ as safeRemove,
  w as stream
};
