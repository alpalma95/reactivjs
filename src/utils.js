/**
 * In case we don't provide a props object, we make sure that we're operating on a valid object.
 * Otherwise, we'd always need to pass an empty object if we only want to append children.
 * @param {any} props Props to be used as context for the hydration phase
 * @param {Array<HTMLElement>} children Children to be appended to the element we're hydrating
 * @returns 
 */
export const switchProps = (props, children) => {
    if (Array.isArray(props)) {
        children = props;
        props = {};
    }
    return [props, children];
};

/**
 * Will return all elements that are a ref or inside a ref and has special attributes.
 * It will completely reject refs containing the word "Controller", protecting
 * its content from accidentally being selected and hydrated from outside.
 * @param {HTMLElement} root
 * @returns {Array<HTMLElement>}
 */
export const getRefs = (root, selector) => {
    /** @type {TreeWalker} */
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        function (node) {
            if (
                node.getAttribute("ref") == selector ||
                (node.getAttributeNames().some((name) => name.includes(":")) &&
                    selector === "createScope")
            )
                return NodeFilter.FILTER_ACCEPT;
            if (node.getAttribute("ref")?.toUpperCase().includes("CONTROLLER"))
                return NodeFilter.FILTER_REJECT;

            return NodeFilter.FILTER_SKIP;
        }
    );

    const refs = [];

    let currentNode;
    while ((currentNode = walker.nextNode())) refs.push(currentNode);

    return refs;
};

export const doBinding = (binding, element) =>
    typeof binding === "function" ? binding(element) : binding.val ?? binding;
