# find relations in javascript

[![Build Status](https://travis-ci.com/gustavnikolaj/find-relations-in-js.svg?branch=master)](https://travis-ci.com/gustavnikolaj/find-relations-in-js)

```
$ npm install find-relations-in-js
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
