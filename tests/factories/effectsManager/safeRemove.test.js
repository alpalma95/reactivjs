import {
    DOMEffectsMap,
    registerEffect,
    safeRemove
} from "../../../src/factories/effectsManager";

const logs = []

const createDummyEffect = () => ({
    cb: () => {},
    unhook: () => logs.push("unhooked")
})


describe("EffectsManager > safeRemove", () => {
    beforeEach(() => {
        document.body.innerHTML = /* html */ `
            <div id="app">
                <h1>Hello World</h1>
                <p>This is a test</p>
            </div>
        `;

        logs.length = 0;
    });

    it("should remove the effect from the DOMEffectsMap", () => {
        const h1 = document.querySelector("h1");
        const effect = createDummyEffect();
        registerEffect(h1, effect);

        safeRemove(h1)
        expect(DOMEffectsMap.get(h1)).toBeUndefined();
    });

    it("should remove the element from the DOM", () => {
        const h1 = document.querySelector("h1");
        const effect = createDummyEffect();
        registerEffect(h1, effect);

        safeRemove(h1)
        expect(document.querySelector("h1")).toBeNull();
    });

    it('should call the unhook function of the effect', () => {
        const h1 = document.querySelector("h1");
        const effect1 = createDummyEffect();
        const effect2 = createDummyEffect();
        registerEffect(h1, effect1);
        registerEffect(h1, effect2);

        safeRemove(h1)
        expect(logs.length).toBe(2);
    })

    it('should call the destroy method of the element if it exists', () => {
        const h1 = document.querySelector("h1");
        const effect1 = createDummyEffect();
        h1.destroy = () => logs.push("destroyed")
        registerEffect(h1, effect1);

        safeRemove(h1)
        expect(logs.length).toBe(2);

    })
});
