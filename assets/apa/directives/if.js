import { hook, stream } from "../streams.js";

export const ifDirective = {
  selector: "data-if",
  construct: function ( element , binding) {
    let comment = new Comment('data-if');
    
    return hook(() => {
       // Check if the element is being newly created and binding evaluates to false
        if (!binding() && !element.element.isConnected) element.replaceWith = comment
        if (comment.isConnected && binding()) comment.replaceWith(element.element)
        if (element.element.isConnected && !binding()) element.element.replaceWith(comment)
    });
  },
};
