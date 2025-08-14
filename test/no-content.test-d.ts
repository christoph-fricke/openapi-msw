import type { AsyncResponseResolverReturnType } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/no-content.api.ts";

suite("Mocking no-content routes", () => {
  const http = createOpenApiHttp<paths>();

  test("expect a response with an empty body", () => {
    type Endpoint = typeof http.delete<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns;

    response.toEqualTypeOf<AsyncResponseResolverReturnType<null>>();
  });

  test("combines multiple status codes with content and no-content into a response union", () => {
    type Endpoint = typeof http.get<"/no-content-resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns;

    response.toEqualTypeOf<
      AsyncResponseResolverReturnType<{
        id: string;
        name: string;
        value: number;
      } | null>
    >();
  });
});
