![ReactivJS, or the modern jQuery](logos/logo_big.png)

Minimalistic reactivity engine for CSR and SSR (**~5kb** minified, and **~2kb** minified + gzipped). Heavily inspired by **Stimulus**, **AlpineJS** and **VanJS**.

Bring your static HTML to life or create interactive client-side rendered islands _on the fly_. No build step unless you want to!

# Table of contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Basic usage and common API](#basic-usage-and-common-api)
    - [Reactivity](#reactivity)
    - [Accessing and creating elements](#accessing-and-creating-elements)
    - [Hydrating elements](#hydrating-elements)
    - [Client Side Rendering specifics](#client-side-rendering-specifics)
    - [Server Side Rendering specifics](#server-side-rendering-specifics)
- [Directives](#directives)
    - [rv-text](#rv-text)
    - [rv-if](#rv-if)
    - [rv-show](#rv-show)
    - [rv-for](#rv-for)
    - [rv-class](#rv-class)
    - [rv-model](#rv-model)
    - [Custom directives](#custom-directives)
- [Magic methods](#magic-methods)
- [Safely removing elements from the DOM](#safely-removing-elements-from-the-dom)
- [Why ReactivJS?](#why-reactivjs)
- [How to contribute](#how-to-contribute)

# Introduction
ReactivJS is a tiny and lightweight library that allows you to create your frontend applications in the way you prefer: hydrating static HTML rendered by a server or creating interactive client-side rendered islands on the fly. It also aims to close the gap between these two approaches by providing a deliberatively similar API:

## Client Side Rendering
```javascript
// Creating a JS component
import { h, stream } from '@reactivjs/reactivjs';

const Counter = () => {
    // Streams are reactive values
    const count = stream(0)
    
    // HTML elements are created trhough the `h` proxy 
    // (kudos to VanJS for the brilliant idea)
    return h.button({ onclick: () => count.val++ }, [
        "Count is: ", h.span({ 'rv-text': () => count.val })
    ])
}

// Returned elements are valid HTML elements
document.body.appendChild(Counter())
```
## Server Side Rendering
```javascript
// Hydrating a static HTML component
import { $ } from '@reactivjs/reactivjs';

const count = stream(0);

// Selecting an HTML element with 'data-ref' attribute of 'button'
$.button({ onlick: () => count.val++ })
$.counter({ 'rv-text': () => count.val })
```

> [!NOTE]
> Examples were chosen to illustrate the shared API of CRS and SSR. Please refer to the specific sections for more details on how we attempt to make each one more ergonomic.

[Back to top](#table-of-contents)
# Installation

```bash
npm install @reactivjs/reactivjs
```

```bash
yarn add @reactivjs/reactivjs
```

```bash
pnpm add @reactivjs/reactivjs
```

And so on. Or simply import all you need from a CDN:
`https://unpkg.com/@reactivjs/reactivjs@1.2.0/dist/reactivjs.es.min.js`

[Back to top](#table-of-contents)
# Basic usage and common API
The idea is fairly simple. Everything is created dynamically at runtime with a proxy (kudos to VanJS for the brilliant idea), returning a function that is expected to be called with a context and a list of children (both optional). In the case of CSR, this proxy is `h`, and in the case of SSR, it is `$`. In both cases, this function will return a valid HTML element.

[Back to top](#table-of-contents)
## Reactivity
The `stream` function is the main way to create reactive values. It can be either a primitive or an object literal. Then, to make an effect happen every time the value changes, you just need to pass the callback to the `hook` function, making sure you access the reactive value so the effect can be correctly registered. Both `stream` and `hook` are exported from StreamJS.

Quick example (however, please make sure you check out the [StreamsJS](https://github.com/alpalma95/streams) documentation for more details):

```javascript
const count = stream(1);
const double = stream(() => count.val * 2);

const myEffect = hook(() => console.log(`Count is: ${count.val} and double is: ${double.val}`));
// Logs "Count is: 1 and double is: 2" when first declared

count.val++; // Logs "Count is: 2 and double is: 4"

myEffect.unhook();
count.val++; // Count value will be 3 and double will be 6, but won't log anything
```

Under the hood, all built-in directives are just wrappers around this mechanism, ensuring that all effects are properly registered and cleaned up when needed.

> [!NOTE]
> For more examples and information, please make sure you check [StreamsJS](https://github.com/alpalma95/streams) (and maybe give it a star? hehe). Any contribution to that will help ReactivJS as well!

[Back to top](#table-of-contents)
## Accessing and creating elements
When accessing the `h` proxy, the type of HTML element returned will match the name you're accessing (e.g.: `h.button()` will return a `<button>` element). In the case of the `$` proxy, it will select an element exiting in the DOM with the given `data-ref` attribute (e.g.: `$.button()` will select all the `<button data-ref="button">` elements in the DOM).

```javascript
import { h, $ } from '@reactivjs/reactivjs';

const CSRButton = () => h.button(); // returns a valid HTMLButtonElement created on the client
const SSRButton = () => $.button(); // returns a valid HTMLButtonElement or Array<HTMLButtonElement> if there are multiple elements with the same data-ref attribute, selected from the existing DOM
```

[Back to top](#table-of-contents)
## Hydrating elements
The magic happens when you provide a context. It can look like this:

```javascript
import { h, $, stream } from '@reactivjs/reactivjs';

const reactiveText = stream('Hello world!');
const reactiveBoolean = stream(true);

const ctx = {
    class: 'my-paragraph', // this will be set as a static attribute, notice that you can use any valid HTML attribute
    onmouseover: () => console.log('hovered!') // this will be attached as an event listener, notice how it starts with 'on' -> this is the general rule and it works also for custom events
    'rv-text': () => reactiveText.val // a directive, more on those later
    'aria-hidden': () => reactiveBoolean.val // a dynamic directive whose value will be updated when the booleanVariable changes
}

document.body.appendChild( h.p(ctx) ); // Will append a paragraph with all the bindings applied
$.p(ctx); // Will apply the bindings to all the elements with the data-ref attribute set to "p"

```
[Back to top](#table-of-contents)
## Appending elements
We just need to pass an array of elements as a second argument (or first, if you don't provide a context).

```javascript
import { h, $ } from '@reactivjs/reactivjs';

h.button([
    h.span(['Hello world!'])
])

$.button([
    h.span(['Hello world!']) // Notice how we're appending a child element generated client side with the h proxy
])
```
[Back to top](#table-of-contents)
## Client Side Rendering specifics

[Back to top](#table-of-contents)
## Server Side Rendering specifics

[Back to top](#table-of-contents)
# Directives

[Back to top](#table-of-contents)
## rv-text

[Back to top](#table-of-contents)
## rv-if

[Back to top](#table-of-contents)
## rv-show

[Back to top](#table-of-contents)
## rv-for

[Back to top](#table-of-contents)
## rv-class

[Back to top](#table-of-contents)
## rv-model

[Back to top](#table-of-contents)
## Custom directives

[Back to top](#table-of-contents)
# Magic methods
At the moment, there are only two magic methods: `init` and `destroy`. They both expect a function as a value. `init` will be called right before the element is returned from the `h` or `$` proxies, and `destroy` will be called when the element is removed from the DOM by the `rv-if` and `rv-for` directives.

```javascript
import { h, $ } from '@reactivjs/reactivjs';

h.button({ 
    'init': () => console.log('Element initialized!'),
    'destroy': () => console.log('Element destroyed!')
})
```

[Back to top](#table-of-contents)
# Safely removing elements from the DOM


# Why ReactivJS?
Yup, yet another JavaScript library. However, bear with me for a second.
ReactivJS was born under the premise that "you don't need a framework" for building interactive web applications. All you need is the native web platform and to embrace a path of discovery and experimentation.

Well, I changed my mind along the way. While the deeper insights shall belong to another article, I can put it in the following way for the time being: as much as you love coding and experimenting with the platform, we all cannot afford to do things from scratch over and over again. 

Building internal *ad-hoc* libraries (original conception of ReactivJS) can be nice. But when you put a lot of work into something (testing included) and publish it on NPM, you can better reuse it. Hopefully, you can also share your work with others who may benefit from it as well. Yikes, I think I just described the whole idea of a library.

Now, I'm not sure, but the conclusion I've reached after some research is that ReactivJS is the only reactive library so far that checks all the boxes:

- It's _extremely_ small (~**2kb** minified + gzipped).
- It doesn't interfere much with your way of building the web.
- It allows you to hydrate the parts that you need or want to be SSR, with the backend of your choice; and create JavaScript islands when you feel it's right. Everything with an almost identical API and with a seamless integration with one another.
- Easy to use and to extend with your own directives or other libraries.
- 100% declarative, with reactivity powered by another tiny library [StreamsJS](https://github.com/alpalma95/streams)...
-  ... Which, btw, would be the only external dependency. Everything stays at home ☺️

Nonetheless, I don't think any of the reasons above are as important as the following: Building ReactivJS brought me _joy_. It's a library whose source code I can understand, I can maintain and I have fun with.

See, I believe every library and framework is more of a creative exercise on how someone would like the web to be. It is beautiful that we have a new framework coming out "every day". Every day, someone is trying to share their vision about how they believe the web could be more friendly and more accessible to everyone.

ReactivJS is, to wrap up, my attempt to do the same. I hope someone will find their ideas represented here and will be inspired to contribute to the project. Everyone is welcome! <3

[Back to top](#table-of-contents)
# How to contribute
I'm still working on setting the GitHub actions to build and publish the library automatically. For the time being, we can follow a very rudimentary workflow:
- Check the open issues or create your own
- Fork the repository
- Either run `bun install` or `npm install` to install the dependencies
- Run `bun dev` or `npm run dev:node` to start the development server

> [!NOTE]
> At the moment, the assets are served from the vite server, but the actual "HTML" server is made with PHP. Either run `php -S localhost:XXXX` (no specific port number needed) or feel free to create your own example server (but don't commit it!).

- Do your proposed changes in a new branch
- Run `bun test` or `npm run test` to make sure everything is working
- Create a pull request and please be patient and kind 😃

[Back to top](#table-of-contents)

# Acknowledgments
Remember: ReactivJS is not here to compete with any other library. It is more like a proof of concept that I turned out to be proud of. The following projects inspired me, from ideas to code. I cannot but recommend you to check them out in case they align better with your vision of the web (and also please do drop them a star!):

- [VanJS](https://github.com/vanjs/van): Brilliant use of the Proxy API. I also learned a lot about how to optimize JavaScript to cut down dramatically the bundle size. Super minimalistic, lightweight and easy to use when you want to create CSR applications without the need to use a big framework.
- [AlpineJS](https://github.com/alpinejs/alpine): Ideal solution for when you want a battle-tested library to make your SSR HTML feel like a modern framework.
- [Stimulus](https://github.com/hotwired/stimulus): It gave me the idea of the Controllers for the SSR API. I love their HTML-first and no-build-first approaches.
- [Petite Vue](https://github.com/vuejs/petite-vue): Subset of Vue optimized for progressive enhancement. I grabbed some inspiration for the `Block` part and the `rv-if` directive.
