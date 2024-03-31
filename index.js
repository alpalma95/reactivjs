import { h, stream, $ } from "./src";

const $list = stream([
    {
        id: 1,
        name: "Antonio",
    },
    {
        id: 2,
        name: "Álvaro",
    },
    {
        id: 3,
        name: "Alberto",
    },
    {
        id: 4,
        name: "María",
    },
    {
        id: 5,
        name: "Bruno",
    },
    {
        id: 6,
        name: "Rocío",
    },
]);

const AddBtn = () => {
    let currentId = stream(() =>
        $list.val.length < 1
            ? 1
            : Math.max(...$list.val.map((person) => person.id)) + 1
    );

    const add = () => {
        $list.val = [
            ...$list.val,
            {
                id: currentId.val,
                name: `Person ${currentId.val}`,
            },
        ];
    };
    return h.button(
        {
            onclick: add,
        },
        ["Add person"]
    );
};

const SortButton = () => {
    function sortList() {
        $list.val = [
            ...$list.val.sort((person1, person2) => person2.id - person1.id),
        ];
        console.log($list.val);
    }

    return h.button({ onclick: sortList }, ["Reverse sort"]);
};

const deletePerson = (id, e) => {
    e.stopImmediatePropagation();
    $list.val = [...$list.val.filter((p) => p.id !== id)];
};

const personView = (person) =>
    h.li({ "data-key": person.id, 'init': () => console.log('person added id', person.id), 'destroy': () => console.log("person removed id", person.id) }, [
        `${person.name} with id ${person.id} `,
        h.button({ onclick: (e) => deletePerson(person.id, e) }, [
            `Delete person ${person.id}`,
        ]),
    ]);

const Counter = (props = {}) => {
    let $count = stream(0);

    let dataClass = {
        class1: () => $count.val === 1,
        class2: () => $count.val >= 2,
        class3: () => $count.val > 3 && $count.val < 10,
    };

    return h.button(
        { ...props, onclick: () => $count.val++, "data-class": dataClass },
        [
            h.span(
                {
                    "data-show": () => $count.val > 0,
                    "aria-hidden": () => $count.val === 0,
                },
                ["You clicked "]
            ),
            h.span({ "data-text": () => $count.val }),
            h.span({
                "data-text": () => ($count.val === 1 ? " time" : " times"),
                "data-show": () => $count.val > 0,
                "aria-hidden": () => $count.val === 0,
            }),
        ]
    );
};

const TestIf = () => {
    let $count = stream(0);
    return h.div({}, [
        h.button({ onclick: () => $count.val++ }, ["Click me"]),
        h.div({ "data-test": "hi", "data-if": () => $count.val > 0 }, [
            h.span({ "data-text": () => $count.val }),
            h.span({ "data-if": () => $count.val % 2 !== 0 }, [
                " Count is odd",
            ]),
            h.span({ "data-if": () => $count.val % 2 == 0 }, [
                " Count is even",
            ]),
            h.br(),
            h.button({ onclick: () => console.log("clicked") }, [
                h.span({}, [
                    h.span({
                        "data-text": () => {
                            return $count.val % 3 === 0
                                ? "fizz"
                                : $count.val % 5 === 0
                                ? "buzz"
                                : "hi";
                        },
                    }),
                    h.span(
                        {
                            "data-if": () =>
                                $count.val % 5 === 0 && $count.val % 3 === 0,
                        },
                        [" fizzBuzz"]
                    ),
                ]),
            ]),
        ]),
    ]);
};

const App = () =>
    h.fragment([
        h.h2([ 
            "Generated client side"
        ]),
        TestIf(),
        AddBtn(),
        SortButton(),
        h.ul({ "data-for": [$list, personView], "data-track-by": "id"}),
        Counter({ "data-whatever": "test1" }), // to be merged with the root element of the component
        Counter(),
    ]);


const $Counter = function({ $, dataset }) {
    let count = stream(+dataset.initialCount)

    $.count({'data-text': () => count.val, 'data-if': () => count.val > 0}),
    $.incButton({'onclick': () => count.val++})

}

$.app([App()])
// Trying out data-for in SSR
let peopleSSR = stream([])
$.addPersonSSR().mount(function (el) {
    let currentId = stream(() =>
        peopleSSR.val.length < 1
            ? 1
            : Math.max(...peopleSSR.val.map((person) => person.id)) + 1
    );

    const add = () => {
        peopleSSR.val = [
            ...peopleSSR.val,
            {
                id: currentId.val,
                name: `Person ${currentId.val}`,
            },
        ];
    };
    el.props({ onclick: add })
})
$.sortSSR().mount( function (el) {
    function sortList() {
        peopleSSR.val = [
            ...peopleSSR.val.sort((person1, person2) => person2.id - person1.id),
        ];
    }

    el.props({ onclick: sortList })
})
$.Counter({'hi': 'there'}).mount($Counter)
$.peopleSSR().mount( function(element) {
    
    let listItem = (person) => function(item) {
        item.props({'data-key': person.id})
        item.$.personName({'data-text': () => person.name})
        item.$.personId({ 'data-text': () => person.id })
        item.$.deleteBtn({ onclick: () => peopleSSR.val = [...peopleSSR.val.filter((p) => p.id !== person.id)] })
    }
    // important to set track by first if we don't set it on the html
    element.props({'data-track-by': 'id', 'data-for': [peopleSSR, listItem]})

})

