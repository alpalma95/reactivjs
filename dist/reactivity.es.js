const A = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), C = (t, e) => {
  const n = [], r = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(s) {
      var o;
      return s.getAttribute("ref") == e || s.getAttributeNames().some((f) => f.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = s.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
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
let p = (t) => {
  d = new L(t), d.cb();
  let e = d;
  return d = null, e;
}, R = (t, e) => {
  if (d === null)
    return;
  let n;
  h.has(t) ? n = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, n = /* @__PURE__ */ new Set()]])), d._set.add(n), n.add(d);
}, F = (t, e, n) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: c }) => c(n));
}, T = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = g(1);
    return p(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, n]) => [
        e,
        typeof n == "object" || typeof n == "function" ? g(n) : n
      ])
    );
}, g = (t) => {
  let e = T(t);
  return new Proxy(e, {
    get(n, r, c) {
      return R(n, r), Reflect.get(n, r, c);
    },
    set(n, r, c, s) {
      if (n[r] !== c) {
        let o = n[r];
        Reflect.set(n, r, c, s), F(n, r, o);
      }
      return !0;
    }
  });
};
const W = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const n = [];
    for (let [r, c] of Object.entries(e)) {
      let s = p(() => {
        !t.classList.contains(r) && u(c, t) && t.classList.add(r), t.classList.contains(r) && !u(c, t) && t.classList.remove(r);
      });
      n.push(s);
    }
    return n;
  }
}, y = /* @__PURE__ */ new WeakMap(), S = (t, e) => {
  let { isArray: n } = Array, r = y.get(t);
  r ? y.set(
    t,
    n(e) ? [...r, ...e] : [...r, e]
  ) : y.set(t, [e]);
}, _ = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((n) => {
    n.unhook();
  }), y.delete(t), t == null || t.remove();
}, N = (t, e, n) => {
  let r = p(
    () => t.setAttribute(e, u(n, t))
  );
  S(t, r);
};
class j extends Array {
  mount(e) {
    return this.forEach((n) => e(n)), this;
  }
}
const P = (t, e) => {
  var r;
  let n = {};
  return (r = t.getAttributeNames()) == null || r.forEach((c) => {
    c.startsWith(":") && (n[c.replaceAll(":", "")] = e[t.getAttribute(c)]) && t.removeAttribute(c);
  }), n;
}, m = (t = document) => new Proxy(
  {},
  {
    get: (e, n) => function(r, c = []) {
      let [s, o] = A(r, c);
      const f = [...C(t, n)];
      let a = n === "createScope" ? s : null;
      return a && f.push(t), f.forEach((i, l) => {
        a && (s = P(i, a)), E({ element: i, ctx: s }), w(i, o), i.$ = m(i), i.mount = function(x) {
          x(i);
        }, i.props = function(x) {
          E({ element: i, ctx: x }), w(i, o);
        };
      }), f.length === 1 ? f[0] : new j(...f);
    }
  }
), K = m(), q = (t, e, n) => {
  const r = e.children, { trackBy: c } = e.dataset;
  t.length < r.length && [...r].filter(
    (o) => !t.some((f) => o.dataset.key == f[c])
  ).forEach((o) => {
    _(
      e.querySelector(`[data-key="${o.dataset.key}"]`)
    );
  }), t.forEach((s, o) => {
    r[o] || e.appendChild(n(s));
    const f = s[c] == r[o].dataset.key, a = t.length === r.length, i = `[data-key="${s[c]}"]`;
    if (!f && a) {
      const l = e.querySelector(i) ?? n(s);
      e.replaceChild(l, r[o]);
    }
    if (!f && !a) {
      const l = e.querySelector(i) ?? n(s);
      e.insertBefore(l, r[o]);
    }
  });
}, D = (t, e) => {
  var r;
  const n = ((r = t.children[0]) == null ? void 0 : r.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return n.$ = m(n), n.props = function(c) {
    E({ element: n, ctx: c });
  }, (c) => (e(c)(n), n);
}, $ = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    var o;
    let [n, r, c] = e, s;
    if ((o = t.dataset) != null && o.populate) {
      const f = JSON.parse(t.dataset.populate);
      n.val = c ? f.map(c) : f, t.removeAttribute("data-populate"), s = D(t, r);
    }
    return s && n.val.forEach((f, a) => {
      const i = t.children[a];
      i.$ = m(i), i.props = function(l) {
        E({ element: i, ctx: l });
      }, r(f)(i);
    }), p(() => {
      q(n.val, t, s ?? r);
    });
  }
}, I = {
  selector: "data-if",
  construct: function(t, e) {
    let n = new Comment("data-if");
    return p(() => {
      !u(e, t.element) && !t.element.isConnected && (t.replaceWith = n), n.isConnected && u(e, t.element) && (n.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !u(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(n));
    });
  }
}, B = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), p(() => {
      t.value = e.val;
    });
  }
}, O = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return p(() => t.style.display = u(e, t) ? null : "none");
  }
}, H = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return p(() => {
      t.textContent === u(e, t) || t instanceof Comment || (t.textContent = u(e, t));
    });
  }
}, v = [
  $,
  H,
  W,
  O,
  I,
  B
], J = Object.fromEntries(
  v.map((t) => [t.selector, t])
), U = (t) => {
  v.push(t);
}, E = (t) => {
  for (const e in t.ctx) {
    let n = J[e];
    const r = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (n) {
      let c = n.construct(t, t.ctx[e]);
      S(t.element, c);
      continue;
    }
    if (r) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      N(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, w = (t, e) => {
  e.length && e.forEach((n) => {
    let r = n instanceof HTMLElement || n instanceof Comment || n instanceof DocumentFragment ? n : new Text(n);
    t.appendChild(r);
  });
}, M = (t) => function(e, n = []) {
  let [r, c] = A(e, n), s = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: r
  };
  return E(s), w(s.element, c), s.replaceWith ?? s.element;
}, z = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, M(e)), t[e];
    }
  }
);
export {
  K as $,
  z as h,
  p as hook,
  U as registerDirective,
  _ as safeRemove,
  g as stream
};
