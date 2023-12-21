import { describe, expect, it } from "vitest";
import { convertToColonPath } from "./path-mapping.js";

describe(convertToColonPath, () => {
  it("should leave paths with no path fragments untouched", () => {
    const result = convertToColonPath("/users");

    expect(result).toBe("/users");
  });

  it("should convert a path fragment to colon convention", () => {
    const result = convertToColonPath("/users/{id}");

    expect(result).toBe("/users/:id");
  });

  it("should convert all fragments in a path to colon convention", () => {
    const result = convertToColonPath("/users/{userId}/posts/{postIds}");

    expect(result).toBe("/users/:userId/posts/:postIds");
  });

  it("should append a baseUrl to the path when provided", () => {
    const noBaseUrl = convertToColonPath("/users");
    const withBaseUrl = convertToColonPath("/users", "https://localhost:3000");

    expect(noBaseUrl).toBe("/users");
    expect(withBaseUrl).toBe("https://localhost:3000/users");
  });
});
