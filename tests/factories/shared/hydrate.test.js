import { stream } from "@reactivjs/streams";
import { hydrate } from "../../../src/factories/shared";
import { registerDirectives } from "../../../src";

const logs = []

describe('Shared > hydrate', () => {
    beforeEach(() => {
        logs.length = 0;
    })
    
    it('should leave the element unaffected if the context is empty', () => {
        const block = {
            element: document.createElement('div'),
            ctx: {}
        }
        hydrate(block);
        expect(block.element.getAttributeNames().length).toBe(0);
    })

    it('should leave the element unaffected if the context is null', () => {
        const block = {
            element: document.createElement('div'),
            ctx: null
        }
        hydrate(block);
        expect(block.element.getAttributeNames().length).toBe(0);
    })

    it('should attach event listeners to the element', () => {
        const block = {
            element: document.createElement('div'),
            ctx: {
                onclick: () => logs.push('onclick triggered')
            }
        }

        hydrate(block);
        block.element.click();
        expect(logs.length).toBe(1);
    })

    it('should attach custom event listeners to the element', () => {
        const block = {
            element: document.createElement('div'),
            ctx: {
                onCustomEvent: () => logs.push('onCustomEvent triggered')
            }
        }
        
        hydrate(block);
        block.element.dispatchEvent(new CustomEvent('CustomEvent'));
        expect(logs.length).toBe(1);
    })

    it('should attach magic methods to the element', () => {
        const block = {
            element: document.createElement('div'),
            ctx: {
                init: () => logs.push('init triggered'),
                destroy: () => logs.push('destroy triggered')
            }
        }
    
        hydrate(block);
        block.element.init();
        block.element.destroy();
        expect(logs.length).toBe(2);
    })

    // With this one it's enough, directives are tested in their respective files
    it('should react to built-in directives', () => {
        let text = stream('Test')
        const block = {
            element: document.createElement('div'),
            ctx: {
                'rv-text': () => text.val,
            }
        }

        hydrate(block);
        expect(block.element.textContent).toBe('Test');
    })

    it('should register custom directives', () => {
        const customDirective = {
            selector: 'custom-directive',
            construct: (_, value) => value(),
        };
        registerDirectives(customDirective);

        let count = 0
        const block = {
            element: document.createElement('div'),
            ctx: {
                'custom-directive': () => count++,
            }
        }

        hydrate(block);
        expect(count).toBe(1);
    })

    it('should set reactive attributes if the value is a function not present in directives list', () => {
        let count = stream(0)
        const block = {
            element: document.createElement('div'),
            ctx: {
                'data-test': () => count.val,
            }
        }

        hydrate(block);
        expect(block.element.dataset.test).toBe('0');

        count.val = 1;
        expect(block.element.dataset.test).toBe('1');
    })

    it('should set normal attributes if the value is not a function', () => {
        const block = {
            element: document.createElement('div'),
            ctx: {
                'data-test': 'test',
            }
        }

        hydrate(block);
        expect(block.element.dataset.test).toBe('test');
        
    })
})