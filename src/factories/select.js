import { appendChildren, hydrate } from "./shared.js";
import { getRefs, switchProps } from "../utils.js";

class Mountable extends Array {
    mount(component) {
        this.forEach((element) => component(element));
        return this;
    }
}

/**
 * Create a context for hydrating a specific element
 * based on the context of the parent element in which
 * we're createing the context / scope
 * @param {HTMLElement} element
 * @param { Object } parentCtx
 */
const getCtx = (element, parentCtx) => {
    let ctx = {};
    element.getAttributeNames()?.forEach((attribute) => {
        if (attribute.startsWith(":"))
            (ctx[attribute.replaceAll(":", "")] =
                parentCtx[element.getAttribute(attribute)]) &&
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
