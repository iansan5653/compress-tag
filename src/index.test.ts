/**
 * @file **comress-tag tests** | Tests for compress-tag.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
 * @license MIT
 */

/* eslint-disable max-len */

import * as assert from "assert";
import {compress, compressTight, c, t} from "./index";

context("compress-tag", function(): void {
  context("Primary Tag Behavior", function(): void {
    context("#compress", function(): void {
      describe("properly resolves template literals", function(): void {
        it("should not modify single word strings", function(): void {
          assert.strictEqual(compress`test`, `test`);
        });

        it("should not modify single line strings", function(): void {
          assert.strictEqual(compress`this IS a tEst`, `this IS a tEst`);
        });

        it("should handle string placeholders properly", function(): void {
          assert.strictEqual(
            compress`this ${"is"} a ${"test with"} some ${""} strings`,
            `this ${"is"} a ${"test with"} some ${""} strings`
          );

          assert.strictEqual(
            compress`this has ${""}empty ${""} strings`,
            `this has ${""}empty ${""} strings`
          );
        });

        it("should handle numeric placeholders properly", function(): void {
          assert.strictEqual(
            compress`${1} | ${2} | ${0}`,
            `${1} | ${2} | ${0}`
          );
          assert.strictEqual(compress`${NaN}`, `${NaN}`);
          assert.strictEqual(compress`${Infinity}`, `${Infinity}`);
        });

        it("should handle expression placeholders properly", function(): void {
          assert.strictEqual(compress`${1 + 456}`, `${1 + 456}`);
          assert.strictEqual(compress`${Math.sqrt(2)}`, `${Math.sqrt(2)}`);
        });

        it("should handle undefined placeholder properly", function(): void {
          assert.strictEqual(compress`${undefined}`, `${undefined}`);
        });

        it("should handle null placeholder properly", function(): void {
          assert.strictEqual(compress`${null}`, `${null}`);
        });

        it("should handle object placeholder properly", function(): void {
          const obj = {x: 56};
          assert.strictEqual(compress`${obj}`, `${obj}`);
        });

        it("should correctly process all known escape sequences", function(): void {
          assert.strictEqual(
            compress`\r\t\n\0\v\f\b\\\'\"`,
            `\r\t\n\0\v\f\b\\\'\"` // eslint-disable-line no-useless-escape
          );
        });

        it("should handle escaped URIs correctly", function(): void {
          assert.strictEqual(
            compress`c:\\f\\r\\newfolder\\v\\bin`,
            `c:\\f\\r\\newfolder\\v\\bin`
          );
        });

        it("should not affect escape characters in placeholders", function(): void {
          // eslint-disable-next-line no-useless-escape
          const oddString = "c:\\f\\r\\n\\v\\b \r\t\n\0\v\f\b\\'\"";
          assert.strictEqual(compress`${oddString}`, `${oddString}`);
        });

        it("should error if a placeholders cannot be converted to a string", function(): void {
          assert.throws(function() {
            compress`${{
              valueOf: null,
              toString: null
            }}`;
          });
        });
      });

      describe("removes all newlines and replaces with a space", function(): void {
        it("should remove format newlines", function(): void {
          assert.strictEqual(
            compress`this has
  a new line`,
            "this has a new line"
          );
        });

        it("should not remove manual CRLF newlines", function(): void {
          assert.strictEqual(
            compress`this has \r\n a new line`,
            "this has \r\n a new line"
          );
        });

        it("should not remove manual LF newlines", function(): void {
          assert.strictEqual(
            compress`this has \n a new line`,
            "this has \n a new line"
          );
        });

        it("should remove consecutive newlines without inserting multiple spaces", function(): void {
          assert.strictEqual(
            compress`this has
  
  
  
  
  several new lines`,
            "this has several new lines"
          );
        });

        it("should remove leading newlines without leaving leading spaces", function(): void {
          assert.strictEqual(
            compress`
  this has a leading new line`,
            "this has a leading new line"
          );
        });

        it("should remove trailing newlines without leaving trailing spaces", function(): void {
          assert.strictEqual(
            compress`this has a trailing new line
  `,
            "this has a trailing new line"
          );
        });

        it("should remove multiple non-connected newlines", function(): void {
          assert.strictEqual(
            compress`this
  has several
  new
  lines`,
            "this has several new lines"
          );
        });
      });

      describe("removes whitespace from around individual lines", function(): void {
        it("should remove leading spaces from lines", function(): void {
          assert.strictEqual(
            compress`this has 
            indented lines 
            with leading
            spaces`,
            "this has indented lines with leading spaces"
          );
        });

        it("should remove trailing spaces from lines", function(): void {
          assert.strictEqual(
            compress`this has 
  lines          
  with trailing                      
  spaces`,
            "this has lines with trailing spaces"
          );
        });

        it("should remove tabs from lines", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compress`this has 
  								tab characters					 
  around a line`,
            "this has tab characters around a line"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect internal whitespace", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compress`this has
          internal          and external tabs				and
          spaces`,
            "this has internal          and external tabs				and spaces"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect manual tabs", function(): void {
          assert.strictEqual(
            compress`this has 
          \ta manual tab`,
            "this has \ta manual tab"
          );
        });
      });
    });

    context("#compressTight", function(): void {
      describe("properly resolves template literals", function(): void {
        it("should not modify single word strings", function(): void {
          assert.strictEqual(compressTight`test`, `test`);
        });

        it("should not modify single line strings", function(): void {
          assert.strictEqual(compressTight`this IS a tEst`, `this IS a tEst`);
        });

        it("should handle string placeholders properly", function(): void {
          assert.strictEqual(
            compressTight`this ${"is"} a ${"test with"} some ${""} strings`,
            `this ${"is"} a ${"test with"} some ${""} strings`
          );

          assert.strictEqual(
            compressTight`this has ${""}empty ${""} strings`,
            `this has ${""}empty ${""} strings`
          );
        });

        it("should handle numeric placeholders properly", function(): void {
          assert.strictEqual(
            compressTight`${1} | ${2} | ${0}`,
            `${1} | ${2} | ${0}`
          );
          assert.strictEqual(compressTight`${NaN}`, `${NaN}`);
          assert.strictEqual(compressTight`${Infinity}`, `${Infinity}`);
        });

        it("should handle expression placeholders properly", function(): void {
          assert.strictEqual(compressTight`${1 + 456}`, `${1 + 456}`);
          assert.strictEqual(compressTight`${Math.sqrt(2)}`, `${Math.sqrt(2)}`);
        });

        it("should handle undefined placeholder properly", function(): void {
          assert.strictEqual(compressTight`${undefined}`, `${undefined}`);
        });

        it("should handle null placeholder properly", function(): void {
          assert.strictEqual(compressTight`${null}`, `${null}`);
        });

        it("should handle object placeholder properly", function(): void {
          const obj = {x: 56};
          assert.strictEqual(compressTight`${obj}`, `${obj}`);
        });

        it("should correctly process all known escape sequences", function(): void {
          assert.strictEqual(
            compressTight`\r\t\n\0\v\f\b\\\'\"`,
            `\r\t\n\0\v\f\b\\\'\"` // eslint-disable-line no-useless-escape
          );
        });

        it("should handle escaped URIs correctly", function(): void {
          assert.strictEqual(
            compressTight`c:\\f\\r\\newfolder\\v\\bin`,
            `c:\\f\\r\\newfolder\\v\\bin`
          );
        });

        it("should not affect escape characters in placeholders", function(): void {
          // eslint-disable-next-line no-useless-escape
          const oddString = "c:\\f\\r\\n\\v\\b \r\t\n\0\v\f\b\\'\"";
          assert.strictEqual(compressTight`${oddString}`, `${oddString}`);
        });

        it("should error if a placeholders cannot be converted to a string", function(): void {
          assert.throws(function() {
            compressTight`${{
              valueOf: null,
              toString: null
            }}`;
          });
        });
      });

      describe("removes all newlines and does not replace with a space", function(): void {
        it("should remove format newlines", function(): void {
          assert.strictEqual(
            compressTight`this has
  a new line`,
            "this hasa new line"
          );
        });

        it("should not remove manual CRLF newlines", function(): void {
          assert.strictEqual(
            compressTight`this has \r\n a new line`,
            "this has \r\n a new line"
          );
        });

        it("should not remove manual LF newlines", function(): void {
          assert.strictEqual(
            compressTight`this has \n a new line`,
            "this has \n a new line"
          );
        });

        it("should remove consecutive newlines without inserting multiple spaces", function(): void {
          assert.strictEqual(
            compressTight`this has
  
  
  
  
  several new lines`,
            "this hasseveral new lines"
          );
        });

        it("should remove leading newlines without leaving leading spaces", function(): void {
          assert.strictEqual(
            compressTight`
  this has a leading new line`,
            "this has a leading new line"
          );
        });

        it("should remove trailing newlines without leaving trailing spaces", function(): void {
          assert.strictEqual(
            compressTight`this has a trailing new line
  `,
            "this has a trailing new line"
          );
        });

        it("should remove multiple non-connected newlines", function(): void {
          assert.strictEqual(
            compressTight`this
  has several
  new
  lines`,
            "thishas severalnewlines"
          );
        });
      });

      describe("removes whitespace from around individual lines", function(): void {
        it("should remove leading spaces from lines", function(): void {
          assert.strictEqual(
            compressTight`this has 
            indented lines 
            with leading
            spaces`,
            "this hasindented lineswith leadingspaces"
          );
        });

        it("should remove trailing spaces from lines", function(): void {
          assert.strictEqual(
            compressTight`this has 
  lines          
  with trailing                      
  spaces`,
            "this haslineswith trailingspaces"
          );
        });

        it("should remove tabs from lines", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compressTight`this has 
  								tab characters					
  around a line`,
            "this hastab charactersaround a line"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect internal whitespace", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compressTight`this has
          internal          and external tabs				and
          spaces`,
            "this hasinternal          and external tabs				andspaces"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect manual tabs", function(): void {
          assert.strictEqual(
            compressTight`this has 
          \ta manual tab`,
            "this has\ta manual tab"
          );
        });
      });
    });
  });

  context("Behaviour As Methods", function(): void {
    context("#compress", function(): void {
      describe("properly resolves template literals", function(): void {
        it("should not modify single word strings", function(): void {
          assert.strictEqual(compress(`test`), `test`);
        });

        it("should not modify single line strings", function(): void {
          assert.strictEqual(compress(`this IS a tEst`), `this IS a tEst`);
        });

        it("should handle string placeholders properly", function(): void {
          assert.strictEqual(
            compress(`this ${"is"} a ${"test with"} some ${""} strings`),
            `this ${"is"} a ${"test with"} some ${""} strings`
          );

          assert.strictEqual(
            compress(`this has ${""}empty ${""} strings`),
            `this has ${""}empty ${""} strings`
          );
        });

        it("should handle numeric placeholders properly", function(): void {
          assert.strictEqual(
            compress(`${1} | ${2} | ${0}`),
            `${1} | ${2} | ${0}`
          );
          assert.strictEqual(compress(`${NaN}`), `${NaN}`);
          assert.strictEqual(compress(`${Infinity}`), `${Infinity}`);
        });

        it("should handle expression placeholders properly", function(): void {
          assert.strictEqual(compress(`${1 + 456}`), `${1 + 456}`);
          assert.strictEqual(compress(`${Math.sqrt(2)}`), `${Math.sqrt(2)}`);
        });

        it("should handle undefined placeholder properly", function(): void {
          assert.strictEqual(compress(`${undefined}`), `${undefined}`);
        });

        it("should handle null placeholder properly", function(): void {
          assert.strictEqual(compress(`${null}`), `${null}`);
        });

        it("should handle object placeholder properly", function(): void {
          const obj = {x: 56};
          assert.strictEqual(compress(`${obj}`), `${obj}`);
        });

        it("should correctly process all non-newline escape sequences", function(): void {
          assert.strictEqual(
            compress(`\0\v\f\b\\\'\"`),
            `\0\v\f\b\\\'\"` // eslint-disable-line no-useless-escape
          );
        });

        it("should not affect escape characters in placeholders or URIs", function(): void {
          // eslint-disable-next-line no-useless-escape
          const oddString = "c:\\f\\r\\n\\v\\b \0\v\f\b\\'\"";
          assert.strictEqual(compress(`${oddString}`), `${oddString}`);
        });

        // Don't test throws because that's a basic behavior of template literals here
      });

      describe("removes all newlines and replaces with a space", function(): void {
        it("should remove format newlines", function(): void {
          assert.strictEqual(
            compress(`this has
  a new line`),
            "this has a new line"
          );
        });

        it("should remove consecutive newlines without inserting multiple spaces", function(): void {
          assert.strictEqual(
            compress(`this has
  
  
  
  
  several new lines`),
            "this has several new lines"
          );
        });

        it("should remove leading newlines without leaving leading spaces", function(): void {
          assert.strictEqual(
            compress(`
  this has a leading new line`),
            "this has a leading new line"
          );
        });

        it("should remove trailing newlines without leaving trailing spaces", function(): void {
          assert.strictEqual(
            compress(`this has a trailing new line
  `),
            "this has a trailing new line"
          );
        });

        it("should remove multiple non-connected newlines", function(): void {
          assert.strictEqual(
            compress(`this
  has several
  new
  lines`),
            "this has several new lines"
          );
        });
      });

      describe("removes whitespace from around individual lines", function(): void {
        it("should remove leading spaces from lines", function(): void {
          assert.strictEqual(
            compress(`this has 
            indented lines 
            with leading
            spaces`),
            "this has indented lines with leading spaces"
          );
        });

        it("should remove trailing spaces from lines", function(): void {
          assert.strictEqual(
            compress(`this has 
  lines          
  with trailing                      
  spaces`),
            "this has lines with trailing spaces"
          );
        });

        it("should remove tabs from lines", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compress(`this has 
                  tab characters					 
  around a line`),
            "this has tab characters around a line"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect internal whitespace", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compress(`this has
          internal          and external tabs				and
          spaces`),
            "this has internal          and external tabs				and spaces"
          );
          /* eslint-enable no-tabs */
        });
      });
    });

    context("#compressTight", function(): void {
      describe("properly resolves template literals", function(): void {
        it("should not modify single word strings", function(): void {
          assert.strictEqual(compressTight(`test`), `test`);
        });

        it("should not modify single line strings", function(): void {
          assert.strictEqual(compressTight(`this IS a tEst`), `this IS a tEst`);
        });

        it("should handle string placeholders properly", function(): void {
          assert.strictEqual(
            compressTight(`this ${"is"} a ${"test with"} some ${""} strings`),
            `this ${"is"} a ${"test with"} some ${""} strings`
          );

          assert.strictEqual(
            compressTight(`this has ${""}empty ${""} strings`),
            `this has ${""}empty ${""} strings`
          );
        });

        it("should handle numeric placeholders properly", function(): void {
          assert.strictEqual(
            compressTight(`${1} | ${2} | ${0}`),
            `${1} | ${2} | ${0}`
          );
          assert.strictEqual(compressTight(`${NaN}`), `${NaN}`);
          assert.strictEqual(compressTight(`${Infinity}`), `${Infinity}`);
        });

        it("should handle expression placeholders properly", function(): void {
          assert.strictEqual(compressTight(`${1 + 456}`), `${1 + 456}`);
          assert.strictEqual(
            compressTight(`${Math.sqrt(2)}`),
            `${Math.sqrt(2)}`
          );
        });

        it("should handle undefined placeholder properly", function(): void {
          assert.strictEqual(compressTight(`${undefined}`), `${undefined}`);
        });

        it("should handle null placeholder properly", function(): void {
          assert.strictEqual(compressTight(`${null}`), `${null}`);
        });

        it("should handle object placeholder properly", function(): void {
          const obj = {x: 56};
          assert.strictEqual(compressTight(`${obj}`), `${obj}`);
        });

        it("should correctly process all non-newline escape sequences", function(): void {
          assert.strictEqual(
            compressTight(`\0\v\f\b\\\'\"`),
            `\0\v\f\b\\\'\"` // eslint-disable-line no-useless-escape
          );
        });

        it("should not affect escape characters in placeholders or URIs", function(): void {
          // eslint-disable-next-line no-useless-escape
          const oddString = "c:\\f\\r\\n\\v\\b \0\v\f\b\\'\"";
          assert.strictEqual(compressTight(`${oddString}`), `${oddString}`);
        });

        // Don't test throws because that's a basic behavior of template literals here
      });

      describe("removes all newlines and does not replace with a space", function(): void {
        it("should remove format newlines", function(): void {
          assert.strictEqual(
            compressTight(`this has
  a new line`),
            "this hasa new line"
          );
        });

        it("should remove consecutive newlines without inserting multiple spaces", function(): void {
          assert.strictEqual(
            compressTight(`this has
  
  
  
  
  several new lines`),
            "this hasseveral new lines"
          );
        });

        it("should remove leading newlines without leaving leading spaces", function(): void {
          assert.strictEqual(
            compressTight(`
  this has a leading new line`),
            "this has a leading new line"
          );
        });

        it("should remove trailing newlines without leaving trailing spaces", function(): void {
          assert.strictEqual(
            compressTight(`this has a trailing new line
  `),
            "this has a trailing new line"
          );
        });

        it("should remove multiple non-connected newlines", function(): void {
          assert.strictEqual(
            compressTight(`this
  has several
  new
  lines`),
            "thishas severalnewlines"
          );
        });
      });

      describe("removes whitespace from around individual lines", function(): void {
        it("should remove leading spaces from lines", function(): void {
          assert.strictEqual(
            compressTight(`this has 
            indented lines 
            with leading
            spaces`),
            "this hasindented lineswith leadingspaces"
          );
        });

        it("should remove trailing spaces from lines", function(): void {
          assert.strictEqual(
            compressTight(`this has 
  lines          
  with trailing                      
  spaces`),
            "this haslineswith trailingspaces"
          );
        });

        it("should remove tabs from lines", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compressTight(`this has 
                  tab characters					
  around a line`),
            "this hastab charactersaround a line"
          );
          /* eslint-enable no-tabs */
        });

        it("should not affect internal whitespace", function(): void {
          /* eslint-disable no-tabs */
          assert.strictEqual(
            compressTight(`this has
          internal          and external tabs				and
          spaces`),
            "this hasinternal          and external tabs				andspaces"
          );
          /* eslint-enable no-tabs */
        });
      });
    });
  });

  context("Shorthand Tags", function(): void {
    context("#c", function(): void {
      it("should be exactly the same function as #compress", function(): void {
        assert.deepStrictEqual(c, compress);
      });
    });

    context("#t", function(): void {
      it("should be exactly the same function as #compressTight", function(): void {
        assert.deepStrictEqual(t, compressTight);
      });
    });
  });
});
