import { hook } from "./streams.js";

// TODO: Global WeakMap with all needed effects. We shall look for a better place
/** @type {WeakMap<HTMLElement, Array>} */
const DOMEffectsMap = new WeakMap();

export const registerEffect = (element, effect) => 
    DOMEffectsMap.has(element) ?
    DOMEffectsMap.get(element).push(effect)
    : DOMEffectsMap.set(element, [effect])


/**
 * Remove the given element as well as the effects associated with it found in the weakmap
 * @param {HTMLElement} Element Element to remove from the DOM
 */
export const safeRemove = (element) => {
    if (typeof element.destroy === 'function') element.destroy(element)

    DOMEffectsMap.get(element)?.forEach((effect) => {
        Array.isArray(effect)
            ? effect.forEach((nestedEffect) => nestedEffect.unhook())
            : effect.unhook();
    });
    DOMEffectsMap.delete(element)
    element?.remove();
};

export const bindAttribute = (element, attrName, cb) => {
    let effect = hook(() => element.setAttribute(attrName, cb(element)));
    registerEffect(element, effect);
};

export const switchProps = (props, children) => {
    if (Array.isArray(props)) {
        children = props;
        props = {};
    }
    return [props, children];
};