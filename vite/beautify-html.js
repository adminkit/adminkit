// Formats the built pages the way the Metalsmith build did: tab indented, at most
// one blank line in a row. Inline scripts and styles are re-indented along with the markup.
import beautify from "js-beautify";

const options = {
  indent_size: 1,
  indent_char: "\t",
  preserve_newlines: true,
  max_preserve_newlines: 1,
  wrap_line_length: 160,
};

export default function beautifyHtml() {
  return {
    name: "beautify-html",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (html) => beautify.html(html, options),
    },
  };
}
