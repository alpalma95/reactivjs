import { expect } from "vitest";
import { html } from "../../../src/factories/createElement";

describe("html", () => {
    it("should create a new element", () => {
        let element = html("div")({ id: "test" });
        expect(element.tagName).toBe("DIV");
        expect(element.id).toBe("test");
    });

    it("should create a new element with a class", () => {
        let element = html("div")({ class: "test" });
        expect(element.classList.contains("test")).toBe(true);
    });

    it("should create a new element with a style", () => {
        let element = html("div")({ style: "color: red;" });
        expect(element.style.color).toBe("red");
    });

    it("should create a new element with a text", () => {
        let element = html("div")(["test"]);
        expect(element.textContent).toBe("test");
    });

    it("should create a new element with an attribute", () => {
        let element = html("div")({ id: "test" });
        expect(element.id).toBe("test");
    });

    it("should create a new element with multiple attributes", () => {
        let element = html("div")({ id: "test", class: "test" });
        expect(element.id).toBe("test");
        expect(element.className).toBe("test");
    });

    it("should create a new element with multiple attributes and a text", () => {
        let element = html("div")({ id: "test", class: "test" }, ["test"]);
        expect(element.id).toBe("test");
        expect(element.className).toBe("test");
        expect(element.textContent).toBe("test");
    });

    it("should create a new element with multiple attributes and multiple text", () => {
        let element = html("div")({ id: "test", class: "test" }, ["test", "test"]);
        expect(element.id).toBe("test");
        expect(element.classList.contains("test")).toBe(true);
        expect(element.textContent).toBe("testtest");
    });

    it("should create a new element with multiple attributes and a child element", () => {
        let element = html("div")({ id: "test", class: "test", 'data-test': true }, [
            html("p")({ id: "test" })
        ]);
        expect(element.id).toBe("test");
        expect(element.classList.contains("test")).toBe(true);
        expect(element.getAttribute("data-test")).toBe("true");
        expect(!!element.children[0]).toBe(true);
    });

    it('should create document fragment', () => {
        let fragment = html("fragment")();
        expect(fragment instanceof DocumentFragment).toBe(true); 
    })

    it('should attach event listeners', () => {
        let count = 0;
        let element = html("button")({ onclick: () =>  count++});
        expect(element.onclick).toBeDefined();
        element.click()
        expect(count).toBe(1);
    });

    it('should ignore functions that are not event listeners', () => {
        let element = html("button")({ test: () => true});
        expect(element.test).toBeUndefined();
    })
});