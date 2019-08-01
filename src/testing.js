function escapeForJSON(text) {
  return text.replace(/\\"/g, '"').replace(/\\['vf0b]|"/g, (ch) => "\\" + ch);
}

const disallowedJSONEscapes = new Map([
  ["\\'", "'"],
  ["\\v", "\v"],
  ["\\f", "\f"],
  ["\\0", "\0"],
  ["\\b", "\b"]
]);

function deescapeForJSON(text) {
  return text.replace(/\\['vf0b]/g, (ch) => disallowedJSONEscapes.get(ch));
}

/**
 * Replace raw escape character strings with their escape characters.
 * @param raw A string where escape characters are represented as raw string
 * values like `\t` rather than `     `.
 * @returns The processed string, with escape characters replaced.
 * @example
 * deescape("\\n");
 * // => "\n"
 */
function deescape(raw) {
  // JSON.parse will do the escaping for us, but the passed string must be
  // quoted and all internal quotes must be escaped
  return deescapeForJSON(JSON.parse('"' + escapeForJSON(raw) + '"'));
}

let text = String.raw`c:\\f\\r\\newfolder\\v\\bin`;
console.log(text);
text = escapeForJSON(text);
console.log(text);
text = `"${text}"`;
console.log(text);
text = JSON.parse(text);
console.log(text);
text = deescapeForJSON(text);
console.log(text);
