import { expect, suite, test } from "vitest";
import { convertToColonPath } from "./path-mapping.ts";

suite(convertToColonPath, () => {
  test("leaves paths with no path fragments untouched", () => {
    const result = convertToColonPath("/users");

    expect(result).toBe("/users");
  });

  test("converts a path fragment to colon convention", () => {
    const result = convertToColonPath("/users/{id}");

    expect(result).toBe("/users/:id");
  });

  test("converts all fragments in a path to colon convention", () => {
    const result = convertToColonPath("/users/{userId}/posts/{postIds}");

    expect(result).toBe("/users/:userId/posts/:postIds");
  });

  test("appends a baseUrl to the path when provided", () => {
    const noBaseUrl = convertToColonPath("/users");
    const withBaseUrl = convertToColonPath("/users", "https://localhost:3000");

    expect(noBaseUrl).toBe("/users");
    expect(withBaseUrl).toBe("https://localhost:3000/users");
  });
});
