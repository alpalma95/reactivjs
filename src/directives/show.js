import { hook } from "../streams.js";
import { doBinding } from "../utils.js";

export const showDirective = {
  selector: "data-show",
  construct: function ({ element }, binding) {
    return hook(() => element.style.display = doBinding(binding, element) ? null : "none");
  },
};
