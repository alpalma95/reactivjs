import { h, stream } from "../../src";

describe("text directive callback approach", () => {
    const text = stream("Hello world");
    const element = h.p({
        "rv-text": () => text.val,
    });

    it("should set initial text content", () => {
        expect(element.textContent).toBe("Hello world");
    });

    it("should update text content", () => {
        text.val = "Hello world again";
        expect(element.textContent).toBe("Hello world again");
    });
});

describe("text directive stream approach", () => {
    const text = stream("Hello world");
    const element = h.p({
        "rv-text": text,
    });

    it("should set initial text content", () => {
        expect(element.textContent).toBe("Hello world");
    });

    it("should update text content", () => {
        text.val = "Hello world again";
        expect(element.textContent).toBe("Hello world again");
    });
});

describe("text directive reactive object approach", () => {
    const text = stream({
        text: "Hello world",
    });
    const element = h.p({
        "rv-text": () => text.text,
    });

    it("should set initial text content", () => {
        expect(element.textContent).toBe("Hello world");
    });

    it("should update text content", () => {
        text.text = "Hello world again";
        expect(element.textContent).toBe("Hello world again");
    });
});
