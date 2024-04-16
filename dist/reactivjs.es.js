const w = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), C = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(s) {
      var i;
      return s.getAttribute("ref") == e || s.getAttributeNames().some((o) => o.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (i = s.getAttribute("ref")) != null && i.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  );
  let c;
  for (; c = r.nextNode(); )
    n.push(c);
  return n;
}, u = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let d = null, h = /* @__PURE__ */ new WeakMap();
class R {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let l = (t) => {
  d = new R(t), d.cb();
  let e = d;
  return d = null, e;
}, x = (t) => {
  let e = ((n) => {
    if (Array.isArray(n) || typeof n != "function" && typeof n != "object")
      return { val: n };
    if (typeof n == "function") {
      let r = x(1);
      return l(() => r.val = n()), r;
    }
    return Object.fromEntries(Object.entries(n).map(([r, c]) => [r, typeof c == "object" || typeof c == "function" ? x(c) : c]));
  })(t);
  return new Proxy(e, { get: (n, r, c) => (((s, i) => {
    if (d === null)
      return;
    let o;
    h.has(s) ? o = h.get(s).get(i) : h.set(s, /* @__PURE__ */ new Map([[i, o = /* @__PURE__ */ new Set()]])), d._set.add(o), o.add(d);
  })(n, r), Reflect.get(n, r, c)), set: (n, r, c, s) => (n[r] !== c && (Reflect.set(n, r, c, s), ((i, o) => {
    h.get(i) && h.get(i).get(o).forEach(({ cb: f }) => f());
  })(n, r)), !0) });
};
const F = {
  selector: "rv-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, c] of Object.entries(e)) {
      let s = l(() => {
        !t.classList.contains(r) && u(c, t) && t.classList.add(r), t.classList.contains(r) && !u(c, t) && t.classList.remove(r);
      });
      n.push(s);
    }
    return n;
  }
}, p = /* @__PURE__ */ new WeakMap(), m = (t, e) => {
  let { isArray: n } = Array, r = p.get(t);
  r ? p.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : p.set(t, [e]);
}, W = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = p.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), p.delete(t), t == null || t.remove();
}, _ = (t, e, n) => {
  let r = l(
    () => t.setAttribute(e, u(n, t))
  );
  m(t, r);
};
class L extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const N = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((c) => {
    c.startsWith(":") && (n[c.replaceAll(":", "")] = e[t.getAttribute(c)]) && t.removeAttribute(c);
  }), n;
}, v = (t, e = []) => {
  t.$ = A(t), t.mount = function(n) {
    n(t);
  }, t.setProps = function(n) {
    g({ element: t, ctx: n }), e.length && E(t, e);
  };
}, A = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, c = []) {
      let [s, i] = w(r, c);
      const o = [...C(t, n)];
      let f = n === "createScope" ? s : null;
      return f && o.push(t), o.forEach((a, y) => {
        f && (s = N(a, f)), g({ element: a, ctx: s }), E(a, i), v(a, s);
      }), o.length === 1 ? o[0] : new L(...o);
    }
  }
), J = A(), P = (t, e, n) => {
  const r = e.children, { trackBy: c } = e.dataset;
  t.length < r.length && [...r].filter(
    (i) => !t.some((o) => i.dataset.key == o[c])
  ).forEach((i) => {
    W(
      e.querySelector(`[data-key="${i.dataset.key}"]`)
    );
  }), t.forEach((s, i) => {
    r[i] || e.appendChild(n(s));
    const o = s[c] == r[i].dataset.key, f = t.length === r.length, a = `[data-key="${s[c]}"]`;
    if (!o && f) {
      const y = e.querySelector(a) ?? n(s);
      e.replaceChild(y, r[i]);
    }
    if (!o && !f) {
      const y = e.querySelector(a) ?? n(s);
      e.insertBefore(y, r[i]);
    }
  });
}, j = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return v(n), (c) => (e(c)(n), n);
}, q = {
  selector: "rv-for",
  construct: function({ element: t }, e) {
    var i;
    let [n, r, c] = e, s;
    if ((i = t.dataset) != null && i.populate) {
      const o = JSON.parse(t.dataset.populate);
      n.val = c ? o.map(c) : o, t.removeAttribute("data-populate"), s = j(t, r);
    }
    return s && n.val.forEach((o, f) => {
      const a = t.children[f];
      v(a), r(o)(a);
    }), l(() => {
      P(n.val, t, s ?? r);
    });
  }
}, D = {
  selector: "rv-if",
  construct: function(t, e) {
    let n = new Comment("z-if");
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
}, T = {
  selector: "rv-show",
  construct: function({ element: t }, e) {
    return l(() => t.style.display = u(e, t) ? null : "none");
  }
}, $ = {
  selector: "rv-text",
  construct: function({ element: t }, e) {
    return l(() => {
      t.textContent === u(e, t) || t instanceof Comment || (t.textContent = u(e, t));
    });
  }
}, S = [
  q,
  $,
  F,
  T,
  D,
  I
], B = Object.fromEntries(
  S.map((t) => [t.selector, t])
), z = (t) => {
  S.push(t);
}, g = (t) => {
  for (const e in t.ctx) {
    let n = B[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let c = n.construct(t, t.ctx[e]);
      m(t.element, c);
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
}, E = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, O = (t) => function(e, n = []) {
  let [r, c] = w(e, n), s = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return g(s), E(s.element, c), s.replaceWith ?? s.element;
}, K = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, O(e)), t[e];
    }
  }
);
export {
  J as $,
  K as h,
  l as hook,
  z as registerDirective,
  W as safeRemove,
  x as stream
};
