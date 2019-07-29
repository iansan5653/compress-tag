/**
 * @file **compress-tag** | Template literal tag to remove excess
 * whitespace and newlines from strings.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
 * @license MIT
 */

/**
 * A function that can be used to tag a string template literal.
 * @param stringOrStrings A single string value, or when used as a template
 * literal tag, the automatically generated `TemplateStringsArray`.
 * @param placeholders Values of the placeholder expressions.
 * @returns The processed template string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates|MDN}
 */
type ChainableTemplateLiteralTag = <T extends TemplateStringsArray | string>(
  stringOrStrings: T,
  ...placeholders: T extends TemplateStringsArray ? any[] : []
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
    if (i in a) result.push(a[i]);
    if (i in b) result.push(b[i]);
  }
  return result;
}

/**
 * Map of raw escape strings to the characters they represent.
 */
const escapeCharacters = new Map<string, string>([
  ["\\r", "\r"],
  ["\\n", "\n"],
  ["\\t", "\t"],
  ["\\0", "\0"],
  ["\\v", "\v"],
  ["\\'", "'"],
  ['\\"', '"'],
  ["\\b", "\b"],
  ["\\f", "\f"],
  ["\\\\", "\\"]
]);

/**
 * Replace raw escape character strings with their escape characters.
 * @param raw A string where escape characters are represented as raw string
 * values like `\t` rather than `     `.
 * @returns The processed string, with escape characters replaced.
 * @example
 * deescape("\\n");
 * // => "\n"
 */
function deescape(raw: string): string {
  return raw.replace(
    /\\(?:[rnt0v'"bf]|\\)/g,
    (v): string => escapeCharacters.get(v) || v
  );
}

function replaceBreaksAndTrim(text: string, tight: boolean) {
  return text.replace(/\s*[\r\n]+\s*/g, tight ? "" : " ").trim();
}

/**
 * Generate a template literal tag that compresses (AKA minifies) a template
 * string. In this context, compress is defined as removing line breaks and
 * trailing / leading spaces from each line.
 *
 * If you desire a linebreak to be present in the final result, you must provide
 * it as a linebreak character. (`\n` or `\r\n`). If you desire indentation in
 * the result, you must include that as a tab character `\t`.
 * @param tight If `true`, will not include spaces where the line breaks used to
 * be.
 * @returns A template literal tag.
 */
function generateCompressTag(
  tight: boolean = false
): ChainableTemplateLiteralTag {
  return function(stringOrStrings, ...placeholders): string {
    if (typeof stringOrStrings === "string") {
      return replaceBreaksAndTrim(stringOrStrings, tight);
    }

    const combined = merge(
      Array.from((stringOrStrings as TemplateStringsArray).raw),
      placeholders
    ).reduce((result, element): string => result + element, "");
    return deescape(replaceBreaksAndTrim(combined, tight));
  };
}

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation), replacing each line
 * break with a single space. Empty lines are removed completely.
 * 
 * Can be used either as a template literal tag or as a function that accepts
 * a string. This section option is used when the template literal already must
 * be tagged with some other tag.
 *
 * If you desire a linebreak to be present in the final result, you must provide
 * it as a linebreak character. (`\n` or `\r\n`). If you desire indentation in
 * the result, you must include that as a tab character `\t`.
 * @example
 * let sampleText = "This is some sample text."
 * compress`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div> <span>This is some sample text.</span> </div>"
 * @example
 * compress(uppercase`
 *   This is some
 *   sample text.
 * `)
 * // => "THIS IS SOME SAMPLE TEXT."
 * @returns The processed, minified / compressed string.
 * @param stringOrStrings A string to process, or (when used as a template
 * literal tag), an automatically generated `TemplateStringsArray`.
 *
 * **Note:** You should typically not need to pass a `TemplateStringsArray`
 * directly to the function. Instead, use it as a template literal tag per the
 * example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 */
export const compress = generateCompressTag();

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation).
 * 
 * Can be used either as a template literal tag or as a function that accepts
 * a string. This section option is used when the template literal already must
 * be tagged with some other tag.
 *
 * If you desire a linebreak to be present in the final result, you must provide
 * it as a linebreak character. (`\n` or `\r\n`). If you desire indentation in
 * the result, you must include that as a tab character `\t`.
 * @example
 * let sampleText = "This is some sample text."
 * compressTight`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div><span>This is some sample text.</span></div>"
 * @example
 * compressTight(uppercase`
 *   This is some
 *   sample text.
 * `)
 * // => "THIS IS SOMESAMPLE TEXT."
 * @returns The processed, minified / compressed string.
 * @param stringOrStrings A string to process, or (when used as a template
 * literal tag), an automatically generated `TemplateStringsArray`.
 *
 * **Note:** You should typically not need to pass a `TemplateStringsArray`
 * directly to the function. Instead, use it as a template literal tag per the
 * example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 */
export const compressTight = generateCompressTag(true);

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation), replacing each line
 * break with a single space. Empty lines are removed completely.
 * 
 * Can be used either as a template literal tag or as a function that accepts
 * a string. This section option is used when the template literal already must
 * be tagged with some other tag.
 *
 * If you desire a linebreak to be present in the final result, you must provide
 * it as a linebreak character. (`\n` or `\r\n`). If you desire indentation in
 * the result, you must include that as a tab character `\t`.
 * @example
 * let sampleText = "This is some sample text."
 * c`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div> <span>This is some sample text.</span> </div>"
 * @example
 * c(uppercase`
 *   This is some
 *   sample text.
 * `)
 * // => "THIS IS SOME SAMPLE TEXT."
 * @returns The processed, minified / compressed string.
 * @param stringOrStrings A string to process, or (when used as a template
 * literal tag), an automatically generated `TemplateStringsArray`.
 *
 * **Note:** You should typically not need to pass a `TemplateStringsArray`
 * directly to the function. Instead, use it as a template literal tag per the
 * example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 */
export const c = compress;

/**
 * Parses the string and placeholders as normal, then removes any line breaks
 * and the spaces surrounding each line (ie, indentation).
 * 
 * Can be used either as a template literal tag or as a function that accepts
 * a string. This section option is used when the template literal already must
 * be tagged with some other tag.
 *
 * If you desire a linebreak to be present in the final result, you must provide
 * it as a linebreak character. (`\n` or `\r\n`). If you desire indentation in
 * the result, you must include that as a tab character `\t`.
 * @example
 * let sampleText = "This is some sample text."
 * t`
 *   <div>
 *     <span>${sampleText}</span>
 *   </div>
 * `
 * // => "<div><span>This is some sample text.</span></div>"
 * @example
 * cT(uppercase`
 *   This is some
 *   sample text.
 * `)
 * // => "THIS IS SOMESAMPLE TEXT."
 * @returns The processed, minified / compressed string.
 * @param stringOrStrings A string to process, or (when used as a template
 * literal tag), an automatically generated `TemplateStringsArray`.
 *
 * **Note:** You should typically not need to pass a `TemplateStringsArray`
 * directly to the function. Instead, use it as a template literal tag per the
 * example.
 * @param placeholders Values of the placeholder expressions.
 *
 * **Note:** You should typically not need to pass this value directly to the
 * function. Instead, use it as a template literal tag per the example.
 */
export const t = compressTight;
