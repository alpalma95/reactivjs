import { hook } from "@reactivjs/streams";
import { doBinding } from "../utils.js";

export const classDirective = {
  selector: "rv-class",
  construct: function ({element}, classObject) {

    let effects = Object.entries(classObject).reduce((effects, [className, binding]) => {
      let effect = hook(() => {
        if (!element.classList.contains(className) && doBinding(binding, element))
          element.classList.add(className);

        if (element.classList.contains(className) && !doBinding(binding, element))
          element.classList.remove(className);
      });

      effects.push(effect);
      return effects;
    }, []);

    return effects;
  },
};
