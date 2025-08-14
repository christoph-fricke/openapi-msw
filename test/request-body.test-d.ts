import { type StrictRequest } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/request-body.api.ts";

suite("Accessing requests bodies", () => {
  const http = createOpenApiHttp<paths>();

  test("extends MSW's request object", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toExtend<StrictRequest<null>>();
  });

  test("returns never when json() or text() is called for requests with no expected content", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request.toHaveProperty("json").returns.toEqualTypeOf<never>();
  });

  test("provides strict types for requests with expected JSON content", () => {
    type Endpoint = typeof http.post<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });

  test("provides strict types for requests with special JSON mime type content", () => {
    type Endpoint = typeof http.post<"/special-json">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });

  test("types the content as optional for requests with optional content", () => {
    type Endpoint = typeof http.patch<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<
        { name: string; value: number } | undefined
      >();
  });

  test("provides types to each parsing method for requests that accept multiple media types", () => {
    type Endpoint = typeof http.post<"/multi-body">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request
      .toHaveProperty("text")
      .returns.resolves.toEqualTypeOf<"Hello" | "Goodbye">();
    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });

  test("preserves the typing of a request when the request is cloned", () => {
    type Endpoint = typeof http.post<"/multi-body">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");
    const cloned = request.toHaveProperty("clone").returns;

    cloned
      .toHaveProperty("text")
      .returns.resolves.toEqualTypeOf<"Hello" | "Goodbye">();
    cloned
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });
});
