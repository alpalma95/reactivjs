import './lib/controllerLoader.js';
import { h } from "./apa/factory.js";
import { stream, hook } from './apa/streams.js';

const $list = stream(
    [{
        id: 1,
        name: 'Antonio'
    },
    {
        id: 2,
        name: 'Álvaro'
    },
    {
        id: 3,
        name: 'Alberto'
    },
    {
        id: 4,
        name: 'María'
    },
    {
        id: 5,
        name: 'Bruno'
    },
    {
        id: 6,
        name: 'Rocío'
    }]
)

const AddBtn = () => {
    let currentId = stream(() =>
        $list.val.length < 1 ? 1 : Math.max(...$list.val.map(person => person.id)) + 1
    )

    const add = () => {
        $list.val = [
            ...$list.val, {
                id: currentId.val,
                name: `Person ${currentId.val}`
            }
        ]
    }
    return h.button({
        onclick: add
    }, ["Add person"])
}

const SortButton = () => {

    function sortList() {
        $list.val = [...$list.val.sort((person1, person2) => person2.id - person1.id)]
        console.log($list.val)
    }

    return h.button({ onclick: sortList }, [
        "Reverse sort"
    ])
}

const deletePerson = (id, e) => {
    e.stopImmediatePropagation()
    $list.val = [...$list.val.filter(p => p.id !== id)]
}

const personView = (person) =>
    h.li({ 'data-key': person.id }, [
        `${person.name} with id ${person.id} `,
        h.button({ onclick: (e) => deletePerson(person.id, e) }, [
            `Delete person ${person.id}`
        ])
    ])

const Counter = (props = {}) => {
    let $count = stream(0)

    let dataClass = {
        'class1' : () => $count.val === 1,
        'class2' : () => $count.val >= 2,
        'class3' : () => $count.val > 3 && $count.val < 10
    }

    return h.button({ ... props, onclick: () => $count.val++ , 'data-class': dataClass}, [
        h.span({ 'data-show': () => $count.val > 0 , 'aria-hidden': () => $count.val === 0 }, ["You clicked "]),
        h.span({ 'data-text': () => $count.val }),
        h.span({ 'data-text': () => $count.val === 1 ? ' time' : ' times', 'data-show': () => $count.val > 0, 'aria-hidden': () => $count.val === 0 })
    ])
}



const App = () => h.div({ 'id': 'app' }, [
    AddBtn(),
    SortButton(),
    h.ul({ 'data-for': [$list, personView], 'data-track-by': 'id' }),
    Counter({'data-whatever': 'test1'}), // to be merged with the root element of the component
    Counter()
])

document.body.appendChild(App())







