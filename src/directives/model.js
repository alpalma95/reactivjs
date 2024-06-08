import { hook } from "@reactivjs/streams";

const inputTypes = {
  'INPUT': {
    'checkbox': 'checked',
  },
}

export const modelDirective = {
  selector: "rv-model",
  construct: function ({ element }, variable) {
    let property = inputTypes[element.tagName] ?? "value"
    
    if (element instanceof HTMLInputElement) 
      property = inputTypes['INPUT'][element.type] ?? "value"
    
    element.addEventListener('input', () => {
        variable.val = element[property]
        
    })
 
    return hook(() => {
      element[property] = variable.val
    });
  },
};
