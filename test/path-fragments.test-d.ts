import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/path-fragments.api.js";

describe("Given an OpenAPI schema endpoint that contains path fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

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
});
