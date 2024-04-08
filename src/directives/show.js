import { hook } from "apajs-streams";
import { doBinding } from "../utils.js";

export const showDirective = {
  selector: "z-show",
  construct: function ({ element }, binding) {
    return hook(() => element.style.display = doBinding(binding, element) ? null : "none");
  },
};
