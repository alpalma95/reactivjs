import { hook } from "../streams.js";
import { isTruthy } from "../utils.js";

export const showDirective = {
  selector: "data-show",
  construct: function ({ element }, binding) {
    return hook(() => element.style.display = isTruthy(binding, element) ? null : "none");
  },
};
