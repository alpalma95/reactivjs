import { hook } from "../streams.js";
import { safeRemove } from "../utils.js";

/**
 * 
 * @param {any} template 
 * @param {any} data 
 * @param {HTMLElement} parent 
 * @param {string} trackBy 
 * @param {'append' | 'replace' | 'insert'} operationType 
 */
const useClone = (template, data, parent, trackBy, children, operationType, index = null) => {
  const newNode = template.clone.cloneNode(true)
  newNode.setAttribute('ref', data[trackBy])

  if(operationType === "append") parent.appendChild(newNode)

  if (operationType === 'replace' || operationType === 'insert') {
    const found = parent.querySelector(`[data-key="${data[trackBy]}"]`) ?? newNode
    
    operationType === 'replace' 
      ? parent.replaceChild(found, children[index])
      : parent.insertBefore(newNode, children[index])
      
    if (found == newNode) parent.$[data[trackBy]]().mount(template.template(data))
    
  }
  parent.$[data[trackBy]]().mount(template.template(data))
}

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
      if (!template.clone) DOMNode.appendChild(template.template(element));
      if (template.clone) {
        useClone(template, element, DOMNode, trackBy, children, "append")
      }
    }

    const isEqual = element[trackBy] == children[index].dataset.key;
    const areSameLength = array.length === children.length;
    const queryStr = `[data-key="${element[trackBy]}"]`

    if (!isEqual && areSameLength) {
      if (!template.clone) {
        const newNode = DOMNode.querySelector(queryStr) ?? template.template(element);
        DOMNode.replaceChild(newNode, children[index]);
      }  
      if (template.clone) {
        useClone(template, element, DOMNode, trackBy, children, "replace", index)
      }
    }
    if (!isEqual && !areSameLength) {
      if (!template.clone) {
        const newNode = DOMNode.querySelector(queryStr) ?? template.template(element);
        DOMNode.insertBefore(newNode, children[index]);
      }

      if (template.clone) {
        useClone(template, element, DOMNode, trackBy, children, "insert", index)
      }
    }
  });
};

export const forDirective = {
  selector: "data-for",
  construct: function ({ element }, args) {
    const [arr, template_raw] = args
    const template = { template: template_raw, clone: null }
    // If the value of the stream is an empty array and still we detect children
    // in the container, that means the list has been generated server side.
    if (!arr.val.length && element.children.length) {
      
      let items = [...element.querySelectorAll("[data-populate]")]
      items.forEach( (item) => {
        const newValue = JSON.parse(item.dataset.populate)
        if ( Object.keys(newValue).length ) arr.val = [... arr.val, newValue]
        item.removeAttribute('data-populate')
      })
      // assuming they'll all have the same ref, we only take the first
      let ref = items[0]?.getAttribute('ref')

      // TODO: it might be empty still if the element is just a "template"
      console.log(arr.val)
      if (arr.val.length) {
          arr.val?.forEach( (el, index) =>  {
            const listOfRefs =  element.$[ref]()
            listOfRefs.length === 1 
            ? listOfRefs.mount( template.template(el) ) 
            : listOfRefs[index].mount( template.template(el) )
          })
      }

      template.clone = items[0].cloneNode(true)
    }
  
    return hook(() => {
      diffList(arr.val, element, template);
    });
  },
};
