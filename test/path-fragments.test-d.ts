import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/path-fragments.api.js";

describe("Given an OpenAPI schema endpoint that contains path fragments", () => {
  const http = createOpenApiHttp<paths>();

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

  test("When a path fragment is typed with non-string types, Then the type is converted to string", async () => {
    // The values passed in by MSW will always be strings at runtime.
    // Therefore, we convert to to enable runtime parsing, e.g. parseInt(...).
    type Endpoint = typeof http.get<"/resource/{count}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ count: string }>();
  });

  test("When a path fragment is typed with string literals, Then the literals are preserved", async () => {
    type Endpoint = typeof http.get<"/resource/{enum}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ enum: "test1" | "test2" }>();
  });
});
