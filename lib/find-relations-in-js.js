/*

[...require('acorn').tokenizer('import foo from "./bar";')].map(t => [t.type.label, t.value])
*/

const acorn = require("acorn");
const tokenizer = acorn.tokenizer;

module.exports = function findRelationsInJs(source) {
  const relations = [];
  const tokens = Array.from(tokenizer(source));
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type.label === "import") {
      if (
        tokens[i + 1].type.label === "name" &&
        tokens[i + 2].type.label === "name" &&
        tokens[i + 3].type.label === "string"
      ) {
        // import identifier from <string>
        relations.push(tokens[i + 3].value);
        i += 4;
        continue;
      } else if (tokens[i + 1].type.label === "string") {
        // import <string>
        relations.push(tokens[i + 1].value);
        i += 2;
        continue;
      } else {
        console.warn("unmatched import");
      }
    }

    if (token.type.label === "name" && token.value === "require") {
      if (
        tokens[i + 1].type.label === "(" &&
        tokens[i + 2].type.label === "string" &&
        tokens[i + 3].type.label === ")"
      ) {
        // require(<string>)
        relations.push(tokens[i + 2].value);
        i += 4;
        continue;
      } else {
        console.warn("unmatched require");
      }
    }

    i += 1;
  }

  return relations;
};
