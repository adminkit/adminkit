export default function (from, to, inc, block) {
  block = block || {
    fn: function () {
      return arguments[0];
    },
  };

  var data = block.data || { index: null };

  var output = "";
  for (var i = from; i <= to; i += inc) {
    data["index"] = i;
    output += block.fn(i, { data: data });
  }

  return output;
}
