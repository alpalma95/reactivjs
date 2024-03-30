import { hook } from "../streams.js";

export const ifDirective = {
  selector: "data-if",
  construct: function ( block , binding) {
    let comment = new Comment('data-if');
    
    return hook(() => {
       // Check if the element is being newly created and binding evaluates to false
        if (!binding(block.element) && !block.element.isConnected) block.replaceWith = comment
        
        if (comment.isConnected && binding(block.element)) {
          comment.replaceWith(block.element)

          if (typeof block.element.init === 'function')
            block.element.init(block.element)
        }
        if (block.element.isConnected && !binding(block.element)) {
          if (typeof block.element.destroy === 'function') 
            block.element.destroy(block.element)
          
          block.element.replaceWith(comment)
        }
    });
  },
};
