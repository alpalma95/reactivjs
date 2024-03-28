import { classDirective } from "./class.js";
import { forDirective } from "./for.js";
import { ifDirective } from "./if.js";
import { showDirective } from "./show.js";
import { textDirective } from "./text.js";

const directivesRaw = [
  forDirective,
  textDirective,
  classDirective,
  showDirective,
  ifDirective,
];
export const directives = Object.fromEntries(
  directivesRaw.map((directive) => [directive.selector, directive])
);
