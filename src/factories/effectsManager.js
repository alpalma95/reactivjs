import { hook } from "@reactivjs/streams";
import { doBinding } from "../utils.js";

/** @type {WeakMap<HTMLElement, Array>} */
export const DOMEffectsMap = new WeakMap();

export const registerEffect = (element, effect) => {
    let { isArray } = Array;
    let foundEffects = DOMEffectsMap.get(element);

    foundEffects
        ? DOMEffectsMap.set(
              element,
              isArray(effect)
                  ? [...foundEffects, ...effect]
                  : [...foundEffects, effect]
          )
        : DOMEffectsMap.set(element, [effect]);
};
/**
 * Remove the given element as well as the effects associated with it found in the weakmap
 * @param {HTMLElement} Element Element to remove from the DOM
 */
export const safeRemove = (element) => {
    if ( typeof element?.destroy === "function") element.destroy(element);

    DOMEffectsMap.get(element)?.forEach((effect) => {
        effect.unhook();
    });
    DOMEffectsMap.delete(element);
    element?.remove();
};

export const bindAttribute = (element, attrName, binding) => {
    let effect = hook(() =>
        element.setAttribute(attrName, doBinding(binding, element))
    );
    registerEffect(element, effect);
};
