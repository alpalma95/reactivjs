import { hook } from "../streams.js"

export const showDirective = {
    selector: 'data-show',
    construct: function(element, binding) {
        return hook(() => element.style.display = binding() ? null : 'none')
    }
}