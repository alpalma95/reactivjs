import { h, stream } from "../../src";
import { modelDirective } from "../../src/directives/model";

describe('rv-model directive', () => {
   
    it('should update the value of the stream when the input changes', () => {
        const text = stream('')
        const element = h.input({ type: 'text', 'rv-model': text })
        element.value = 'test'
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe('test')
    })

    it('should update the value of the input when the stream changes', () => {
        const text = stream('')
        const element = h.input({ type: 'text', 'rv-model': text })
        text.val = 'test'
        expect(element.value).toBe('test')
    })

    it('should work with textarea', () => {
        const text = stream('')
        const element = h.textarea({ 'rv-model': text })
        element.value = 'test'
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe('test')  
    })

    it('should work with select', () => {
        const text = stream('')
        const element = h.select({ 'rv-model': text }, [
            h.option({ value: "" }, [""]),
            h.option({ value: "a" }, ["a"]),
            h.option({ value: "b" }, ["b"]),
            h.option({ value: "c" }, ["c"]),
        ])
        element.value = 'a'
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe('a')
    })

    it('should work with radio', () => {
        const text = stream('')
        const element = h.input({ type: 'radio', 'rv-model': text })
        element.value = 'a'
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe('a')
    })

    it('should work with input type range', () => {
        const text = stream(0)
        const element = h.input({ type: 'range', 'rv-model': text, min: 0, max: 10, step: 1 })
        element.value = 5
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe("5")
    })

    it('should work with input type number', () => {
        const text = stream(0)
        const element = h.input({ type: 'number', 'rv-model': text})
        element.value = 5
        element.dispatchEvent(new Event('input'), {bubbles: true})
        expect(text.val).toBe("5")
    })
})