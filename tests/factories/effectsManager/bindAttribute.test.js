import { bindAttribute } from "../../../src/factories/effectsManager";
import { h } from "../../../src";

describe("EffectsManager > bindAttribute", () => {

    // Since we already have tests for the doBinding and registerEffect 
    // functions (called internally by the bindAttribute function), this
    // this test is enough.
    it("should set the attribute of the element as result of a binding", () => {
        const element = h.div()
        const attribute = "data-test"
        const value = "test"
        bindAttribute(element, attribute, value)
        expect(element.getAttribute(attribute)).toBe(value)
    })
})