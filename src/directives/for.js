import { hook } from "../streams.js";
import { safeRemove } from "../factories/effectsManager.js";
import { createSelectProxy } from "../factories/select.js";

/**
 * @param {Array} array
 * @param {HTMLElement} DOMNode
 * @param {(arg?: any) => any} template
 */
const diffList = (array, DOMNode, template) => {
  const children = DOMNode.children;
  const { trackBy } = DOMNode.dataset;

  if (array.length < children.length) {
    const deleted = [...children].filter(
      (node) => !array.some((element) => node.dataset.key == element[trackBy])
    );

    deleted.forEach((node) => {
      safeRemove(DOMNode.querySelector(`[data-key="${node.dataset.key}"]`));
    });
    
  }

  array.forEach((element, index) => {
    if (!children[index]) {
     DOMNode.appendChild(template(element));
    }

    const isEqual = element[trackBy] == children[index].dataset.key;
    const areSameLength = array.length === children.length;
    const queryStr = `[data-key="${element[trackBy]}"]`

    if (!isEqual && areSameLength) {
      const newNode = DOMNode.querySelector(queryStr) ?? template(element);
      DOMNode.replaceChild(newNode, children[index]);
      
      
    }
    if (!isEqual && !areSameLength) {
        const newNode = DOMNode.querySelector(queryStr) ?? template(element);
        DOMNode.insertBefore(newNode, children[index]);
      
    }
  });
};

const useClone = (element) => {
  return element.cloneNode(true)
}

export const forDirective = {
  selector: "data-for",
  construct: function ({ element }, args) {
    let [arr, template] = args
    let ssr_template;
    console.log(element)
    if (element.dataset?.populate) {
      arr.val = JSON.parse(element.dataset.populate)
      element.removeAttribute('data-populate')
      

      ssr_template = (person) => {
        const clone = useClone(element.children[0])
        clone.$ = createSelectProxy(clone)
        clone.props = function (ctx) {
          hydrate({ clone, ctx });
          appendChildren(clone, children);
      };
        const controller = template(person)
        controller(clone)
        return clone;
    }
    }
    
    return hook(() => {
      diffList(arr.val, element, ssr_template ?? template);
    });
  },
};
