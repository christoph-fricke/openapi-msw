import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/options.api.js";

describe("Given a created HTTP object with options", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "http://localhost:3000" });

  test("When a OpenAPI handler is created, Then the baseUrl is prepended to the path", async () => {
    const handler = http.get("/resource", () => {
      return HttpResponse.json({ id: "test-id" });
    });

    expect(handler.info.path).toBe("http://localhost:3000/resource");
  });

  test("When a vanilla handler is created, Then the baseUrl is not prepended to the path", async () => {
    const handler = http.untyped.get("/some-resource", () => {
      return HttpResponse.json();
    });

    expect(handler.info.path).toBe("/some-resource");
  });
});
