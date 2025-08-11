import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          root: "src",
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          root: "test",
          typecheck: { enabled: true },
        },
      },
    ],
  },
});
