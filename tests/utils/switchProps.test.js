import { switchProps } from "../../src/utils";

describe("switchProps", () => {
    it("should return an array with the props and children", () => {
        const props = { a: 1 };
        const children = [1, 2, 3];
        const result = switchProps(props, children);
        expect(result).toEqual([props, children]);
    });

    it("should return an array with an array and an empty object if props is an array", () => {
        const props_raw = [1, 2, 3];
        const children_raw = {};
        const result = switchProps(props_raw, children_raw);
        expect(result).toEqual([children_raw, props_raw]);
    });

    it("should return an array with an empty object and children if only children are provided", () => {
        const children = [1, 2, 3];
        const result = switchProps(children);
        expect(result).toEqual([{}, children]);
    });
});