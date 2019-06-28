# find relations in javascript

```
$ npm install find-relations-in-js
```

Using the acorn tokenizer it will enumerate files that have been referenced from
esm `import` or commonjs `require`.

```js
const findRelationsInJs = require('@gustavnikolaj/find-relations-in-js');

findRelationsInJs(`
import foo from './bar.js';
require('./baz');
`) => // ['./bar.js', './baz']
```
