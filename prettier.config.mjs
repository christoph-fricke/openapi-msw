/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-organize-imports"],
  proseWrap: "always",
  overrides: [
    {
      files: [".changeset/*.md", "CHANGELOG.md"],
      options: {
        proseWrap: "never",
      },
    },
  ],
};
