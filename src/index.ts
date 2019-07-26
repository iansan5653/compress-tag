/**
 * @fileoverview compress-tag | Template literal tag to remove excess whitespace
 * and newlines from strings.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
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
 * Generate a template literal tag that compresses (AKA minifies) a template
 * string. In this context, compress is defined as removing line breaks and
 * trailing / leading spaces from each line.
 * @param tight If `true`, will not include spaces where the line breaks used to
 * be.
 * @returns A template literal tag.
 */
function generateCompressTag(tight: boolean = false): TemplateLiteralTag {
  return function(strings, ...placeholders) {
    return strings
      .reduce((result, string, i) => (result + placeholders[i - 1] + string))
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
