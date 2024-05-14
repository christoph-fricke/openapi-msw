import { type StrictResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/response-content.api.js";

describe("Given an OpenAPI schema endpoint with response content", () => {
  const http = createOpenApiHttp<paths>();

  test("When a JSON endpoint is mocked, Then responses must be a strict content response", async () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns.extract<Response>();

    response.not.toEqualTypeOf<Response>();
    response.toEqualTypeOf<
      StrictResponse<
        | { id: string; name: string; value: number }
        | "Hello"
        | "Goodbye"
        | { error: string; code: number }
      >
    >();
  });

  test("When the response untyped fallback is used, Then any response is casted to the expected response body", async () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.parameter(0).toHaveProperty("response");
    const untyped = response.toHaveProperty("untyped");

    untyped.toBeFunction();
    untyped.parameter(0).toEqualTypeOf<Response>();
    untyped.returns.toEqualTypeOf<
      StrictResponse<
        | { id: string; name: string; value: number }
        | "Hello"
        | "Goodbye"
        | { error: string; code: number }
      >
    >();
  });
});
