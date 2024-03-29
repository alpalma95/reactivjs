import { hook } from "../streams.js";

export const textDirective = {
  selector: "data-text",
  construct: function ({ element }, binding) {
    return hook(() => {
      /**
       * In case the element is being conditionally rendered or the value hasn't changed,
       * we will prevent its content from being updated
       */
      if (element.textContent === binding(element) || element instanceof Comment) return;
      element.textContent = binding(element);
    });
  },
};
