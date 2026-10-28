import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "public/**",
      "node_modules/**",
      "src/js/modules/vector-maps/**",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
