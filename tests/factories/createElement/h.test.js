import { describe, expect } from "vitest";
import { h } from "../../../src/index.js";

describe("h", () => {
    it("should return a function", () => {
        expect(typeof h.div).toBe("function");
    });

    it("should return a function with a name", () => {
        expect(h.div()).toBeInstanceOf(HTMLElement);
    });

    it("should return a fragment", () => {
        expect(h.fragment()).toBeInstanceOf(DocumentFragment);
    });

    it("should work with custom elements", () => {
        expect(h["custom-element"]()).toBeInstanceOf(HTMLElement);
    });
});
