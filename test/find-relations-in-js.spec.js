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
      [
        {
          type: "import",
          value: "./bar.js",
          source: "import foo from './bar.js'",
          offset: { start: 9, end: 35 }
        }
      ]
    );
  });

  it("should find a short import statement", () => {
    expect(
      findRelationsInJs(`
        import './foo.js';
      `),
      "to equal",
      [
        {
          type: "import",
          value: "./foo.js",
          source: "import './foo.js'",
          offset: { start: 9, end: 26 }
        }
      ]
    );
  });

  it("should find a require call", () => {
    expect(
      findRelationsInJs(`
        const foo = require('./bar.js');
      `),
      "to equal",
      [
        {
          type: "require",
          value: "./bar.js",
          source: "require('./bar.js')",
          offset: { start: 21, end: 40 }
        }
      ]
    );
  });

  it("should work with jsx", () => {
    expect(
      findRelationsInJs(`
        import React from 'react';
        export default function Hello() {
          return <h1>Hello, world!</h1>;
        }
      `),
      "to equal",
      [
        {
          type: "import",
          value: "react",
          source: "import React from 'react'",
          offset: { start: 9, end: 34 }
        }
      ]
    );
  });

  it("should work with a named import", () => {
    expect(
      findRelationsInJs(`
        import { Component } from 'react';
      `),
      "to equal",
      [
        {
          type: "import",
          value: "react",
          source: "import { Component } from 'react'",
          offset: { start: 9, end: 42 }
        }
      ]
    );
  });

  it("should work with named imports", () => {
    expect(
      findRelationsInJs(`
        import { Component, Fragment } from 'react';
      `),
      "to equal",
      [
        {
          type: "import",
          value: "react",
          source: "import { Component, Fragment } from 'react'",
          offset: { start: 9, end: 52 }
        }
      ]
    );
  });

  it("should work with mixed named and default imports", () => {
    expect(
      findRelationsInJs(`
        import React, { Component } from 'react';
      `),
      "to equal",
      [
        {
          type: "import",
          value: "react",
          source: "import React, { Component } from 'react'",
          offset: { start: 9, end: 49 }
        }
      ]
    );
  });

  it("should work with multi line imports", () => {
    expect(
      findRelationsInJs(`
        import React, { Component }
        from 'react';
        import
        PropTypes
        from
        'prop-types';
      `),
      "to equal",
      [
        {
          type: "import",
          value: "react",
          source: "import React, { Component }\n        from 'react'",
          offset: { start: 9, end: 57 }
        },
        {
          type: "import",
          value: "prop-types",
          source:
            "import\n        PropTypes\n        from\n        'prop-types'",
          offset: { start: 67, end: 125 }
        }
      ]
    );
  });

  it("should not fail when requiring a variable", () => {
    expect(
      findRelationsInJs(`
        const foo = 'react';
        const bar = require(foo);
      `),
      "to equal",
      [
        {
          error: "Non literal require.",
          type: "require",
          source: "require(foo)",
          offset: { start: 50, end: 62 }
        }
      ]
    );
  });

  it("should should work with multiple quotes", () => {
    expect(
      findRelationsInJs(`
        const React = require('react');
        const PropTypes = require("prop-types");
        import { pick } from "lodash";
        import { omit } from 'lodash';
      `),
      "to equal",
      [
        {
          type: "require",
          value: "react",
          source: "require('react')",
          offset: { start: 23, end: 39 }
        },
        {
          type: "require",
          value: "prop-types",
          source: `require("prop-types")`,
          offset: { start: 67, end: 88 }
        },
        {
          type: "import",
          value: "lodash",
          source: `import { pick } from "lodash"`,
          offset: { start: 98, end: 127 }
        },
        {
          type: "import",
          value: "lodash",
          source: "import { omit } from 'lodash'",
          offset: { start: 137, end: 166 }
        }
      ]
    );
  });

  it("should return a list of imported files", () => {
    expect(
      findRelationsInJs(`
        import foo from './someFile'
        import './another-file';
        export default function () {};
      `),
      "to equal",
      [
        {
          type: "import",
          value: "./someFile",
          source: "import foo from './someFile'",
          offset: { start: 9, end: 37 }
        },
        {
          type: "import",
          value: "./another-file",
          source: "import './another-file'",
          offset: { start: 46, end: 69 }
        }
      ]
    );
  });

  it("should not crash on an unterminated require statement", () => {
    expect(
      findRelationsInJs(`
        require('fdsf'
      `),
      "to equal",
      [
        {
          error: "Incomplete require statement",
          type: "require",
          source: "require(",
          offset: { start: 9, end: 17 }
        }
      ]
    );
  });

  it("should ignore a variable named require", () => {
    expect(
      findRelationsInJs(`
        var require = 'foo'
      `),
      "to equal",
      []
    );
  });

  it("should not crash on dynamic import", () => {
    expect(
      findRelationsInJs(`
        import('fdsf');
      `),
      "to equal",
      [
        {
          error: "Incomprehensible import",
          type: "import",
          source: "import",
          offset: { start: 9, end: 15 }
        }
      ]
    );
  });
});
