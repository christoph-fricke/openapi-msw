import { type StrictRequest } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/request-body.api.js";

describe("Given an OpenAPI schema endpoint with request content", () => {
  const http = createOpenApiHttp<paths>();

  test("When the request is used, Then it extend MSW's request object", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toMatchTypeOf<Omit<StrictRequest<null>, "text" | "json">>();
  });

  test("When a request is not expected to contain content, Then json and text return never", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request.toHaveProperty("json").returns.toEqualTypeOf<never>();
  });

  test("When a request is expected to contain content, Then the content is strict-typed", () => {
    type Endpoint = typeof http.post<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });

  test("When a requests uses a special JSON mime type, Then the content is strict-typed", async () => {
    type Endpoint = typeof http.post<"/special-json">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request.toHaveProperty("text").returns.toEqualTypeOf<never>();
    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<{ name: string; value: number }>();
  });

  test("When a request content is optional, Then the content is strict-typed with optional", () => {
    type Endpoint = typeof http.patch<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const request = resolver.parameter(0).toHaveProperty("request");

    request
      .toHaveProperty("json")
      .returns.resolves.toEqualTypeOf<
        { name: string; value: number } | undefined
      >();
  });

  test("When a request accepts multiple media types, Then both body parsers are typed for their media type", () => {
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
});
