import { directives } from "../directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "../utils.js";

export const hydrate = (block) => {
    // Block.ctx will always default to empty object. If that's the case, 
    // the loop operation will never take place. We don't need to perform
    // additional checks for early return.

    for (const attr in block.ctx) {
      let currentDirective = directives[attr];
      const isEventHandler = attr.startsWith('on') && typeof block.ctx[attr] === 'function';
  
      // TODO: "Magic methods, we shall look for a better place for them"
      if(attr === 'init')  {
        block.ctx[attr](block.element);
        continue;
      }
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

export const appendChildren = (element, children) => {
  if (children.length) {
    children.forEach((child) => {
      let currentNode;
      child instanceof HTMLElement 
      || child instanceof Comment
      || child instanceof DocumentFragment
        ? (currentNode = child)
        : (currentNode = new Text(child));
    
      element.appendChild(currentNode);
    });
  }
}