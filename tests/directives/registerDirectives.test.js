import { registerDirectives } from "../../src";
import { directives } from "../../src/directives/registerDirectives";

describe("registerDirectives", () => {
  it("should register directives", () => {
    const newDirective = {
        selector: 'test-directive',
        construct: () => true
    }
    registerDirectives(newDirective);
    expect(directives['test-directive']).toBeDefined();
  });

  it('should register multiple directives', () => {
    const newDirective1 = {
        selector: 'test-directive-1',
        construct: () => true
    }
    const newDirective2 = {
        selector: 'test-directive-2',
        construct: () => true
    }
    registerDirectives(newDirective1, newDirective2);
    expect(directives['test-directive-1']).toBeDefined();
    expect(directives['test-directive-2']).toBeDefined();
    
  })
});