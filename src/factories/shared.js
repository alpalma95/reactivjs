import { directives } from "../directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "./effectsManager.js";

export const hydrate = (block) => {
    for (const attr in block.ctx) {
        let currentDirective = directives[attr];
        const isEventHandler =
            attr.startsWith("on") && typeof block.ctx[attr] === "function";

        // TODO: "Magic methods, we shall look for a better place for them"
        if (attr === "init" || attr === "destroy") {
            if (attr === "init") block.ctx[attr](block.element);
            block.element[attr] = block.ctx[attr];
            continue;
        }
        // end of magic methods

        if (currentDirective) {
            let effect = currentDirective.construct(block, block.ctx[attr]);
            registerEffect(block.element, effect);
            continue;
        }
        
        if (isEventHandler) {
            block.element.addEventListener(attr.slice(2), block.ctx[attr]);
            continue;
        }

        if (typeof block.ctx[attr] === "function" || typeof block.ctx[attr] === 'object') {
            bindAttribute(block.element, attr, block.ctx[attr]);
            continue;
        }

        block.element.setAttribute(attr, block.ctx[attr]);
    }
};

export const appendChildren = (element, children) => {
    if (children.length) {
        children.forEach((child) => {
            let currentNode =
                child instanceof HTMLElement ||
                child instanceof Comment ||
                child instanceof DocumentFragment
                    ? child
                    : new Text(child);

            element.appendChild(currentNode);
        });
    }
};
