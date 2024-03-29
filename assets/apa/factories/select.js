import { switchProps } from "../utils.js";
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
        const block = {
            element,
            ctx: props
        }
    
        hydrate(block)
    })
    children.forEach((child, i) => {
        console.log(currentElement)

            return child instanceof HTMLElement || child instanceof DocumentFragment
            ? currentElement.forEach( (element) => element.appendChild(child)) 
            : child(currentElement)

        }
    );

}

const select = (refName) => (props_raw, children_raw = []) => {
    return function (parent = [document]) {
        let [props, children] = switchProps(props_raw, children_raw)

        const queryStr = `[ref="${refName}"]`;

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
            return select(value);
        },
    }
);