import { describe, expect, expectTypeOf, test } from "vitest";
import { createOpenApiHttp } from "../exports/main.js";
import type { paths } from "./fixtures/path-fragments.api.js";
import { HttpResponse } from "msw";

describe("Given an OpenAPI schema endpoint that contains path fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a endpoint is mocked, Then OpenAPI path fragments can be parsed by the handler", async () => {
    const request = new Request(
      new URL("/resource/test-id/test-name", "http://localhost:3000"),
    );

    const handler = http.get("/resource/{id}/{name}", ({ params }) => {
      return HttpResponse.json({ id: params.id, name: params.name });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody?.id).toBe("test-id");
    expect(responseBody?.name).toBe("test-name");
  });

  test("When an endpoint is mocked, Then the path fragments are strict-typed", () => {
    type Endpoint = typeof http.get<"/resource/{id}/{name}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ id: string; name: string }>();
  });

  test("When a endpoint contains no path fragments, Then no params are provided", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<never>();
  });

  // FIXME: See https://github.com/christoph-fricke/openapi-msw/issues/22
  test.skip("When a path fragments is defined as non-string, Then the fragment is still typed as a string", async () => {
    const request = new Request(
      new URL("/resource/42", "http://localhost:3000"),
    );

    const handler = http.get("/resource/{count}", ({ params }) => {
      const count = params.count;

      return HttpResponse.json({ count });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody?.count).toBe(42);
  });
});
