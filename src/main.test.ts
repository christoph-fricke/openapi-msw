import { test, expect } from "vitest";
import { init } from "./main.js";

test("init returns Hello World", () => {
  const result = init();

  expect(result).toBe("Hello World");
});
