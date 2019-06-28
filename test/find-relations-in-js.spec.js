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
});
