import { hook } from "@reactivjs/streams";
import { doBinding } from "../utils.js";

export const ifDirective = {
  selector: "rv-if",
  construct: function ( block , binding) {
    let comment = new Comment('rv-if');
    
    return hook(() => {

        if (!doBinding(binding, block.element) && !block.element.isConnected) block.replaceWith = comment
        
        if (comment.isConnected && doBinding(binding, block.element)) {
          comment.replaceWith(block.element)

          if (typeof block.element.init === 'function')
            block.element.init(block.element)
        }
        if (block.element.isConnected && !doBinding(binding, block.element)) {
          if (typeof block.element.destroy === 'function') 
            block.element.destroy(block.element)
          
          block.element.replaceWith(comment)
        }
    });
  },
};
