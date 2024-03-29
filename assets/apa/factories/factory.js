import { hydrate } from "./shared.js";

const html = (tagName) => {
  return function (props, children = []) {
    let block = {
      element: document.createElement(tagName),
      ctx: props
    };

    if (typeof props != "object") {
      children.push(props);
      props = {};
    }

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
