import { hook } from "../streams.js"

export const textDirective = {
    selector: 'data-text',
    construct: function(element, binding) {
        return hook(() => {
            if (element.textContent === binding()) return;
            element.textContent = binding()
        })
    }
}