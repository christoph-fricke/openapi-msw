import { type StrictResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/no-content.api.js";

describe("Given an OpenAPI schema endpoint with no-content", () => {
  const http = createOpenApiHttp<paths>();

  test("When an endpoint is mocked, Then responses with content cannot be returned", async () => {
    type Endpoint = typeof http.delete<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns.extract<Response>();

    response.not.toEqualTypeOf<StrictResponse<{ id: number }>>();
  });

  test("When an endpoint is mocked, Then responses must be strict responses", async () => {
    type Endpoint = typeof http.delete<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns.extract<Response>();

    response.not.toEqualTypeOf<Response>();
    response.toEqualTypeOf<StrictResponse<null>>();
  });

  test("When a endpoint with a NoContent response is mocked, Then the no-content option is included in the response union", async () => {
    type Endpoint = typeof http.get<"/no-content-resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns.extract<Response>();

    response.not.toEqualTypeOf<Response>();
    response.toEqualTypeOf<
      StrictResponse<{ id: string; name: string; value: number } | null>
    >();
  });
});
