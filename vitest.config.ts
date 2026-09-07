import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          root: "src",
        },
      },
      {
        test: {
          name: "integration",
          root: "test",
          typecheck: { enabled: true },
        },
      },
    ],
  },
});
