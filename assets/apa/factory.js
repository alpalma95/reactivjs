import { directives } from "./directives/registerDirectives.js";
import { bindAttribute, registerEffect } from "./utils.js";

const html = (tagName) => {
    return function (props, children = []) {
        
        let element = document.createElement(tagName);
        if (typeof props != 'object') {
            children.push(props)
            props = {};
        }

        for (const attr in props) {
            const currentDirective = directives[attr];
            if ( currentDirective ) {
                let effect = currentDirective.construct(element, props[attr])
                registerEffect(element, effect)
                continue;
            } 

            if ( typeof props[attr] === 'function' && !attr.startsWith('on') ) {
                console.log(props[attr])
                bindAttribute(element, attr, props[attr]);
                continue;
            }

            attr.startsWith('on')
            ? element.addEventListener(attr.slice(2), props[attr])
            : element.setAttribute(attr, props[attr]);
            

           
        }
        if (children.length) {
            children.forEach((child) => {
                let currentNode;

                child instanceof HTMLElement 
                ? currentNode = child 
                : currentNode = document.createTextNode(child)

                element.append(currentNode);
            });
        }
        return element;
    };
};

export const h = new Proxy(
    {},
    {
        get: function (target, value) {
            if (!(value in target)) {
                Reflect.set(target, value, html(value));

                return target[value];
            }
            return target[value];
        },
    }
);