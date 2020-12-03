# find relations in javascript

[![npm version](https://badge.fury.io/js/%40gustavnikolaj%2Ffind-relations-in-js.svg)](https://www.npmjs.com/package/@gustavnikolaj/find-relations-in-js)
![CI Build status](https://github.com/gustavnikolaj/find-relations-in-js/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/gustavnikolaj/find-relations-in-js/badge.svg?branch=master)](https://coveralls.io/github/gustavnikolaj/find-relations-in-js?branch=master)

```
$ npm install @gustavnikolaj/find-relations-in-js
```

Using the acorn tokenizer it will enumerate files that have been referenced from
esm `import` or commonjs `require`.

```js
const findRelationsInJs = require("@gustavnikolaj/find-relations-in-js");

findRelationsInJs(`
  import foo from './bar.js';
  require('./baz');
`); /* => [
  {
    type: 'import',
    value: './bar.js',
    source: 'import foo from \'./bar.js\'',
    offset: { start: 3, end: 29 }
  },
  {
    type: 'require',
    value: './baz',
    source: 'require(\'./baz\')',
    offset: { start: 33, end: 57 }
  }
] */
```
