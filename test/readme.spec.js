const expect = require("unexpected");
const findRelationsInJs = require("../");

const README_EXAMPLE = `
  import foo from './bar.js';
  require('./baz');
`;

describe("README", () => {
  it("should have a functional example in the readme", () => {
    expect(findRelationsInJs(README_EXAMPLE), "to equal", [
      {
        type: "import",
        value: "./bar.js",
        source: "import foo from './bar.js'",
        offset: { start: 3, end: 29 }
      },
      {
        type: "require",
        value: "./baz",
        source: "require('./baz')",
        offset: { start: 33, end: 49 }
      }
    ]);
  });
});
