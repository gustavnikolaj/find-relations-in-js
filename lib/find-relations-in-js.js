const acorn = require("acorn");
const acornJsx = require("acorn-jsx");
const Parser = acorn.Parser.extend(acornJsx());

function getSourceAndOffset(source, start, end) {
  return {
    source: source.substring(start, end),
    offset: { start, end }
  };
}

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
        relations.push({
          type: "import",
          value: tokens[i + 3].value,
          ...getSourceAndOffset(source, token.start, tokens[i + 3].end)
        });
        i += 4;
        continue;
      } else if (tokens[i + 1].type.label === "string") {
        // import <string>
        relations.push({
          type: "import",
          value: tokens[i + 1].value,
          ...getSourceAndOffset(source, token.start, tokens[i + 1].end)
        });
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
          relations.push({
            type: "import",
            value: tokens[j + 2].value,
            ...getSourceAndOffset(source, token.start, tokens[j + 2].end)
          });
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

        for (let k = i + 4; k < tokens.length; k++) {
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
          relations.push({
            type: "import",
            value: tokens[j + 2].value,
            ...getSourceAndOffset(source, token.start, tokens[j + 2].end)
          });
          i = j + 3;
          continue;
        }
      }

      relations.push({
        error: "Incomprehensible import",
        type: "import",
        ...getSourceAndOffset(source, token.start, token.end)
      });
    }

    if (token.type.label === "name" && token.value === "require") {
      if (
        tokens[i + 1] &&
        tokens[i + 1].type.label === "(" &&
        tokens[i + 2] &&
        tokens[i + 2].type.label === "string" &&
        tokens[i + 3] &&
        tokens[i + 3].type.label === ")"
      ) {
        // require(<string>)
        relations.push({
          type: "require",
          value: tokens[i + 2].value,
          ...getSourceAndOffset(source, token.start, tokens[i + 3].end)
        });
        i += 4;
        continue;
      } else {
        if (tokens[i + 1].type.label === "(") {
          let j = null;

          for (let k = i + 1; k < tokens.length; k++) {
            if (tokens[k].type.label === ")") {
              j = k;
              break;
            }
          }

          if (j) {
            relations.push({
              error: "Non literal require.",
              type: "require",
              ...getSourceAndOffset(source, token.start, tokens[j].end)
            });
          } else {
            relations.push({
              error: "Incomplete require statement",
              type: "require",
              ...getSourceAndOffset(source, token.start, tokens[i + 1].end)
            });
          }
        } else {
          // This is anything which is named require, but isn't called as a
          // function, e.g. a random variable or argument named require.
        }
      }
    }

    i += 1;
  }

  return relations;
};
