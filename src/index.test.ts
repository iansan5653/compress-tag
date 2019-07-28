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
        assert.strictEqual(`test`, compress`test`);
      });

      it("should not modify single line strings", function() {
        assert.strictEqual(`this IS a tEst`, compress`this IS a tEst`);
      });

      it("should handle string placeholders properly", function() {
        assert.strictEqual(
          `this ${"is"} a ${"test with"} some ${""} strings`,
          compress`this ${"is"} a ${"test with"} some ${""} strings`
        );

        assert.strictEqual(
          `this has ${""}empty ${""} strings`,
          compress`this has ${""}empty ${""} strings`
        );
      });

      it("should handle numeric placeholders properly", function() {
        assert.strictEqual(`${1} | ${2} | ${0}`, compress`${1} | ${2} | ${0}`);
        assert.strictEqual(`${NaN}`, compress`${NaN}`, "NaN placeholder");
        assert.strictEqual(
          `${Infinity}`,
          compress`${Infinity}`,
          "Infinity placeholder"
        );
      });

      it("should handle expression placeholders properly", function() {
        assert.strictEqual(`${1 + 456}`, compress`${1 + 456}`);
        assert.strictEqual(`${Math.sqrt(2)}`, compress`${Math.sqrt(2)}`);
      });

      it("should handle undefined placeholder properly", function() {
        assert.strictEqual(`${undefined}`, compress`${undefined}`);
      });

      it("should handle null placeholder properly", function() {
        assert.strictEqual(`${null}`, compress`${null}`);
      });

      it("should handle object placeholder properly", function() {
        const obj = {x: 56};
        assert.strictEqual(`${obj}`, compress`${obj}`);
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

      it("should remove CRLF newlines", function() {
        assert.strictEqual(
          compress`this has \r\n a new line`,
          "this has a new line"
        );
      });

      it("should remove LF newlines", function() {
        assert.strictEqual(
          compress`this has \n a new line`,
          "this has a new line"
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
  \t\t\t\t\ttabs\t\t\t\t\t
  around a line`,
          "this has tabs around a line"
        );
      });

      it("should not affect internal whitespace", function() {
        assert.strictEqual(
          compress`this has
          internal          and external tabs\t\t\t\tand
          spaces`,
          "this has internal          and external tabs\t\t\t\tand spaces"
        );
      });
    });
  });

  context("#compressTight", function() {
    describe("properly resolves template literals", function() {
      it("should not modify single word strings", function() {
        assert.strictEqual(`test`, compressTight`test`);
      });

      it("should not modify single line strings", function() {
        assert.strictEqual(`this IS a tEst`, compressTight`this IS a tEst`);
      });

      it("should handle string placeholders properly", function() {
        assert.strictEqual(
          `this ${"is"} a ${"test with"} some ${""} strings`,
          compressTight`this ${"is"} a ${"test with"} some ${""} strings`
        );

        assert.strictEqual(
          `this has ${""}empty ${""} strings`,
          compressTight`this has ${""}empty ${""} strings`
        );
      });

      it("should handle numeric placeholders properly", function() {
        assert.strictEqual(
          `${1} | ${2} | ${0}`,
          compressTight`${1} | ${2} | ${0}`
        );
        assert.strictEqual(`${NaN}`, compressTight`${NaN}`, "NaN placeholder");
        assert.strictEqual(`${Infinity}`, compressTight`${Infinity}`);
      });

      it("should handle expression placeholders properly", function() {
        assert.strictEqual(`${1 + 456}`, compressTight`${1 + 456}`);
        assert.strictEqual(`${Math.sqrt(2)}`, compressTight`${Math.sqrt(2)}`);
      });

      it("should handle undefined placeholder properly", function() {
        assert.strictEqual(`${undefined}`, compressTight`${undefined}`);
      });

      it("should handle null placeholder properly", function() {
        assert.strictEqual(`${null}`, compressTight`${null}`);
      });

      it("should handle object placeholder properly", function() {
        const obj = {x: 56};
        assert.strictEqual(`${obj}`, compressTight`${obj}`);
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

      it("should remove CRLF newlines", function() {
        assert.strictEqual(
          compressTight`this has \r\n a new line`,
          "this hasa new line"
        );
      });

      it("should remove LF newlines", function() {
        assert.strictEqual(
          compressTight`this has \n a new line`,
          "this hasa new line"
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
  \t\t\t\t\ttabs\t\t\t\t\t
  around a line`,
          "this hastabsaround a line"
        );
      });

      it("should not affect internal whitespace", function() {
        assert.strictEqual(
          compressTight`this has
          internal          and external tabs\t\t\t\tand
          spaces`,
          "this hasinternal          and external tabs\t\t\t\tandspaces"
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
