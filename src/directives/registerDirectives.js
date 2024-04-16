import { classDirective } from "./class.js";
import { forDirective } from "./for.js";
import { ifDirective } from "./if.js";
import { modelDirective } from "./model.js";
import { showDirective } from "./show.js";
import { textDirective } from "./text.js";

const directivesRaw = [
    forDirective,
    textDirective,
    classDirective,
    showDirective,
    ifDirective,
    modelDirective,
];
export const directives = Object.fromEntries(
    directivesRaw.map((directive) => [directive.selector, directive])
);

/**
 * Given a list of directives, it'll register them to be used during hydration.
 * @param  {...any} directivesRaw 
 */
export const registerDirectives = (...directivesRaw) => {
    directivesRaw.forEach(
        (directive) => (directives[directive.selector] = directive)
    );
};
