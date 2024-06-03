import { hook } from "@reactivjs/streams";
import { doBinding } from "../utils.js";

export const textDirective = {
    selector: "rv-text",
    construct: function (block, binding) {
        let text = null;
        if (block.element.tagName?.toLowerCase() === this.selector) {
            text = new Text();
            block.element.replaceWith(text);
        }

        return hook(() => {
            /**
             * In case the element is being conditionally rendered or the value hasn't changed,
             * we will prevent its content from being updated
             */
            if (
                block.element.textContent ===
                    doBinding(binding, block.element) ||
                text?.textContent === doBinding(binding, block.element) ||
                block.element instanceof Comment
            )
                return;

            text
                ? (text.textContent = doBinding(binding, text))
                : (block.element.textContent = doBinding(
                      binding,
                      block.element
                  ));
        });
    },
};
