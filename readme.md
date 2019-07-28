# compress-tag

[![Build Status](https://dev.azure.com/iansan5653/compress-tag/_apis/build/status/iansan5653.compress-tag?branchName=master)](https://dev.azure.com/iansan5653/compress-tag/_build/latest?definitionId=2&branchName=master) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Test Results](https://dev.azure.com/iansan5653/compress-tag/_build/results?buildId=14&view=ms.vss-test-web.build-test-results-tab)

`compress-tag` is a tiny module that enables significantly more readable code by
improving the display of
[string template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
in your source.

This module provides a template literal tag that removes line breaks and indents
from your template literals, so that a string that is formatted to nicely fit in
your code still comes out looking like it should.

This allows you to keep all lines of code within whatever limit you prefer
without having to resort to hacks like adding each line of string to the
previous or escaping each linebreak.

```js
let paragraph = c`
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sagittis
  mi quam, ut rhoncus nisi pulvinar in. Duis lobortis nisl libero, non imperdiet
  lectus ultrices sed. Aliquam erat volutpat. Sed egestas dignissim iaculis.
  Etiam felis risus, tempor ac dignissim id, vestibulum in mauris. Nam attempus
  tellus. Aliquam vitae metus tempor, tempus tellus id, vulputate magna. Vivamus
  a enim feugiat, mattis leo in, blandit nunc. Cras faucibus pellentesque dolor,
  et euismod mauris sagittis vitae. Quisque egestas metus pretium mollis tempor.
`;
```

## Installation

Install with:

```bash
npm i compress-tag
```

## Usage

Four template literal tag functions are exported by this module. `compress` and
`c` are exactly the same - they replace your linebreaks and the whitespace
surrounding each line with a single space. `compressTight` and `t` are also the
same - they remove your linebreaks and whitespace with no space.

### Examples

```js
import {compress, c, compressTight, t} from "compress-tag";

let A = compress`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Suspendisse  sagittis mi quam, ut rhoncus nisi pulvinar in. Duis lobortis nisl
  libero, non imperdiet lectus ultrices sed. Aliquam erat volutpat. Sed egestas
  dignissim iaculis. Etiam felis risus, tempor ac dignissim id, vestibulum in
  mauris. Nam attempus tellus. Aliquam vitae metus tempor, tempus tellus id,
  vulputate magna. Vivamus a enim feugiat, mattis leo in, blandit nunc. Cras
  faucibus pellentesque dolor, et euismod mauris sagittis vitae. Quisque egestas
  metus pretium mollis tempor.`;
// => Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sagittis mi quam, ut rhoncus nisi pulvinar in. Duis lobortis nisl libero, non imperdiet lectus ultrices sed. Aliquam erat volutpat. Sed egestas dignissim iaculis. Etiam felis risus, tempor ac dignissim id, vestibulum in mauris. Nam attempus tellus. Aliquam vitae metus tempor, tempus tellus id, vulputate magna. Vivamus a enim feugiat, mattis leo in, blandit nunc. Cras faucibus pellentesque dolor, et euismod mauris sagittis vitae. Quisque egestas metus pretium mollis tempor.

let B = c`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
  sagittis mi quam, ut rhoncus nisi pulvinar in. Duis lobortis nisl libero, non
  imperdiet lectus ultrices sed. Aliquam erat volutpat. Sed egestas dignissim
  iaculis. Etiam felis risus, tempor ac dignissim id, vestibulum in mauris. Nam
  attempus tellus. Aliquam vitae metus tempor, tempus tellus id, vulputate
  magna. Vivamus a enim feugiat, mattis leo in, blandit nunc. Cras faucibus
  pellentesque dolor, et euismod mauris sagittis vitae. Quisque egestas metus
  pretium mollis tempor.`;
// => Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sagittis mi quam, ut rhoncus nisi pulvinar in. Duis lobortis nisl libero, non imperdiet lectus ultrices sed. Aliquam erat volutpat. Sed egestas dignissim iaculis. Etiam felis risus, tempor ac dignissim id, vestibulum in mauris. Nam attempus tellus. Aliquam vitae metus tempor, tempus tellus id, vulputate magna. Vivamus a enim feugiat, mattis leo in, blandit nunc. Cras faucibus pellentesque dolor, et euismod mauris sagittis vitae. Quisque egestas metus pretium mollis tempor.

let C = compressTight`
  <section>
    <h1>Heading</h1>
    <p>This is the content of the section.</p>
    <p>This is another paragraph.</p>
  </section>
`;
// => <section><h1>Heading</h1><p>This is the content of the section.</p><p>This is another paragraph.</p></section>

let D = t`
  <section>
    <h1>Heading</h1>
    <p>This is the content of the section.</p>
    <p>This is another paragraph.</p>
  </section>
`;
// => <section><h1>Heading</h1><p>This is the content of the section.</p><p>This is another paragraph.</p></section>
```

### Preserving Some Linebreaks

You can still output a string that has linebreaks in it simply by using the
newline character instead of an actual linebreak. For example:

```js
let E = c`This has\n a new line`.
// => This has
// a new line.
```
