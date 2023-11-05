import { describe, expect, expectTypeOf, test } from "vitest";
import { createOpenApiHttp } from "../src/openapi-http.js";
import type { paths } from "./fixtures/request-body.api.js";
import { HttpResponse, type StrictRequest } from "msw";

describe("Given an OpenAPI schema endpoint with request content", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a request contains content, Then the content can be used in the response", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "post",
      body: JSON.stringify({ name: "test-name", value: 16 }),
    });

    const handler = http.post("/resource", async ({ request }) => {
      const newResource = await request.json();
      return HttpResponse.json(
        { ...newResource, id: "test-id" },
        { status: 201 },
      );
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(result?.response?.status).toBe(201);
    expect(responseBody).toStrictEqual({
      id: "test-id",
      name: "test-name",
      value: 16,
    });
  });

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
