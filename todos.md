# Todos
## Ideas that come into my mind while coding but don't want to get distracted from the main task hehe

- Add 'ondestroy' magic method
    - call on safeRemove and on data-if

- For ssr, automatically select elements by reference. Eg:
    - counter
    - counter.count
    - counter.incButton
    - ...
- These should be registered in some sort of a module (kind of like alpine components???)

- pass element to directive callback
- when using $ proxy, if child instance of htmlelement, append to parent and continue selecting
- when data-for list is generated server side, automatically populate the state to be synced
    - if that's the case, we don't provide a template, but it's generated based on a given html element
    - create function 'createFromTemplate' -> creates a virtual copy to be used in the data-for element

- on select factory, if !props and !children use it just as a query selector (ie: return the element with given ref)