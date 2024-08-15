import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";

// Fix for constructor-super rule, structuredClone was added in Node 17
// eslint-disable-next-line no-undef
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

export default tsEslint.config(
  {
    ignores: ["coverage", "cjs", "dist", "test/fixtures/*.ts"],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        // Often types are computed and expanded in editor previews,
        // which can lead to verbose and hard-to-understand type signatures.
        // Interfaces keep their name in previews, which can be used to clarify
        // previews by using interfaces that only extend a type.
        {
          allowInterfaces: "with-single-extends",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": "off",
      "constructor-super": "error",
    },
  },
);
