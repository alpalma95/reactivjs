# Todos
## Ideas that come into my mind while coding but don't want to get distracted from the main task hehe

- data-for: refactor logic for SSR list. So far it works, but: 1) code is a bit messy and 2) the ref name gets changed with the key. Not a big deal though, but I'd rather it be more coherent

- data-for: when sorting, the first element gets replaced first hence it needs to be created at the end of the diffing.
easy to work around and not really expensive, so holding it for now

- on elements factory, create special element for bind text content automatically (returns text node with value binded??)
    - on select factory, replace ${} with said text node (not sure though... we'll see) maybe putting the name of a reactive variable that will hold the effect itself
    - note: not {{ }} like in vue because it could easily conflict with backend templating engines

- if context/props is not object, always append it as child (either html element or string)

- on each effect, look if the element still exists, else remove all effects associated with it
> DOM should be a representation of the state. It's not a good idea to remove elements in any other way. For the time being, the exported safeRemove function should do the work