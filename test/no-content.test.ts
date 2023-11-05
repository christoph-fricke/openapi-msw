import { HttpResponse, type StrictResponse } from "msw";
import { describe, expect, expectTypeOf, test } from "vitest";
import { createOpenApiHttp } from "../exports/main.js";
import type { paths } from "./fixtures/no-content.api.js";

describe("Given an OpenAPI schema with a no-content endpoint", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When the DELETE method is mocked, Then empty responses can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "delete",
    });

    const handler = http.delete("/resource", () => {
      return new HttpResponse(null, { status: 204 }) as StrictResponse<null>;
    });
    const result = await handler.run({ request });

    expect(result?.response?.body).toBeNull();
    expect(result?.response?.status).toBe(204);
  });

  test("When the POST method is mocked, Then empty responses can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "post",
    });

    const handler = http.post("/resource", () => {
      return new HttpResponse(null, { status: 201 }) as StrictResponse<null>;
    });
    const result = await handler.run({ request });

    expect(result?.response?.body).toBeNull();
    expect(result?.response?.status).toBe(201);
  });

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
});
