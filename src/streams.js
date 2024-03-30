let active = null;
let targetMap = new WeakMap();

class Dep {
  constructor(cb) {
    this.cb = cb;
    this._set = new Set();
  }
  unhook() {
    this._set.forEach((s) => s.delete(this));
  }
}

export let hook = (cb) => {
  active = new Dep(cb);
  active.cb();
  let temp = active;
  active = null;
  return temp;
};
let track = (target, value) => {
  if (active === null) return;
  let deps;

  targetMap.has(target)
    ? (deps = targetMap.get(target).get(value))
    : targetMap.set(target, new Map([[value, (deps = new Set())]]));

  active._set.add(deps);
  deps.add(active);
};
let trigger = (target, value, oldValue) => {
  if (!targetMap.get(target)) return;
  let deps = targetMap.get(target).get(value);
  deps.forEach(({ cb }) => cb(oldValue));
};

let getInitialValue = (initialVal) => {
  if (
    Array.isArray(initialVal) ||
    (typeof initialVal !== "function" && typeof initialVal !== "object")
  ) {
    return { val: initialVal };
  } else if (typeof initialVal == "function") {
    let temp = stream(1);
    hook(() => (temp.val = initialVal()));
    return temp;
  } else {
    return Object.fromEntries(
      Object.entries(initialVal).map(([k, v]) => [
        k,
        typeof v == "object" || typeof v == "function" ? stream(v) : v,
      ])
    );
  }
};

export let stream = (initialVal) => {
  let base = getInitialValue(initialVal);
  return new Proxy(base, {
    get(target, value, receiver) {
      track(target, value);

      return Reflect.get(target, value, receiver);
    },
    set(target, value, nv, receiver) {
      if (target[value] !== nv) {
        let temp = target[value]
        Reflect.set(target, value, nv, receiver);
        trigger(target, value, temp);
      }
      return true;
    },
  });
};