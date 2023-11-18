import { HttpResponse, type StrictResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/no-content.api.js";

describe("Given an OpenAPI schema endpoint with no-content", () => {
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
});
