import { appendChildren, hydrate } from "./shared.js";
import { getRefs, switchProps } from "../utils.js";
import { directives } from "../directives/registerDirectives.js";

class Mountable extends Array {
    mount(component) {
        this.forEach((element) => component(element));
        return this;
    }
}

const getBinding = (element, attributeName, parentCtx) =>
    parentCtx[element.getAttribute(attributeName)];

/**
 *
 * @param {HTMLElement} element
 * @param { Object } parentCtx
 */
const getCtx = (element, parentCtx) => {
    const allAttributes = element.getAttributeNames();
    let ctx = {};

    allAttributes.forEach((attribute) => {
        if (attribute.startsWith("on:"))
            (ctx[attribute.replaceAll(":", "")] = getBinding(
                element,
                attribute,
                parentCtx
            )) && element.removeAttribute(attribute);

        if (attribute.startsWith(":"))
            (ctx[attribute.replaceAll(":", "")] = getBinding(
                element,
                attribute,
                parentCtx
            )) && element.removeAttribute(attribute);
        if (directives.hasOwnProperty(attribute))
            (ctx[attribute] = getBinding(element, attribute, parentCtx)) &&
                element.removeAttribute(attribute);
    });
    return ctx;
};

const createSelectProxy = (root = document) =>
    new Proxy(
        {},
        {
            get: (_, value) =>
                function (ctx_raw, children_raw = []) {
                    let [ctx, children] = switchProps(ctx_raw, children_raw);
                    const found = [...getRefs(root, value)];
                    let parentScope = value === "createScope" ? ctx : null;

                    found.forEach((element) => {
                        if (parentScope) ctx = getCtx(element, parentScope);

                        hydrate({ element, ctx });

                        appendChildren(element, children);
                        element.$ = createSelectProxy(element);
                        element.mount = function (component) {
                            component(element);
                        };
                        element.props = function (ctx) {
                            hydrate({ element, ctx });
                            appendChildren(element, children);
                        };
                    });
                    return found.length === 1
                        ? found[0]
                        : new Mountable(...found);
                },
        }
    );

export const $ = createSelectProxy();

// $.ref(ctx) ---> hydrates as originally intended
// $.ref().mount(Component())
