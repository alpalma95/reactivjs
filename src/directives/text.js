import { hook } from "apajs-streams";
import { doBinding } from '../utils.js'

export const textDirective = {
  selector: "rv-text",
  construct: function ({ element }, binding) {
    return hook(() => {
      /**
       * In case the element is being conditionally rendered or the value hasn't changed,
       * we will prevent its content from being updated
       */
      if (element.textContent === doBinding(binding, element) || element instanceof Comment) return;
      element.textContent = doBinding(binding, element);
    });
  },
};
