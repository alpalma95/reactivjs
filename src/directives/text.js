import { hook } from "../streams.js";

export const textDirective = {
  selector: "data-text",
  construct: function ({ element }, binding) {
    return hook(() => {
      /**
       * In case the element is being conditionally rendered or the value hasn't changed,
       * we will prevent its content from being updated
       */
      let value = typeof binding === 'function' ? binding(element) : binding?.val ?? binding
      if (element.textContent === value || element instanceof Comment) return;
      element.textContent = value;
    });
  },
};
