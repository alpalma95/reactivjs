
import { registerDirectives, h, stream, $, hook} from "./src";

export const customDirective = {
    selector: "rv-custom",
    construct: function ({ element }, args) {
        console.log(element, "custom directive working!", args)
    },
  };

registerDirectives(customDirective)


// const $list = stream([
//     {
//         id: 1,
//         name: "Antonio",
//     },
//     {
//         id: 2,
//         name: "Álvaro",
//     },
//     {
//         id: 3,
//         name: "Alberto",
//     },
//     {
//         id: 4,
//         name: "María",
//     },
//     {
//         id: 5,
//         name: "Bruno",
//     },
//     {
//         id: 6,
//         name: "Rocío",
//     },
// ]);

// const AddBtn = () => {
//     let currentId = stream(() =>
//         $list.val.length < 1
//             ? 1
//             : Math.max(...$list.val.map((person) => person.id)) + 1
//     );

//     const add = () => {
//         $list.val = [
//             ...$list.val,
//             {
//                 id: currentId.val,
//                 name: `Person ${currentId.val}`,
//             },
//         ];
//     };
//     return h.button(
//         {
//             onclick: add,
//             "rv-custom": "t"
//         },
//         ["Add person"]
//     );
// };

// const SortButton = () => {
//     function sortList() {
//         $list.val = [
//             ...$list.val.sort((person1, person2) => person2.id - person1.id),
//         ];
//     }

//     return h.button({ onclick: sortList }, ["Reverse sort"]);
// };

// const deletePerson = (id, e) => {
//     e.stopImmediatePropagation();
//     $list.val = [...$list.val.filter((p) => p.id !== id)];
// };

// const personView = (person) =>
//     h.li({ "data-key": person.id, 'destroy': () => console.log("person removed id", person.id) }, [
//         `${person.name} with id ${person.id} `,
//         h.button({ onclick: (e) => deletePerson(person.id, e) }, [
//             `Delete person ${person.id}`,
//         ]),
//     ]);

// const Counter = (props = {}) => {
//     let $count = stream(0);

//     let zClass = {
//         class1: () => $count.val === 1,
//         class2: () => $count.val >= 2,
//         class3: () => $count.val > 3 && $count.val < 10,
//     };

//     return h.button(
//         { ...props, onclick: () => $count.val++, "rv-class": zClass },
//         [
//             h.span(
//                 {
//                     "rv-show": () => $count.val > 0,
//                     "aria-hidden": () => $count.val === 0,
//                 },
//                 ["You clicked "]
//             ),
//             h.span({ "rv-text": () => $count.val }),
//             h.span({
//                 "rv-text": () => ($count.val === 1 ? " time" : " times"),
//                 "rv-show": () => $count.val > 0,
//                 "aria-hidden": () => $count.val === 0,
//             }),
//         ]
//     );
// };

// const TestIf = () => {
//     let $count = stream(0);
//     return h.div({}, [
//         h.button({ onclick: () => $count.val++ }, ["Click me"]),
//         h.div({ "data-test": "hi", "rv-if": () => $count.val > 0 }, [
//             h.span({ "rv-text": () => $count.val }),
//             h.span({ "rv-if": () => $count.val % 2 !== 0 }, [
//                 " Count is odd",
//             ]),
//             h.span({ "rv-if": () => $count.val % 2 == 0 }, [
//                 " Count is even",
//             ]),
//             h.br(),
//             h.button({ onclick: () => console.log("clicked") }, [
//                 h.span({}, [
//                     h.span({
//                         "rv-text": () => {
//                             return $count.val % 3 === 0
//                                 ? "fizz"
//                                 : $count.val % 5 === 0
//                                 ? "buzz"
//                                 : "hi";
//                         },
//                     }),
//                     h.span(
//                         {
//                             "rv-if": () =>
//                                 $count.val % 5 === 0 && $count.val % 3 === 0,
//                         },
//                         [" fizzBuzz"]
//                     ),
//                 ]),
//             ]),
//         ]),
//     ]);
// };

// const App = () =>
//     h.fragment([
//         h.h2([ 
//             "Generated client side"
//         ]),
//         TestIf(),
//         AddBtn(),
//         SortButton(),
//         h.ul({ "rv-for": [$list, personView], "data-track-by": "id"}),
//         Counter({ "data-whatever": "test1" }), // to be merged with the root element of the component
//         Counter(),
//     ]);


// const nums = stream([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
// const template = (item, i) => h.li({'data-key': item.val}, [item.val, ` at index ${i}`])
// const Test = () => {
//     return h.ul({'data-track-by': 'val', 'rv-for': [nums, template, (n) => ({val: n})]})
// }

// setTimeout(() => {
//     nums.val = [...nums.val, 11]
// }, 1000);

// $.app([Test()])

let test = stream(true)

let chb = () => {
    return h.input({ type: 'checkbox', 'rv-model': test })
}
let s = () => {
    let selected = stream("")
    let f = h.fragment([
        "selected: ", ()=> selected.val,
        h.select({ 'rv-model': selected }, [
            h.option({ value: "" }, [""]),
            h.option({ value: "a" }, ["a"]),
            h.option({ value: "b" }, ["b"]),
            h.option({ value: "c" }, ["c"]),
        ])

    ])
    return f
}

let r = () => {
    let selected = stream(0)
    let f = h.fragment([
        "selected: ", ()=> selected.val,
        h.input({ type: 'range', 'rv-model': selected, min: 0, max: 10, step: 1 })
    ])
    return f
}

hook(() => console.log(test.val))

$.app([chb(), s(), r()])

// $.count({ 'rv-text': () => "hi" }) // this won't affect the count refs inside counter controller
$.CounterController().mount(function({ $, dataset }) {
    let count = stream(+dataset.initialCount)
    $.createScope({ 
        count,
        inc: ({ currentTarget }) => count.val += +currentTarget.dataset.incrementBy,
        showHidden: () => count.val > 0 && count.val % 2 === 0
    })
})

$.FormController().mount( ({ $ }) => {
    const text = stream('')

    $.createScope({ text, clear: () => text.val = '' })
})

let ssr_people = stream([])
const PersonItemController = (person) => ({ $ }) => {
    $.createScope({
        name: person.name,
        id: person.id,
        deletePerson: () => ssr_people.val = [... ssr_people.val.filter((p) => p.id != person.id)]
    })
}

const transformFn = (item) => ({...item, test: true})

$.SSR({ 'rv-for': [ssr_people, PersonItemController, transformFn] })

setTimeout(() => {
    ssr_people.val = [...ssr_people.val, {id: 4, name: "Test 4"}]
}, 3000);