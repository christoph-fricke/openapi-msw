import { getResponse, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/request-body.api.ts";

suite("Accessing requests bodies", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("exposes the request content to response resolvers", async () => {
    const request = new Request("http://localhost:3000/resource", {
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
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(response?.status).toBe(201);
    expect(responseBody).toStrictEqual({
      id: "test-id",
      name: "test-name",
      value: 16,
    });
  });
});
