import { hook } from "@reactivjs/streams";
import { safeRemove } from "../factories/effectsManager.js";
import { attachMagics } from "../factories/selectFactory.js";

/**
 * @param {Array} array
 * @param {HTMLElement} DOMNode
 * @param {(arg?: any) => any} template
 */
const diffList = (array, DOMNode, template) => {
    const children = DOMNode.children;
    const { trackBy } = DOMNode.dataset;

    if (array.length < children.length) {
        const deleted = [...children].filter(
            (node) =>
                !array.some((element) => node.dataset.key == element[trackBy])
        );

        deleted.forEach((node) => {
            safeRemove(
                DOMNode.querySelector(`[data-key="${node.dataset.key}"]`)
            );
        });
    }

    array.forEach((element, index) => {
        if (!children[index]) DOMNode.appendChild(template(element));

        const isEqual = element[trackBy] == children[index].dataset.key;
        const areSameLength = array.length === children.length;
        const queryStr = `[data-key="${element[trackBy]}"]`;

        if (!isEqual && areSameLength) {
            const newNode =
                DOMNode.querySelector(queryStr) ?? template(element);
            DOMNode.replaceChild(newNode, children[index]);
        }
        if (!isEqual && !areSameLength) {
            const newNode =
                DOMNode.querySelector(queryStr) ?? template(element);
            DOMNode.insertBefore(newNode, children[index]);
        }
    });
};

const getTemplateFromDOM = (HTMLElement, refController) => {
    // It might happen that the backend sends an empty list. If that's the case,
    // look for a template element (if using a templating engine this repetition
    // is acceptable)
    const clone =
        HTMLElement.children[0]?.cloneNode(true) ??
        HTMLElement.querySelector("template").content.children[0];

    attachMagics(clone);

    return (ArrayElement) => {
        refController(ArrayElement)(clone);
        return clone;
    };
};

export const forDirective = {
    selector: "rv-for",
    construct: function ({ element: listContainer }, args) {
        let [arr, template, fn] = args;
        let ssr_template;

        if (listContainer.dataset?.populate) {
            const raw_list = JSON.parse(listContainer.dataset.populate);
            arr.val = fn ? raw_list.map(fn) : raw_list;
            listContainer.removeAttribute("data-populate");
            ssr_template = getTemplateFromDOM(listContainer, template);
        }
        if (ssr_template) {
            // At this point, state and child nodes should be the same length
            arr.val.forEach((listItem, index) => {
                const currentChild = listContainer.children[index];
                attachMagics(currentChild);
                template(listItem)(currentChild);
            });
        }

        return hook(() => {
            diffList(arr.val, listContainer, ssr_template ?? template);
        });
    },
};
