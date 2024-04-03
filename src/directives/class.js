import { hook } from "../streams.js";
import { isTruthy } from "../utils.js";

export const classDirective = {
  selector: "data-class",
  construct: function ({element}, classObject) {
    const effects = [];
    for (let [className, binding] of Object.entries(classObject)) {
      let effect = hook(() => {

        if (!element.classList.contains(className) && isTruthy(binding, element))
          element.classList.add(className);

        if (element.classList.contains(className) && !isTruthy(binding, element))
          element.classList.remove(className);
      });

      effects.push(effect);
    }

    return effects;
  },
};
