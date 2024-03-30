import { appendChildren, hydrate } from "./shared.js"
import { switchProps } from "../utils.js"

class Mountable extends Array {
    constructor(iterable) {
        super()
        this.iterable = iterable
    }

    mount(component) {
        this.iterable.forEach( (element) => component(element))
    }
}

const proxify = (root = document) => new Proxy({}, {
    get: (_, value) => function (ctx_raw, children_raw = []) {
        let [ctx, children] = switchProps(ctx_raw, children_raw)
        const found = [... root.querySelectorAll(`[ref="${value}"]`)]
        
        found.forEach( (element) => {
            hydrate({element, ctx})
            appendChildren(element, children)
            element.$ = proxify(element)
            element.mount = function(component) {
                component(element)
            }
            // TODO: In case we want to bind any state to the component from inside it. Since it'll affect all instances, still deciding if it's useful
            element.state = function(ctx) {
                hydrate({element, ctx})
                appendChildren(element, children)
            }
        } )
        return found.length === 1 ? found[0] : new Mountable(found)
    }
})

export const $ = proxify()

// $.ref(ctx) ---> hydrates as originally intended
// $.ref().mount(Component())