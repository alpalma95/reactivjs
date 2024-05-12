import { hook } from "@reactivjs/streams";
import { doBinding } from "../utils.js";

export const showDirective = {
  selector: "rv-show",
  construct: function ({ element }, binding) {
    return hook(() => element.style.display = doBinding(binding, element) ? null : "none");
  },
};
