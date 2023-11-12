import { HttpResponse, type StrictResponse } from "msw";
import { describe, expect, expectTypeOf, test } from "vitest";
import { createOpenApiHttp } from "../exports/main.js";
import type { paths } from "./fixtures/response-content.api.js";

describe("Given an OpenAPI schema endpoint with response content", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a JSON endpoint is mocked, Then a fitting response content can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", () => {
      return HttpResponse.json({ id: "test-id", name: "Test", value: 16 });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody).toStrictEqual({
      id: "test-id",
      name: "Test",
      value: 16,
    });
    expect(result?.response?.status).toBe(200);
  });

  test("When a TEXT endpoint is mocked, Then text response content can be returned", async () => {
    const request = new Request(
      new URL("/text-resource", "http://localhost:3000"),
      {
        method: "get",
      },
    );

    const handler = http.get("/text-resource", () => {
      return HttpResponse.text("Hello World");
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.text();
    expect(responseBody).toBe("Hello World");
    expect(result?.response?.status).toBe(200);
  });

  test("When a JSON endpoint is mocked, Then responses must be strict content response", async () => {
    type Endpoint = typeof http.get<"/resource">;
    const resolver = expectTypeOf<Endpoint>().parameter(1);
    const response = resolver.returns.extract<Response>();

    response.not.toEqualTypeOf<Response>();
    response.toEqualTypeOf<
      StrictResponse<{ id: string; name: string; value: number }>
    >();
  });
});
