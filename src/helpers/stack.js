import Handlebars from "handlebars";

// {{#push "scripts"}}…{{/push}} adds its output to a named stack; {{stack "scripts"}} prints
// the stack in push order. The stacks live on @root, the context of one page render.
const stacks = Symbol("stacks");

export function push(name, options) {
  const root = options.data.root;
  root[stacks] ??= {};
  (root[stacks][name] ??= []).push(options.fn(this));
}

export function stack(name, options) {
  return new Handlebars.SafeString(
    options.data.root[stacks]?.[name]?.join("") ?? ""
  );
}
