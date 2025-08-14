import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/options.api.ts";

suite("Providing HTTP factory options", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "http://localhost:3000" });

  test("prepends a given baseUrl to the given path", () => {
    const handler = http.get("/resource", () => {
      return HttpResponse.json({ id: "test-id" });
    });

    expect(handler.info.path).toBe("http://localhost:3000/resource");
  });

  test("does not prepend a given baseUrl for vanilla handlers", () => {
    const handler = http.untyped.get("/some-resource", () => {
      return HttpResponse.json();
    });

    expect(handler.info.path).toBe("/some-resource");
  });
});
