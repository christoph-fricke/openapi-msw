import type { AsyncResponseResolverReturnType, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/response-content.api.ts";

suite("Mocking responses in resolver functions", () => {
  const http = createOpenApiHttp<paths>();

  test("enforces strict-types for the response content", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns;

    response.toEqualTypeOf<
      AsyncResponseResolverReturnType<
        | { id: string; name: string; value: number }
        | "Hello"
        | "Goodbye"
        | { error: string; code: number }
        | null
      >
    >();
  });

  test("enforces strict status codes for the response helper", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.parameter(0).toHaveProperty("response");

    response.toBeFunction();
    response.parameters.toEqualTypeOf<
      [status: 200 | 204 | 418 | "5XX" | "default"]
    >();
  });

  test("limits available content types for the response helper when a status code is provided", () => {
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

  test("enforces strict content types for the response helper when a status code and content type are chosen", () => {
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

      expectTypeOf(response("5XX").json).parameters.toEqualTypeOf<
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

  test("returns strict-typed responses when the response helper is used", () => {
    http.get("/resource", ({ response }) => {
      expectTypeOf(response(200).text).returns.toEqualTypeOf<
        HttpResponse<"Hello" | "Goodbye">
      >();

      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        HttpResponse<{ id: string; name: string; value: number }>
      >();

      expectTypeOf(response(204).empty).returns.toEqualTypeOf<
        HttpResponse<null>
      >();

      expectTypeOf(response("default").json).returns.toEqualTypeOf<
        HttpResponse<{ error: string; code: number }>
      >();
    });
  });

  test("casts responses to match the expected body when the fallback helper is used", () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.parameter(0).toHaveProperty("response");
    const untyped = response.toHaveProperty("untyped");

    untyped.toBeFunction();
    untyped.parameter(0).toEqualTypeOf<Response>();
    untyped.returns.toEqualTypeOf<
      HttpResponse<
        | { id: string; name: string; value: number }
        | "Hello"
        | "Goodbye"
        | { error: string; code: number }
        | null
      >
    >();
  });

  test("returns strict-typed responses with the helper when special JSON mime types are used", () => {
    http.get("/special-json", ({ response }) => {
      expectTypeOf(response(200).json).returns.toEqualTypeOf<
        HttpResponse<{ id: string; name: string; value: number }>
      >();

      expectTypeOf(response(401).json).returns.toEqualTypeOf<
        HttpResponse<{ error: string; code: number }>
      >();
    });
  });
});
