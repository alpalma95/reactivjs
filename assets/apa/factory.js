import { directives } from "./directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "./utils.js";

const html = (tagName) => {
  return function (props, children = []) {
    let element = {
      element: document.createElement(tagName),
      ctx: props,
      children
    };

    if (typeof props != "object") {
      children.push(props);
      props = {};
    }

    let currentDirective;
    for (const attr in props) {
      currentDirective = directives[attr];
      const isEventHandler = attr.startsWith('on') && typeof props[attr] === 'function';

      if (currentDirective) {
        let effect = currentDirective.construct(element, props[attr]);
        registerEffect(element, effect);
        continue;
      }

      if (!currentDirective && typeof props[attr] === "function" && !isEventHandler) {
        bindAttribute(element.element, attr, props[attr]);
        continue;
      }
      if (isEventHandler) {
        element.element.addEventListener(attr.slice(2), props[attr])
        continue;
      }
      
      element.element.setAttribute(attr, props[attr]);
    }
    if (children.length) {
      children.forEach((child) => {
        let currentNode;

        child instanceof HTMLElement || child instanceof Comment
          ? (currentNode = child)
          : (currentNode = new Text(child));
        
        element.element.appendChild(currentNode);
        
      });
    }
    return element.replaceWith ?? element.element;
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
