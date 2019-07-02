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
      ["./bar.js"]
    );
  });

  it("should find a short import statement", () => {
    expect(
      findRelationsInJs(`
        import './foo.js';
      `),
      "to equal",
      ["./foo.js"]
    );
  });

  it("should find a require call", () => {
    expect(
      findRelationsInJs(`
        const foo = require('./bar.js');
      `),
      "to equal",
      ["./bar.js"]
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
      ["react"]
    );
  });

  it("should work with a named import", () => {
    expect(
      findRelationsInJs(`
        import { Component } from 'react';
      `),
      "to equal",
      ["react"]
    );
  });

  it("should work with named imports", () => {
    expect(
      findRelationsInJs(`
        import { Component, Fragment } from 'react';
      `),
      "to equal",
      ["react"]
    );
  });

  it("should work with mixed named and default imports", () => {
    expect(
      findRelationsInJs(`
        import React, { Component } from 'react';
      `),
      "to equal",
      ["react"]
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
      ["react", "prop-types"]
    );
  });

  it("should not fail when requiring a variable", () => {
    expect(
      findRelationsInJs(`
        const foo = 'react';
        const bar = require(foo);
      `),
      "to equal",
      []
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
      ["react", "prop-types", "lodash", "lodash"]
    );
  });
});
