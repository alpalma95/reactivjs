import { expect } from "vitest";
import { h, stream } from "../../../src";
import { doBinding } from "../../../src/utils";

describe('Utils > doBinding', () => {
    
    it('should return the value of the binding if it is a function', () => {
        expect(doBinding(() => "test", null)).toBe("test")
    })

    it('should pass the element to the binding if it is a function', () => {
        const element = h.div({ id: "test"})
        expect(doBinding((el) => el.id, element)).toBe("test")
    })

    it('should return the value of a stream if it is a stream', () => {
        const count = stream(0)
        expect(doBinding(count, null)).toBe(0)
    })

    it('should return a raw value if it is not a function or stream', () => {
        expect(doBinding("test", null)).toBe("test")
    })
})