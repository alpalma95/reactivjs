import { hook } from "../streams.js";
import { safeRemove } from "../utils.js";

/**
 *
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

export const forDirective = {
  selector: "data-for",
  construct: function ({ element }, args) {
    const [arr, template] = args
   
    return hook(() => {
      diffList(arr.val, element, template);
    });
  },
};
