// Puts a licence banner on top of the built stylesheet. The CSS minifier drops comments,
// so the banner cannot live in the Sass source.
export default function banner(fileName, text) {
  return {
    name: "adminkit-banner",
    apply: "build",
    generateBundle(_options, bundle) {
      const asset = bundle[fileName];

      if (asset?.type === "asset") {
        asset.source = `${text}\n${asset.source}`;
      }
    },
  };
}
