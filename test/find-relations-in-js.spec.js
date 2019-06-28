const expect = require("unexpected");
const findRelationsInJs = require("../");

describe("find-relations-in-js", () => {
  it("should be a function", () => {
    expect(findRelationsInJs, "to be a function");
  });

  it("should not find any relations in a source without", () => {
    expect(
      findRelationsInJs(`
        console.log('hello world');
      `),
      "to equal",
      []
    );
  });

  it("should find an import statement", () => {
    expect(
      findRelationsInJs(`
        import foo from './bar.js';
      `),
      "to equal",
      ["./bar.js"]
    );
  });

  it("should find a short import statement", () => {
    expect(
      findRelationsInJs(`
        import './foo.js';
      `),
      "to equal",
      ["./foo.js"]
    );
  });

  it("should find a require call", () => {
    expect(
      findRelationsInJs(`
        const foo = require('./bar.js');
      `),
      "to equal",
      ["./bar.js"]
    );
  });
});
