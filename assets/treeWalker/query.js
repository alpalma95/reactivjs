/**
 * This callback is displayed as part of the Requester class.
 * @callback LoopCallback
 * @param {HTMLElement} element
 * @returns {void}
 */

export function select(selector = '*') {
    return {
        _nodes: [],
        _walker: null,
        _root: document.body,
        _nodeType: selector === '*'
            ? NodeFilter.SHOW_ALL
            : NodeFilter.SHOW_ELEMENT,

        _filter: (node) => {
            return selector === '*' || node.matches(selector)
                ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
        _createWalker() {
            this._walker = document.createTreeWalker(this._root, this._nodeType, this._filter)
        },
        where(cb) {
            this._filter = function (node) {
                return cb(node) && (selector === '*' || node.matches(selector))
                    ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            return this;
        },
      
        from(root) {
            this._root = root;
            return this;
        },

        /** @param {LoopCallback} cb */
        do(cb) {
            this._createWalker();
            let currentNode;
            let i = 0
            while (currentNode = this._walker.nextNode()) {
                cb(currentNode, i); i++
                console.log(this._walker.nextNode())
            };
        },
        /** @returns {Array<HTMLElement>} */
        fetchAll() {
            this._createWalker();

            let currentNode;
            while (currentNode = this._walker.nextNode()) this._nodes.push(currentNode)
            return this._nodes;
        },
        /** @returns {HTMLElement} */
        fetchOne() {
            this._createWalker();
            return this._walker.nextNode()
        }
    }
}