import { hook } from "../streams.js";

export const ifDirective = {
  selector: "data-if",
  construct: function ( block , binding) {
    let comment = new Comment('data-if');
    
    return hook(() => {
       // Check if the element is being newly created and binding evaluates to false
        if (!binding() && !block.element.isConnected) block.replaceWith = comment
        if (comment.isConnected && binding()) comment.replaceWith(block.element)
        if (block.element.isConnected && !binding()) block.element.replaceWith(comment)
    });
  },
};
