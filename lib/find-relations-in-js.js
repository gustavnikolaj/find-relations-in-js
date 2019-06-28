const acorn = require("acorn");
const acornJsx = require("acorn-jsx");
const Parser = acorn.Parser.extend(acornJsx());

module.exports = function findRelationsInJs(source) {
  const relations = [];
  const tokens = Array.from(Parser.tokenizer(source));
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
      } else if (tokens[i + 1].type.label === "{") {
        // import { ...identifiers } from <string>
        let j = i + 2;

        for (let k = i + 2; k++; k < tokens.length) {
          // consume non }-tokens
          if (tokens[k].type.label === "}") {
            j = k;
            break;
          }
        }

        if (
          tokens[j + 1].type.label === "name" &&
          tokens[j + 2].type.label === "string"
        ) {
          // } from <string>
          relations.push(tokens[j + 2].value);
          i = j + 3;
          continue;
        }
      } else if (
        tokens[i + 1].type.label === "name" &&
        tokens[i + 2].type.label === "," &&
        tokens[i + 3].type.label === "{"
      ) {
        // import identifier, {identifiers} from <string>
        let j = i + 4;

        for (let k = i + 4; k++; k < tokens.length) {
          // consume non }-tokens
          if (tokens[k].type.label === "}") {
            j = k;
            break;
          }
        }

        if (
          tokens[j + 1].type.label === "name" &&
          tokens[j + 2].type.label === "string"
        ) {
          // } from <string>
          relations.push(tokens[j + 2].value);
          i = j + 3;
          continue;
        }
      }

      console.log(tokens);

      console.warn("unmatched import");
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
