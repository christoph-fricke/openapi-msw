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
        | null
      >
    >();
  });

  test("When the response helper is used, Then available status codes are strict typed", async () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.parameter(0).toHaveProperty("response");

    response.toBeFunction();
    response.parameters.toEqualTypeOf<
      [status: 200 | 204 | 418 | "5XX" | "default"]
    >();
  });

  test("When a status code is given to the response helper, Then available content types get limited", async () => {
    http.get("/resource", ({ response }) => {
      expectTypeOf(response(200).text).toBeFunction();
      expectTypeOf(response(200).json).toBeFunction();
      expectTypeOf(response(200).empty).toEqualTypeOf<unknown>();

      expectTypeOf(response(418).text).toEqualTypeOf<unknown>();
      expectTypeOf(response(418).json).toBeFunction();
      expectTypeOf(response(418).empty).toEqualTypeOf<unknown>();

      expectTypeOf(response(204).text).toEqualTypeOf<unknown>();
      expectTypeOf(response(204).json).toEqualTypeOf<unknown>();
      expectTypeOf(response(204).empty).toBeFunction();

      expectTypeOf(response("5XX").text).toEqualTypeOf<unknown>();
      expectTypeOf(response("5XX").json).toBeFunction();
      expectTypeOf(response("5XX").empty).toEqualTypeOf<unknown>();

      expectTypeOf(response("default").text).toEqualTypeOf<unknown>();
      expectTypeOf(response("default").json).toBeFunction();
      expectTypeOf(response("default").empty).toEqualTypeOf<unknown>();
    });
  });

  test("When a status code and content type are chosen, Then the specific response content is strict typed", async () => {
    http.get("/resource", ({ response }) => {
      expectTypeOf(response(200).text).parameters.toEqualTypeOf<
        [
          body: "Hello" | "Goodbye",
          init?: void | {
            headers?: HeadersInit;
            type?: ResponseType;
            statusText?: string;
          },
        ]
      >();

      expectTypeOf(response(418).json).parameters.toEqualTypeOf<
        [
          body: { error: string; code: number },
          init?: void | {
            headers?: HeadersInit;
            type?: ResponseType;
            statusText?: string;
          },
        ]
      >();

      expectTypeOf(response(204).empty).parameters.toEqualTypeOf<
        [
          init?: void | {
            headers?: HeadersInit;
            type?: ResponseType;
            statusText?: string;
          },
        ]
      >();

      expectTypeOf(response("5XX").json).parameters.branded.toEqualTypeOf<
        [
          body: { error: string; code: number },
          init: {
            status: 500 | 501 | 502 | 503 | 504 | 507 | 508 | 510 | 511;
            headers?: HeadersInit;
            type?: ResponseType;
            statusText?: string;
          },
        ]
      >();
    });
  });

  test("When the response helper is used, Then the matching strict-typed responses are returned", async () => {
    http.get("/resource", ({ response }) => {
      expectTypeOf(response(200).text).returns.toEqualTypeOf<
        StrictResponse<"Hello" | "Goodbye">
      >();

      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        StrictResponse<{ id: string; name: string; value: number }>
      >();

      expectTypeOf(response(204).empty).returns.toEqualTypeOf<
        StrictResponse<null>
      >();

      expectTypeOf(response("default").json).returns.toEqualTypeOf<
        StrictResponse<{ error: string; code: number }>
      >();
    });
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
        | null
      >
    >();
  });

  test("When special JSON mime types are used, Then the response json helper still works", async () => {
    http.get("/special-json", ({ response }) => {
      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        StrictResponse<{ id: string; name: string; value: number }>
      >();

      expectTypeOf(response(401).json).returns.toEqualTypeOf<
        StrictResponse<{ error: string; code: number }>
      >();
    });
  });
});
