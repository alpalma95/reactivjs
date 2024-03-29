import { switchProps } from "../utils.js";
import { hydrate } from "./shared.js";

const html = (tagName) => {
  return function (props_raw, children_raw = []) {
    let [props, children] = switchProps(props_raw, children_raw)

    let block = {
      element: tagName === 'fr' ? new DocumentFragment() : document.createElement(tagName),
      ctx: props
    };

    hydrate(block)
   
    if (children.length) {
      children.forEach((child) => {
        let currentNode;

        child instanceof HTMLElement || child instanceof Comment
          ? (currentNode = child)
          : (currentNode = new Text(child));
        
        block.element.appendChild(currentNode);
      });
    }
    return block.replaceWith ?? block.element;
  };
};

// Elements factory
export const h = new Proxy({}, {
    get: function (target, value) {
      if (!(value in target)) Reflect.set(target, value, html(value))

      return target[value];
    },
  }
);
