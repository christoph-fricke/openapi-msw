import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/path-fragments.api.ts";

suite("Mocking paths with fragments", () => {
  const http = createOpenApiHttp<paths>();

  test("provides strict-typed params", () => {
    type Endpoint = typeof http.get<"/resource/{id}/{name}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ id: string; name: string }>();
  });

  test("does not provide params for paths with no fragments", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<never>();
  });

  test("converts non-string fragment types to string", () => {
    // The values passed in by MSW will always be strings at runtime.
    // Therefore, we convert to to enable runtime parsing, e.g. parseInt(...).
    type Endpoint = typeof http.get<"/resource/{count}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ count: string }>();
  });

  test("preserves string literal fragment types", () => {
    type Endpoint = typeof http.get<"/resource/{enum}">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const params = resolver.parameter(0).toHaveProperty("params");

    params.toEqualTypeOf<{ enum: "test1" | "test2" }>();
  });
});
