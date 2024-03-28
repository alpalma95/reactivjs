import { directives } from "./directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "./utils.js";

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

    for (const attr in props) {
      let currentDirective = directives[attr];
      const isEventHandler = attr.startsWith('on') && typeof props[attr] === 'function';

      if (currentDirective) {
        let effect = currentDirective.construct(block, props[attr]);
        registerEffect(block.element, effect);
        continue;
      }

      if (!currentDirective && typeof props[attr] === "function" && !isEventHandler) {
        bindAttribute(block.element, attr, props[attr]);
        continue;
      }
      if (isEventHandler) {
        block.element.addEventListener(attr.slice(2), props[attr])
        continue;
      }
      
      block.element.setAttribute(attr, props[attr]);
    }
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

export const h = new Proxy(
  {},
  {
    get: function (target, value) {
      if (!(value in target)) {
        Reflect.set(target, value, html(value));

        return target[value];
      }
      return target[value];
    },
  }
);
