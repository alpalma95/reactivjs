import { h, stream } from "../../src";

describe("for directive", () => {
    const items = stream([
        { id: 1, name: "one" },
        { id: 2, name: "two" },
        { id: 3, name: "three" },
    ]);
    const template = (item) => h.li({ "data-key": item.id }, [item.name]);
    const element = h.ul({
        "rv-for": [items, template],
        "data-track-by": "id",
    });

    beforeEach(() => {
        items.val = [
            { id: 1, name: "one" },
            { id: 2, name: "two" },
            { id: 3, name: "three" },
        ];
    });

    it("should render the items", () => {
        expect(element.children.length).toBe(items.val.length);
        [...element.children].forEach((child, index) => {
            expect(+child.dataset.key).toBe(items.val[index].id);
            expect(child.innerHTML).toBe(items.val[index].name);
        });
    });

    it("should append a new child at the end", () => {
        items.val = [...items.val, { id: 4, name: "four" }];
        expect(element.children.length).toBe(items.val.length);
        expect(element.children[3].innerHTML).toBe("four");
    });

    it("should delete a child without altering the order", () => {
        items.val = [...items.val.filter((item) => item.id !== 2)];
        expect(element.children.length).toBe(items.val.length);
        expect(element.querySelector('[data-key="2"]')).toBeNull();

        [...element.children].forEach((child, index) => {
            expect(+child.dataset.key).toBe(items.val[index].id);
            expect(child.innerHTML).toBe(items.val[index].name);
        });
    });

    it("should sync with the order of the array if it changes completely", () => {
        items.val = [
            ...items.val.sort((person1, person2) => person2.id - person1.id),
        ];
        [...element.children].forEach((child, index) => {
            expect(+child.dataset.key).toBe(items.val[index].id);
            expect(child.innerHTML).toBe(items.val[index].name);
        });
    });

    it("should insert the new child at the right position", () => {
        const left = items.val.filter((item) => item.id < 3);
        const right = items.val.filter((item) => item.id >= 3);

        items.val = [
            ...left,
            { id: 89, name: "inserted in the middle" },
            ...right,
        ];

        [...element.children].forEach((child, index) => {
            expect(+child.dataset.key).toBe(items.val[index].id);
            expect(child.innerHTML).toBe(items.val[index].name);
        });
    });

    it("should work with nested loops", () => {
        const items = stream([
            { id: 1, name: "one" },
            {
                id: 2,
                name: "two",
                children: stream([
                    { id: 4, name: "four" },
                    { id: 5, name: "five" },
                    { id: 6, name: "six" },
                ]),
            },
            { id: 3, name: "three" },
        ]);

        const template = (item) => {
            return h.li({ "data-key": item.id }, [
                item.name,
                item.children
                    ? h.ul({
                          "rv-for": [item.children, template],
                          "data-track-by": "id",
                      })
                    : undefined,
            ]);
        };

        const Test = () => {
            return h.ul({ "rv-for": [items, template], "data-track-by": "id" });
        };

        expect(Test()).toMatchSnapshot("./snapshots/for/nested.output.html");

        items.val.find((item) => item.id === 2).children.val = [
            { id: 7, name: "seven" },
        ];

        expect(Test()).toMatchSnapshot(
            "./snapshots/for/nestedModified.output.html"
        );
    });

    it("should transform the data if transformFn is provided", () => {
        const nums = stream([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const template = (item) => h.li({ "data-key": item.val }, [item.val]);
        const Test = () => {
            return h.ul({
                "data-track-by": "val",
                "rv-for": [nums, template, (n) => ({ val: n })],
            });
        };
        expect(Test()).toMatchSnapshot(
            "./snapshots/for/transformFn.output.html"
        );
    });
});
