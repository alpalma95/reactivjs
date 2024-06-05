import { DOMEffectsMap, registerEffect } from "../../../src/factories/effectsManager";
import { h } from "../../../src";

const createDummyEffect = () => ({
    cb: () => {},
    unhook: () => console.log("unhooked")
})

describe('EffectsManager > registerEffect', () => {

    it('should have an array as value if the key is newly created', () => {
        const element = h.div()
        const effect = createDummyEffect()
        registerEffect(element, effect)
        expect(Array.isArray(DOMEffectsMap.get(element))).toBe(true)
        
    })
    
    it('should add the effect to the map', () => {
        const element = h.div()
        const effect = createDummyEffect()
        registerEffect(element, effect)
        expect(DOMEffectsMap.get(element)).toEqual([effect])
    })

    it('should add an effect to the key if it is already in the map', () => {
        const element = h.div()
        const effect1 = createDummyEffect()
        const effect2 = createDummyEffect()
        registerEffect(element, effect1)
        registerEffect(element, effect2)
        expect(DOMEffectsMap.get(element)).toEqual([effect1, effect2])
    })
    
})