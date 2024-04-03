import { hook } from "../streams.js";
import { isTruthy } from "../utils.js";

export const ifDirective = {
  selector: "data-if",
  construct: function ( block , binding) {
    let comment = new Comment('data-if');
    
    return hook(() => {

        if (!isTruthy(binding, block.element) && !block.element.isConnected) block.replaceWith = comment
        
        if (comment.isConnected && isTruthy(binding, block.element)) {
          comment.replaceWith(block.element)

          if (typeof block.element.init === 'function')
            block.element.init(block.element)
        }
        if (block.element.isConnected && !isTruthy(binding, block.element)) {
          if (typeof block.element.destroy === 'function') 
            block.element.destroy(block.element)
          
          block.element.replaceWith(comment)
        }
    });
  },
};
