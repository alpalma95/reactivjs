import { hook } from "../streams.js"

export const classDirective = {
    selector: 'data-class',
    construct: function(element, classObject) {
        const effects = [];
        for (let [className, binding] of Object.entries(classObject)) {
            
            let effect = hook( () => {
                if ( !element.classList.contains(className) && binding() )
                    element.classList.add(className)

                if ( element.classList.contains(className) && !binding() )
                    element.classList.remove(className)
            })
            
            effects.push(effect)
        }
        
        return effects
    }
}