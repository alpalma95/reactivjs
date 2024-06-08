import { directives } from "../directives/registerDirectives.js";
import { textDirective } from "../directives/text.js";
import { bindAttribute, registerEffect } from "./effectsManager.js";

export const hydrate = (block) => {
    for (const attr in block.ctx) {
        let currentDirective = directives[attr];
        const isEventHandler =
            attr.startsWith("on") && typeof block.ctx[attr] === "function";

        // TODO: "Magic methods, we shall look for a better place for them"
        if (attr === "init" || attr === "destroy") {
            block.element[attr] = block.ctx[attr];
            continue;
        }
        // end of magic methods

        if (currentDirective) {
            let effect = currentDirective.construct(block, block.ctx[attr]);
            if (effect) registerEffect(block.element, effect);
            continue;
        }

        if (isEventHandler) {
            block.element.addEventListener(attr.slice(2), block.ctx[attr]);
            continue;
        }

        if (
            typeof block.ctx[attr] === "function" ||
            // This is because of the data-populate attribute for the rv-for directive.
            // Maybe not the best place ?
            typeof block.ctx[attr] === "object" 
        ) {
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

            if (typeof child === "function")
                registerEffect(
                    currentNode,
                    textDirective.construct({ element: currentNode }, child)
                );

            element.appendChild(currentNode);
        });
    }
};
