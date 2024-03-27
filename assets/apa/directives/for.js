import { hook } from "../streams.js"
import { safeRemove } from "../utils.js"

/**
 * 
 * @param {Array} array 
 * @param {HTMLElement} DOMNode
 * @param {(arg?: any) => any} template
 */
const diffList = (array, DOMNode, template = null) => {
    const children = DOMNode.children
    const { trackBy } = DOMNode.dataset

    if (array.length < children.length) {
        const deleted = [...children].filter((node) => !array.some((element) => node.dataset.key == element[trackBy]))

        deleted.forEach((node) => {
            safeRemove(
                DOMNode.querySelector(`[data-key="${node.dataset.key}"]`)
            );
            
        })
        return;
    }

    array.forEach((element, index) => {
        if (!children[index]) DOMNode.appendChild(template(element))

        const isEqual = element[trackBy] == children[index].dataset.key
        const areSameLength = array.length === children.length;

        if (!isEqual && areSameLength) {
            const newNode = template(element)
            DOMNode.replaceChild(newNode, children[index])
        }
        if (!isEqual && !areSameLength) {
            const newNode = template(element)
            DOMNode.insertBefore(newNode, children[index])
        }
    })

}


export const forDirective = {
    selector: 'data-for',
    construct: function (container, args) {

        return hook(() => {
            diffList(args.at(0).val, container, args.at(-1))
        })
    }
}