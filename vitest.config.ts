import { name } from "./package.json";
import { defineProject } from "vitest/config";

const suite = process.env["TEST_SUITE"];

function getTestDir(suite?: string): string | undefined {
  switch (suite) {
    case "unit":
      return "src";
    case "integration":
      return "test";
    default:
      return undefined;
  }
}

export default defineProject({
  test: {
    name: suite ?? name,
    dir: getTestDir(suite),
    typecheck: {
      include: ["**/*.test.ts"],
    },
  },
});
