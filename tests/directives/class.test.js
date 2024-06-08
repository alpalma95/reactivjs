import { h, stream } from "../../src";

describe('rv-class directive', () => {
    const showClasses = stream({
        showTest1: true,
        showTest2: true,
        showTest3: true,
    })
    const element = h.div({
        'rv-class': {
            'test1': () => showClasses.showTest1,
            'test2': () => showClasses.showTest2,
            'test3': () => showClasses.showTest3,
        }
    })

    it('should set initial class names', () => {
        expect(element.classList.contains('test1')).toBe(true);
        expect(element.classList.contains('test2')).toBe(true);
        expect(element.classList.contains('test3')).toBe(true);
    })

    it('should update class names', () => {
        showClasses.showTest1 = false;
        expect(element.classList.contains('test1')).toBe(false);
        expect(element.classList.contains('test2')).toBe(true);
        expect(element.classList.contains('test3')).toBe(true);
    })
})