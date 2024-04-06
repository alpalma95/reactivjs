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
class L {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let l = (t) => {
  d = new L(t), d.cb();
  let e = d;
  return d = null, e;
}, v = (t) => {
  let e = ((n) => {
    if (Array.isArray(n) || typeof n != "function" && typeof n != "object")
      return { val: n };
    if (typeof n == "function") {
      let r = v(1);
      return l(() => r.val = n()), r;
    }
    return Object.fromEntries(Object.entries(n).map(([r, c]) => [r, typeof c == "object" || typeof c == "function" ? v(c) : c]));
  })(t);
  return new Proxy(e, { get: (n, r, c) => (((s, i) => {
    if (d === null)
      return;
    let o;
    h.has(s) ? o = h.get(s).get(i) : h.set(s, /* @__PURE__ */ new Map([[i, o = /* @__PURE__ */ new Set()]])), d._set.add(o), o.add(d);
  })(n, r), Reflect.get(n, r, c)), set: (n, r, c, s) => (n[r] !== c && (Reflect.set(n, r, c, s), ((i, o) => {
    h.get(i) && h.get(i).get(o).forEach(({ cb: a }) => a());
  })(n, r)), !0) });
};
const R = {
  selector: "data-class",
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
}, y = /* @__PURE__ */ new WeakMap(), A = (t, e) => {
  let { isArray: n } = Array, r = y.get(t);
  r ? y.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : y.set(t, [e]);
}, F = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), y.delete(t), t == null || t.remove();
}, T = (t, e, n) => {
  let r = l(
    () => t.setAttribute(e, u(n, t))
  );
  A(t, r);
};
class W extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const _ = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((c) => {
    c.startsWith(":") && (n[c.replaceAll(":", "")] = e[t.getAttribute(c)]) && t.removeAttribute(c);
  }), n;
}, g = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, c = []) {
      let [s, i] = w(r, c);
      const o = [...C(t, n)];
      let a = n === "createScope" ? s : null;
      return a && o.push(t), o.forEach((f, p) => {
        a && (s = _(f, a)), E({ element: f, ctx: s }), m(f, i), f.$ = g(f), f.mount = function(x) {
          x(f);
        }, f.props = function(x) {
          E({ element: f, ctx: x }), m(f, i);
        };
      }), o.length === 1 ? o[0] : new W(...o);
    }
  }
), H = g(), N = (t, e, n) => {
  const r = e.children, { trackBy: c } = e.dataset;
  t.length < r.length && [...r].filter(
    (i) => !t.some((o) => i.dataset.key == o[c])
  ).forEach((i) => {
    F(
      e.querySelector(`[data-key="${i.dataset.key}"]`)
    );
  }), t.forEach((s, i) => {
    r[i] || e.appendChild(n(s));
    const o = s[c] == r[i].dataset.key, a = t.length === r.length, f = `[data-key="${s[c]}"]`;
    if (!o && a) {
      const p = e.querySelector(f) ?? n(s);
      e.replaceChild(p, r[i]);
    }
    if (!o && !a) {
      const p = e.querySelector(f) ?? n(s);
      e.insertBefore(p, r[i]);
    }
  });
}, j = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return n.$ = g(n), n.props = function(c) {
    E({ element: n, ctx: c });
  }, (c) => (e(c)(n), n);
}, P = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    var i;
    let [n, r, c] = e, s;
    if ((i = t.dataset) != null && i.populate) {
      const o = JSON.parse(t.dataset.populate);
      n.val = c ? o.map(c) : o, t.removeAttribute("data-populate"), s = j(t, r);
    }
    return s && n.val.forEach((o, a) => {
      const f = t.children[a];
      f.$ = g(f), f.props = function(p) {
        E({ element: f, ctx: p });
      }, r(o)(f);
    }), l(() => {
      N(n.val, t, s ?? r);
    });
  }
}, q = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return l(() => {
      !u(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && u(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !u(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, $ = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), l(() => {
      t.value = e.val;
    });
  }
}, D = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return l(() => t.style.display = u(e, t) ? null : "none");
  }
}, I = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return l(() => {
      t.textContent === u(e, t) || t instanceof Comment || (t.textContent = u(e, t));
    });
  }
}, S = [
  P,
  I,
  R,
  D,
  q,
  $
], B = Object.fromEntries(
  S.map((t) => [t.selector, t])
), J = (t) => {
  S.push(t);
}, E = (t) => {
  for (const e in t.ctx) {
    let n = B[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let c = n.construct(t, t.ctx[e]);
      A(t.element, c);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      T(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, m = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, O = (t) => function(e, n = []) {
  let [r, c] = w(e, n), s = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(s), m(s.element, c), s.replaceWith ?? s.element;
}, K = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, O(e)), t[e];
    }
  }
);
export {
  H as $,
  K as h,
  l as hook,
  J as registerDirective,
  F as safeRemove,
  v as stream
};
