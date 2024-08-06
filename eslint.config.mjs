import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: ["coverage", "cjs", "dist", "test/fixtures/*.ts"],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    files: ["test/**/*.test-d.ts"],
    // Type tests commonly create a variable which is only used for type checks.
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        // Often types are computed and expanded in editor previews,
        // which can lead to verbose and hard-to-understand type signatures.
        // Interfaces keep their name in previews, which can be used to clarify
        // previews by using interfaces that only extend a type.
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
);
