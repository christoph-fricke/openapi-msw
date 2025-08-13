/* eslint-disable @typescript-eslint/no-explicit-any */
import { http as mswHttp } from "msw";
import { expect, suite, test, vi } from "vitest";
import type { HttpMethod } from "./api-spec.ts";
import { createOpenApiHttp } from "./openapi-http.ts";

const methods: HttpMethod[] = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
];

suite(createOpenApiHttp, () => {
  test("creates an http handlers object", () => {
    const http = createOpenApiHttp();

    expect(http).toBeTypeOf("object");
    for (const method of methods) {
      expect(http[method]).toBeTypeOf("function");
    }
  });

  test("includes the original MSW methods in its return type", () => {
    const http = createOpenApiHttp();

    expect(http.untyped).toBe(mswHttp);
  });
});

suite.each(methods)("OpenAPI %s http handlers", (method) => {
  test("forwards its arguments to MSW", () => {
    using spy = vi.spyOn(mswHttp, method);
    const resolver = vi.fn();

    const http = createOpenApiHttp<any>();
    http[method]("/test", resolver, { once: false });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("/test", expect.any(Function), {
      once: false,
    });
  });

  test("converts OpenAPI paths to MSW compatible paths", () => {
    using spy = vi.spyOn(mswHttp, method);
    const resolver = vi.fn();

    const http = createOpenApiHttp<any>();
    http[method]("/test/{id}", resolver);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      "/test/:id",
      expect.any(Function),
      undefined,
    );
  });

  test("prepends a configured baseUrl to the path for MSW", () => {
    using spy = vi.spyOn(mswHttp, method);
    const resolver = vi.fn();

    const http = createOpenApiHttp<any>({ baseUrl: "*/api/rest" });
    http[method]("/test", resolver);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      "*/api/rest/test",
      expect.any(Function),
      undefined,
    );
  });
});
