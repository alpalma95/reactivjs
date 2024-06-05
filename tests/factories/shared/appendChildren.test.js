import { appendChildren } from "../../../src/factories/shared";
import { h } from "../../../src";

describe('appendChildren', () => {
  it('should append children to a parent', () => {
    const parent = h.ul()
    const children = [h.li(), h.li()];
    appendChildren(parent, children);
    expect([...parent.children]).toEqual(children);
  });

  it('should append a text node if the type of the child is string', () => {
    const parent = h.p();
    const children = ['a', 'b'];
    appendChildren(parent, children);
    expect(parent.textContent).toBe('ab');
  })

  it('should append a text node if the type of the child is number', () => {
    const parent = h.p();
    const children = [1, 2];
    appendChildren(parent, children);
    expect(parent.textContent).toBe('12');
  })

  it('should append a text node if the type of the child is boolean', () => {
    const parent = h.p();
    const children = [true, false];
    appendChildren(parent, children);
    expect(parent.textContent).toBe('truefalse');
  })

  it('should append a text node if the type of the child is null', () => {
    const parent = h.p();
    const children = [null, null];
    appendChildren(parent, children);
    expect(parent.textContent).toBe('nullnull');
  })

  it('should append a comment if the type of the child is comment', () => {
    const parent = h.p();
    const children = [new Comment('a')];
    appendChildren(parent, children);

    expect(parent.innerHTML).toBe('<!--a-->');
  })

  it('should append a document fragment if the type of the child is document fragment', () => {
    const parent = h.div();
    const children = [h.fragment([
        h.p(["Hello world"]),
    ])];

    appendChildren(parent, children);
    expect(parent.innerHTML).toBe('<p>Hello world</p>');
  })

  it('should append a text node if the type of the child is function', () => {
    const parent = h.p();
    const children = [() => "I'm a function"];
    appendChildren(parent, children);
    expect(parent.textContent).toBe("I'm a function");
  })

  it('should skip undefined without throwing an error', () => {
    const parent = h.p();
    const children = [undefined];
    appendChildren(parent, children);
    expect(parent.textContent).toBe('');
  })
});