# Todos
## Ideas that come into my mind while coding but don't want to get distracted from the main task hehe

- when data-for list is generated server side, automatically populate the state to be synced
    - if that's the case, we don't provide a template, but it's generated based on a given html element. Instead we provide a hydration component
    - create function 'createFromTemplate' -> creates a virtual copy to be used in the data-for element (created from document fragment)

- data-for: when sorting, the first element gets replaced first hence it needs to be created at the end of the diffing.
easy to work around and not really expensive, so holding it for now

- on elements factory, create special element for bind text content automatically (returns text node with value binded??)
    - on select factory, replace ${} with said text node (not sure though... we'll see) maybe putting the name of a reactive variable that will hold the effect itself
    - note: not {{ }} like in vue because it could easily conflict with backend templating engines

- if context/props is not object, always append it as child (either html element or string)

- on each effect, look if the element still exists, else remove all effects associated with it
> DOM should be a representation of the state. It's not a good idea to remove elements in any other way. For the time being, the exported safeRemove function should do the work