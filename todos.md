# Todos
## Ideas that come into my mind while coding but don't want to get distracted from the main task hehe

- IMPORTANT: cleanup and organize selector proxy

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