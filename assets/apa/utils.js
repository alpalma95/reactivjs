import { hook } from "./streams.js"

/**
 * Remove the given element as well as the effects associated with it
 * @param {HTMLElement} Element Element to remove from the DOM 
 */
export const safeRemove = (element) => {
    element.effects?.forEach( (effect) => {
        Array.isArray(effect) 
        ? effect.forEach( (nestedEffect) => nestedEffect.unhook() ) 
        : effect.unhook()
    })
    element?.remove()
}

export const registerEffect = (element, effect) => 
    !element.effects 
    ? element.effects = [effect] 
    : element.effects.push(effect);

export const bindAttribute = (element, attrName, cb) => {
    let effect = hook(() => element.setAttribute(attrName, cb()))
    registerEffect(element, effect)
}