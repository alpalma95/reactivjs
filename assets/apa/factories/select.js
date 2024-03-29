import { hydrate } from "./shared.js";

/**
 * Hydrate all the given elements
 * @param {HTMLElement} rootElement Element inside of which we're performing the querySelector
 * @param {object} props Properties to be used in the hydration function
 * @param {()=>{}} children Nested selectors thet will be called automatically with a parent
 * @param {string} queryStr Reference selector, to be queried inside the given parent element
 */
const processBlock = (rootElement, props, children, queryStr) => {
    const currentElement = [...rootElement.querySelectorAll(queryStr)];
    currentElement.forEach( (element) => {
        let block = {
            element,
            ctx: props
        }
        hydrate(block)
    })
    children.forEach((child) => child(currentElement));
}

const select = (refName) => (props, children) => {
    return function (parent = document) {
        const queryStr = `[ref="${refName}"]`;
        
        props ??= {};
        children ??= [];

        if (Array.isArray(parent)) {
            parent.forEach((p) => {
                processBlock(p, props, children, queryStr)
            });
            return;
        }

        processBlock(parent, props, children, queryStr)

    };
};

export const $ = new Proxy(
    {},
    {
        get: function (target, value) {
            if (!target[value]) Reflect.set(target, value, select(value));
            return target[value];
        },
    }
);