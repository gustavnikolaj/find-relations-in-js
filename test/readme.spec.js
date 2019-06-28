const expect = require("unexpected");
const findRelationsInJs = require("../");

it("should have a functional example in the readme", () => {
  expect(
    findRelationsInJs(`
      import foo from './bar.js';
      require('./baz');
    `),
    "to equal",
    ["./bar.js", "./baz"]
  );
});
