export default function (v1, operator, v2, options) {
  var operators = {
    "==": v1 == v2 ? true : false,
    "===": v1 === v2 ? true : false,
    "!=": v1 != v2 ? true : false,
    "!==": v1 !== v2 ? true : false,
    ">": v1 > v2 ? true : false,
    ">=": v1 >= v2 ? true : false,
    "<": v1 < v2 ? true : false,
    "<=": v1 <= v2 ? true : false,
    "||": v1 || v2 ? true : false,
    "&&": v1 && v2 ? true : false,
  };
  if (Object.hasOwn(operators, operator)) {
    if (operators[operator]) {
      return options.fn(this);
    }
    return options.inverse(this);
  }
  return console.error('Error: Expression "' + operator + '" not found');
}
