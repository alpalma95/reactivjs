import { it } from "vitest";
import { h, safeRemove, stream } from "../../src";

describe('rv-if directive', () => {
    const showElement = stream(true);
    const textContent = stream('test');
    const element = h.div({ id: 'test', 'rv-if': () => showElement.val }, [
        () => textContent.val
    ]);

    const showElement2 = stream(false);
    const textContent2 = stream('test');
    const element2 = h.div({ id: 'test2', 'rv-if': () => showElement2.val }, [
        () => textContent2.val
    ]);

    const showParent = stream(true);
    const showChild = stream(false);
  
    const NestedElement = () => {
        return h.div({ id: 'parent', 'rv-if': () => showParent.val }, [
            h.div({ id: 'child', 'rv-if': () => showChild.val })
        ])
    }

    const showParent2 = stream(false);
    const showChild2 = stream(true);
  
    const NestedElementHidden = () => {
        return h.div({ id: 'parent2', 'rv-if': () => showParent2.val }, [
            h.div({ id: 'child2', 'rv-if': () => showChild2.val })
        ])
    }

    document.body.appendChild(element);
    document.body.appendChild(element2);
    document.body.appendChild(NestedElement());
    document.body.appendChild(NestedElementHidden());

    it('render the element initially if the value is true', () => {
        expect(document.getElementById('test')).toBeTruthy();
    })

    it('should remove the element from the DOM if the value is false', () => {
        showElement.val = false;
        expect(document.getElementById('test')).toBeFalsy();
    })

    it('should attach the element to the DOM again if the value is true', () => {
        showElement.val = true;
        expect(document.getElementById('test')).toBeTruthy();
    })

    it('should keep updating the text content even if it is not attached to the DOM', () => {
        showElement.val = false;
        textContent.val = 'new text';
        expect(element.textContent).toBe('new text');
    })

    it('should attach the element to the DOM again with the updated text content', () => {
        showElement.val = true;
        expect(document.getElementById('test').textContent).toBe('new text');
    })

   it('should attach a comment instead of the element if the value is false', () => {
        expect(document.getElementById('test2')).toBeFalsy();
   })

   it('should attach the element to the DOM again if the value is true', () => {
        showElement2.val = true;
        expect(document.getElementById('test2')).toBeTruthy();
   })

    it('should work with nested elements when parent if originall visible', () => {
        expect(document.getElementById('parent')).toBeTruthy();
        expect(document.getElementById('child')).toBeFalsy();
        showParent.val = false;
        expect(document.getElementById('parent')).toBeFalsy();
        expect(document.getElementById('child')).toBeFalsy();
        showParent.val = true;
        showChild.val = true
        expect(document.getElementById('parent')).toBeTruthy();
        expect(document.getElementById('child')).toBeTruthy();
    })

    it('should work with nested elements when parent if originall hidden', () => {
        expect(document.getElementById('parent2')).toBeFalsy();
        expect(document.getElementById('child2')).toBeFalsy();
        showParent2.val = true;
        expect(document.getElementById('parent2')).toBeTruthy();
        expect(document.getElementById('child2')).toBeTruthy();
        showChild2.val = false
        expect(document.getElementById('parent2')).toBeTruthy();
        expect(document.getElementById('child2')).toBeFalsy();
    })
})