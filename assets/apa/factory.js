import { directives } from "./directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "./utils.js";

const hydrate = (block) => {
  for (const attr in block.ctx) {
    let currentDirective = directives[attr];
    const isEventHandler = attr.startsWith('on') && typeof block.ctx[attr] === 'function';

    if (currentDirective) {
      let effect = currentDirective.construct(block, block.ctx[attr]);
      registerEffect(block.element, effect);
      continue;
    }

    if (!currentDirective && typeof block.ctx[attr] === "function" && !isEventHandler) {
      bindAttribute(block.element, attr, block.ctx[attr]);
      continue;
    }
    if (isEventHandler) {
      block.element.addEventListener(attr.slice(2), block.ctx[attr])
      continue;
    }
    
    block.element.setAttribute(attr, block.ctx[attr]);
  }
}

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
