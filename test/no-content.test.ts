import { HttpResponse, type StrictResponse } from "msw";
import { describe, expect, test } from "vitest";
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

  test("When a endpoint is mocked, Then responses with content cannot be returned", async () => {
    http.delete(
      "/resource",
      // @ts-expect-error "{ id: number }" is not assignable to "null"
      () => {
        return HttpResponse.json({ id: 42 }, { status: 204 });
      },
    );
  });

  test("When a endpoint is mocked, Then responses must be strict responses", async () => {
    http.delete(
      "/resource",
      // @ts-expect-error Response is not assignable to StrictResponse
      () => {
        return new Response(null, { status: 204 });
      },
    );
  });
});
