import { switchProps } from "../utils.js";
import { appendChildren, hydrate } from "./shared.js";

const html = (tagName) => {
  return function (props_raw, children_raw = []) {
    let [props, children] = switchProps(props_raw, children_raw)

    let block = {
      element: tagName === 'fragment' ? new DocumentFragment() : document.createElement(tagName),
      ctx: props
    };

    hydrate(block)
    appendChildren(block.element, children)
    
    return block.replaceWith ?? block.element;
  };
};

export const h = new Proxy({}, {
    get: function (target, value) {
      if (!(value in target)) Reflect.set(target, value, html(value))

      return target[value];
    },
  }
);
