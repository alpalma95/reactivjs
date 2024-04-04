const w = (t, e) => (Array.isArray(t) && (e = t, t = {}), [t, e]), v = (t, e) => {
  const r = [], n = document.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT,
    function(s) {
      var o;
      return s.getAttribute("ref") == e || s.getAttributeNames().some((f) => f.includes(":")) && e === "createScope" ? NodeFilter.FILTER_ACCEPT : (o = s.getAttribute("ref")) != null && o.toUpperCase().includes("CONTROLLER") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
    }
  );
  let c;
  for (; c = n.nextNode(); )
    r.push(c);
  return r;
}, d = (t, e) => typeof t == "function" ? t(e) : t.val ?? t;
let p = null, h = /* @__PURE__ */ new WeakMap();
class C {
  constructor(e) {
    this.cb = e, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((e) => e.delete(this));
  }
}
let l = (t) => {
  p = new C(t), p.cb();
  let e = p;
  return p = null, e;
}, L = (t, e) => {
  if (p === null)
    return;
  let r;
  h.has(t) ? r = h.get(t).get(e) : h.set(t, /* @__PURE__ */ new Map([[e, r = /* @__PURE__ */ new Set()]])), p._set.add(r), r.add(p);
}, R = (t, e, r) => {
  if (!h.get(t))
    return;
  h.get(t).get(e).forEach(({ cb: c }) => c(r));
}, F = (t) => {
  if (Array.isArray(t) || typeof t != "function" && typeof t != "object")
    return { val: t };
  if (typeof t == "function") {
    let e = g(1);
    return l(() => e.val = t()), e;
  } else
    return Object.fromEntries(
      Object.entries(t).map(([e, r]) => [
        e,
        typeof r == "object" || typeof r == "function" ? g(r) : r
      ])
    );
}, g = (t) => {
  let e = F(t);
  return new Proxy(e, {
    get(r, n, c) {
      return L(r, n), Reflect.get(r, n, c);
    },
    set(r, n, c, s) {
      if (r[n] !== c) {
        let o = r[n];
        Reflect.set(r, n, c, s), R(r, n, o);
      }
      return !0;
    }
  });
};
const T = {
  selector: "data-class",
  construct: function({ element: t }, e) {
    const r = [];
    for (let [n, c] of Object.entries(e)) {
      let s = l(() => {
        !t.classList.contains(n) && d(c, t) && t.classList.add(n), t.classList.contains(n) && !d(c, t) && t.classList.remove(n);
      });
      r.push(s);
    }
    return r;
  }
}, y = /* @__PURE__ */ new WeakMap(), A = (t, e) => {
  let { isArray: r } = Array, n = y.get(t);
  n ? y.set(
    t,
    r(e) ? [...n, ...e] : [...n, e]
  ) : y.set(t, [e]);
}, W = (t) => {
  var e;
  typeof (t == null ? void 0 : t.destroy) == "function" && t.destroy(t), (e = y.get(t)) == null || e.forEach((r) => {
    r.unhook();
  }), y.delete(t), t == null || t.remove();
}, _ = (t, e, r) => {
  let n = l(
    () => t.setAttribute(e, d(r, t))
  );
  A(t, n);
};
class N extends Array {
  mount(e) {
    return this.forEach((r) => e(r)), this;
  }
}
const j = (t, e) => {
  var n;
  let r = {};
  return (n = t.getAttributeNames()) == null || n.forEach((c) => {
    c.startsWith(":") && (r[c.replaceAll(":", "")] = e[t.getAttribute(c)]) && t.removeAttribute(c);
  }), r;
}, m = (t = document) => new Proxy(
  {},
  {
    get: (e, r) => function(n, c = []) {
      let [s, o] = w(n, c);
      const f = [...v(t, r)];
      let u = r === "createScope" ? s : null;
      return f.forEach((i) => {
        u && (s = j(i, u)), E({ element: i, ctx: s }), x(i, o), i.$ = m(i), i.mount = function(a) {
          a(i);
        }, i.props = function(a) {
          E({ element: i, ctx: a }), x(i, o);
        };
      }), f.length === 1 ? f[0] : new N(...f);
    }
  }
), M = m(), P = (t, e, r) => {
  const n = e.children, { trackBy: c } = e.dataset;
  t.length < n.length && [...n].filter(
    (o) => !t.some((f) => o.dataset.key == f[c])
  ).forEach((o) => {
    W(
      e.querySelector(`[data-key="${o.dataset.key}"]`)
    );
  }), t.forEach((s, o) => {
    n[o] || e.appendChild(r(s));
    const f = s[c] == n[o].dataset.key, u = t.length === n.length, i = `[data-key="${s[c]}"]`;
    if (!f && u) {
      const a = e.querySelector(i) ?? r(s);
      e.replaceChild(a, n[o]);
    }
    if (!f && !u) {
      const a = e.querySelector(i) ?? r(s);
      e.insertBefore(a, n[o]);
    }
  });
}, q = (t, e) => {
  var n;
  const r = ((n = t.children[0]) == null ? void 0 : n.cloneNode(!0)) ?? t.querySelector("template").content.children[0];
  return r.$ = m(r), r.props = function(c) {
    E({ element: r, ctx: c });
  }, (c) => (e(c)(r), r);
}, D = {
  selector: "data-for",
  construct: function({ element: t }, e) {
    var s;
    let [r, n] = e, c;
    return (s = t.dataset) != null && s.populate && (r.val = JSON.parse(t.dataset.populate), t.removeAttribute("data-populate"), c = q(t, n)), c && r.val.forEach((o, f) => {
      const u = t.children[f];
      u.$ = m(u), u.props = function(a) {
        E({ element: u, ctx: a });
      }, n(o)(u);
    }), l(() => {
      P(r.val, t, c ?? n);
    });
  }
}, $ = {
  selector: "data-if",
  construct: function(t, e) {
    let r = new Comment("data-if");
    return l(() => {
      !d(e, t.element) && !t.element.isConnected && (t.replaceWith = r), r.isConnected && d(e, t.element) && (r.replaceWith(t.element), typeof t.element.init == "function" && t.element.init(t.element)), t.element.isConnected && !d(e, t.element) && (typeof t.element.destroy == "function" && t.element.destroy(t.element), t.element.replaceWith(r));
    });
  }
}, I = {
  selector: "data-model",
  construct: function({ element: t }, e) {
    return t.addEventListener("input", () => {
      e.val = t.value;
    }), l(() => {
      t.value = e.val;
    });
  }
}, B = {
  selector: "data-show",
  construct: function({ element: t }, e) {
    return l(() => t.style.display = d(e, t) ? null : "none");
  }
}, O = {
  selector: "data-text",
  construct: function({ element: t }, e) {
    return l(() => {
      t.textContent === d(e, t) || t instanceof Comment || (t.textContent = d(e, t));
    });
  }
}, S = [
  D,
  O,
  T,
  B,
  $,
  I
], H = Object.fromEntries(
  S.map((t) => [t.selector, t])
), K = (t) => {
  S.push(t);
}, E = (t) => {
  for (const e in t.ctx) {
    let r = H[e];
    const n = e.startsWith("on") && typeof t.ctx[e] == "function";
    if (e === "init" || e === "destroy") {
      e === "init" && t.ctx[e](t.element), t.element[e] = t.ctx[e];
      continue;
    }
    if (r) {
      let c = r.construct(t, t.ctx[e]);
      A(t.element, c);
      continue;
    }
    if (n) {
      t.element.addEventListener(e.slice(2), t.ctx[e]);
      continue;
    }
    if (typeof t.ctx[e] == "function" || typeof t.ctx[e] == "object") {
      _(t.element, e, t.ctx[e]);
      continue;
    }
    t.element.setAttribute(e, t.ctx[e]);
  }
}, x = (t, e) => {
  e.length && e.forEach((r) => {
    let n = r instanceof HTMLElement || r instanceof Comment || r instanceof DocumentFragment ? r : new Text(r);
    t.appendChild(n);
  });
}, J = (t) => function(e, r = []) {
  let [n, c] = w(e, r), s = {
    element: t === "fragment" ? new DocumentFragment() : document.createElement(t),
    ctx: n
  };
  return E(s), x(s.element, c), s.replaceWith ?? s.element;
}, U = new Proxy(
  {},
  {
    get: function(t, e) {
      return e in t || Reflect.set(t, e, J(e)), t[e];
    }
  }
);
export {
  M as $,
  U as h,
  l as hook,
  K as registerDirective,
  W as safeRemove,
  g as stream
};
