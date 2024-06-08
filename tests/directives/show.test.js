import { h, stream } from "../../src";

describe('show directive', () => {
    const showElement = stream(true);
    const element = h.div({ 'rv-show': () => showElement.val });

    it('should set the initial visibility', () => {
        expect(element.style.display).toBeFalsy();
    })

    it('should update the visibility when the value changes', () => {
        showElement.val = false;
        expect(element.style.display).toBe('none');

        showElement.val = true;
        expect(element.style.display).toBeFalsy();
    })
    
})