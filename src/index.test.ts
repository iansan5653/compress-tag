/**
 * @file **comress-tag tests** | Tests for compress-tag.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
 * @license MIT
 */

import * as assert from "assert";
import {compress, compressTight, c, t} from "./index";

context("Primary Tag Behavior", function() {
  context("#compress", function() {
    describe("properly resolves template literals", function() {
      it("should not modify single word strings", function() {
        assert.strictEqual(compress`test`, `test`);
      });

      it("should not modify single line strings", function() {
        assert.strictEqual(compress`this IS a tEst`, `this IS a tEst`);
      });

      it("should handle string placeholders properly", function() {
        assert.strictEqual(
          compress`this ${"is"} a ${"test with"} some ${""} strings`,
          `this ${"is"} a ${"test with"} some ${""} strings`
        );

        assert.strictEqual(
          compress`this has ${""}empty ${""} strings`,
          `this has ${""}empty ${""} strings`
        );
      });

      it("should handle numeric placeholders properly", function() {
        assert.strictEqual(compress`${1} | ${2} | ${0}`, `${1} | ${2} | ${0}`);
        assert.strictEqual(compress`${NaN}`, `${NaN}`);
        assert.strictEqual(
          compress`${Infinity}`,
          `${Infinity}`
        );
      });

      it("should handle expression placeholders properly", function() {
        assert.strictEqual(compress`${1 + 456}`, `${1 + 456}`);
        assert.strictEqual(compress`${Math.sqrt(2)}`, `${Math.sqrt(2)}`);
      });

      it("should handle undefined placeholder properly", function() {
        assert.strictEqual(compress`${undefined}`, `${undefined}`);
      });

      it("should handle null placeholder properly", function() {
        assert.strictEqual(compress`${null}`, `${null}`);
      });

      it("should handle object placeholder properly", function() {
        const obj = {x: 56};
        assert.strictEqual(compress`${obj}`, `${obj}`);
      });

      it("should correctly process all known escape sequences", function() {
        assert.strictEqual(
          compress`\r\t\n\0\v\f\b\\\'\"`, `\r\t\n\0\v\f\b\\\'\"`
        )
      });
    });

    describe("removes all newlines and replaces with a space", function() {
      it("should remove format newlines", function() {
        assert.strictEqual(
          compress`this has
  a new line`,
          "this has a new line"
        );
      });

      it("should not remove manual CRLF newlines", function() {
        assert.strictEqual(
          compress`this has \r\n a new line`,
          "this has \r\n a new line"
        );
      });

      it("should not remove manual LF newlines", function() {
        assert.strictEqual(
          compress`this has \n a new line`,
          "this has \n a new line"
        );
      });

      it("should remove consecutive newlines without inserting multiple spaces", function() {
        assert.strictEqual(
          compress`this has
  
  
  
  
  several new lines`,
          "this has several new lines"
        );
      });

      it("should remove leading newlines without leaving leading spaces", function() {
        assert.strictEqual(
          compress`
  this has a leading new line`,
          "this has a leading new line"
        );
      });

      it("should remove trailing newlines without leaving trailing spaces", function() {
        assert.strictEqual(
          compress`this has a trailing new line
  `,
          "this has a trailing new line"
        );
      });

      it("should remove multiple non-connected newlines", function() {
        assert.strictEqual(
          compress`this
  has several
  new
  lines`,
          "this has several new lines"
        );
      });
    });

    describe("removes whitespace from around individual lines", function() {
      it("should remove leading spaces from lines", function() {
        assert.strictEqual(
          compress`this has 
            indented lines 
            with leading
            spaces`,
          "this has indented lines with leading spaces"
        );
      });

      it("should remove trailing spaces from lines", function() {
        assert.strictEqual(
          compress`this has 
  lines          
  with trailing                      
  spaces`,
          "this has lines with trailing spaces"
        );
      });

      it("should remove tabs from lines", function() {
        assert.strictEqual(
          compress`this has 
  								tab characters					
  around a line`,
          "this has tab characters around a line"
        );
      });

      it("should not affect internal whitespace", function() {
        assert.strictEqual(
          compress`this has
          internal          and external tabs				and
          spaces`,
          "this has internal          and external tabs				and spaces"
        );
      });

      it("should not affect manual tabs", function() {
        assert.strictEqual(
          compress`this has 
          \ta manual tab`,
          "this has \ta manual tab"
        );
      });
    });
  });

  context("#compressTight", function() {
    describe("properly resolves template literals", function() {
      it("should not modify single word strings", function() {
        assert.strictEqual(compressTight`test`, `test`);
      });

      it("should not modify single line strings", function() {
        assert.strictEqual(compressTight`this IS a tEst`, `this IS a tEst`);
      });

      it("should handle string placeholders properly", function() {
        assert.strictEqual(
          compressTight`this ${"is"} a ${"test with"} some ${""} strings`,
          `this ${"is"} a ${"test with"} some ${""} strings`
        );

        assert.strictEqual(
          compressTight`this has ${""}empty ${""} strings`,
          `this has ${""}empty ${""} strings`
        );
      });

      it("should handle numeric placeholders properly", function() {
        assert.strictEqual(
          compressTight`${1} | ${2} | ${0}`,
          `${1} | ${2} | ${0}`
        );
        assert.strictEqual(compressTight`${NaN}`, `${NaN}`);
        assert.strictEqual(compressTight`${Infinity}`, `${Infinity}`);
      });

      it("should handle expression placeholders properly", function() {
        assert.strictEqual(compressTight`${1 + 456}`, `${1 + 456}`);
        assert.strictEqual(compressTight`${Math.sqrt(2)}`, `${Math.sqrt(2)}`);
      });

      it("should handle undefined placeholder properly", function() {
        assert.strictEqual(compressTight`${undefined}`, `${undefined}`);
      });

      it("should handle null placeholder properly", function() {
        assert.strictEqual(compressTight`${null}`, `${null}`);
      });

      it("should handle object placeholder properly", function() {
        const obj = {x: 56};
        assert.strictEqual(compressTight`${obj}`, `${obj}`);
      });

      it("should correctly process all known escape sequences", function() {
        assert.strictEqual(
          compress`\r\t\n\0\v\f\b\\\'\"`, `\r\t\n\0\v\f\b\\\'\"`
        )
      });
    });

    describe("removes all newlines and does not replace with a space", function() {
      it("should remove format newlines", function() {
        assert.strictEqual(
          compressTight`this has
  a new line`,
          "this hasa new line"
        );
      });

      it("should not remove manual CRLF newlines", function() {
        assert.strictEqual(
          compressTight`this has \r\n a new line`,
          "this has \r\n a new line"
        );
      });

      it("should not remove manual LF newlines", function() {
        assert.strictEqual(
          compressTight`this has \n a new line`,
          "this has \n a new line"
        );
      });

      it("should remove consecutive newlines without inserting multiple spaces", function() {
        assert.strictEqual(
          compressTight`this has
  
  
  
  
  several new lines`,
          "this hasseveral new lines"
        );
      });

      it("should remove leading newlines without leaving leading spaces", function() {
        assert.strictEqual(
          compressTight`
  this has a leading new line`,
          "this has a leading new line"
        );
      });

      it("should remove trailing newlines without leaving trailing spaces", function() {
        assert.strictEqual(
          compressTight`this has a trailing new line
  `,
          "this has a trailing new line"
        );
      });

      it("should remove multiple non-connected newlines", function() {
        assert.strictEqual(
          compressTight`this
  has several
  new
  lines`,
          "thishas severalnewlines"
        );
      });
    });

    describe("removes whitespace from around individual lines", function() {
      it("should remove leading spaces from lines", function() {
        assert.strictEqual(
          compressTight`this has 
            indented lines 
            with leading
            spaces`,
          "this hasindented lineswith leadingspaces"
        );
      });

      it("should remove trailing spaces from lines", function() {
        assert.strictEqual(
          compressTight`this has 
  lines          
  with trailing                      
  spaces`,
          "this haslineswith trailingspaces"
        );
      });

      it("should remove tabs from lines", function() {
        assert.strictEqual(
          compressTight`this has 
  								tab characters					
  around a line`,
          "this hastab charactersaround a line"
        );
      });

      it("should not affect internal whitespace", function() {
        assert.strictEqual(
          compressTight`this has
          internal          and external tabs				and
          spaces`,
          "this hasinternal          and external tabs				andspaces"
        );
      });

      it("should not affect manual tabs", function() {
        assert.strictEqual(
          compressTight`this has 
          \ta manual tab`,
          "this has\ta manual tab"
        );
      });
    });
  });
});

context("Shorthand Tags", function() {
  context("#c", function() {
    it("should be exactly the same function as #compress", function() {
      assert.deepStrictEqual(c, compress);
    });
  });

  context("#t", function() {
    it("should be exactly the same function as #compressTight", function() {
      assert.deepStrictEqual(t, compressTight);
    });
  });
});
