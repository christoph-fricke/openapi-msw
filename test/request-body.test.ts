import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/request-body.api.js";

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
});
