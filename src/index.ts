/**
 * @fileoverview **compress-tag** | Template literal tag to remove excess
 * whitespace and newlines from strings.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
 * @license MIT
 */

/**
 * A function that can be used to tag a string template literal.
 * @param strings Array of string values located between the placeholders.
 * @param placeholders Values of the placeholder expressions.
 * @returns The processed template string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates|MDN}
 */
type TemplateLiteralTag = (
  strings: TemplateStringsArray,
  ...placeholders: any[]
) => string;

/**
 * Merge two arrays together into a new array, alternating every other element
 * starting with the first element of `a`. If one array is longer than the
 * other, extra elements will be added onto the end of the result.
 * @param a The array whose first element will be the first element of the
 * output array.
 * @param b The array to merge into `a`.
 * @example
 * merge([1, 2, 3], ["A", "B", "C", "D", "E"]);
 * // => [1, "A", 2, "B", 3, "C", "D", "E"]
 */
function merge<A extends any[], B extends any[]>(
  a: A,
  b: B
): Array<A[number] | B[number]> {
  const result = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if(i in a) result.push(a[i]);
    if(i in b) result.push(b[i]);
  };
  return result;
}

/**
 * Generate a template literal tag that compresses (AKA minifies) a template
 * string. In this context, compress is defined as removing line breaks and
 * trailing / leading spaces from each line.
 * @param tight If `true`, will not include spaces where the line breaks used to
 * be.
 * @returns A template literal tag.
 */
function generateCompressTag(tight: boolean = false): TemplateLiteralTag {
  return function(strings, ...placeholders) {
    return merge(Array.from(strings), placeholders)
      .join("")
      .replace(/\s*[\r\n]+\s*/g, tight ? " " : "")
      .trim();
  }
}

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation), replacing each line
 * break with a single space. Empty lines are removed completely.
 * @param strings Array of string values located between the placeholders.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 * @returns The processed, minified / compressed template string.
 * @example
 * let sampleText = "This is some sample text."
 * compress`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div> <span>This is some sample text.</span> </div>"
 */
export const compress = generateCompressTag();

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation).
 * @param strings Array of string values located between the placeholders.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 * @returns The processed, minified / compressed template string.
 * @example
 * let sampleText = "This is some sample text."
 * compressTight`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div><span>This is some sample text.</span></div>"
 */
export const compressTight = generateCompressTag(true);
