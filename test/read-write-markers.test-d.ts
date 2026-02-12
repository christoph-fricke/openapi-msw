import type { AsyncResponseResolverReturnType, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/read-write-markers.api.ts";

suite("Generating read-write markers", () => {
  const http = createOpenApiHttp<paths>();

  test("hides readOnly properties in request bodies", () => {
    type Endpoint = typeof http.post<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("json").returns.resolves.toEqualTypeOf<{
      name: string;
      secret: number;
      nested: { name: string; secret: number };
    }>();
  });

  test("hides readOnly properties in optional request bodies", () => {
    type Endpoint = typeof http.patch<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("json").returns.resolves.toEqualTypeOf<
      | {
          name: string;
          secret: number;
          nested: { name: string; secret: number };
        }
      | undefined
    >();
  });

  test("hides writeOnly properties in response helper", () => {
    http.get("/resource", ({ response }) => {
      expectTypeOf(response(200).json).parameter(0).toEqualTypeOf<{
        id: string;
        name: string;
        nested: { id: string; name: string };
      }>();

      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        HttpResponse<{
          id: string;
          name: string;
          nested: { id: string; name: string };
        }>
      >();
    });
  });

  test("hides writeOnly properties in resolver return type", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns;

    response.toEqualTypeOf<
      AsyncResponseResolverReturnType<{
        id: string;
        name: string;
        nested: { id: string; name: string };
      }>
    >();
  });

  test("strips markers from responses with arrays", () => {
    http.get("/resource-list", ({ response }) => {
      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        HttpResponse<{
          ids: number[];
          nested: { id: string; name: string }[];
        }>
      >();
    });
  });
});
