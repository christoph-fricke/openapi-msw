import { type StrictRequest } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/request-body.api.js";

describe("Given an OpenAPI schema endpoint with request content", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a request is expected to contain content, Then the content is strict-typed", () => {
    type Endpoint = typeof http.post<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toEqualTypeOf<StrictRequest<{ name: string; value: number }>>();
  });

  test("When a request content is optional, Then the content is strict-typed with optional", () => {
    type Endpoint = typeof http.patch<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toEqualTypeOf<
      StrictRequest<{ name: string; value: number } | undefined>
    >();
  });

  test("When a request is not expected to contain content, Then the content is undefined", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toEqualTypeOf<StrictRequest<undefined>>();
  });
});
