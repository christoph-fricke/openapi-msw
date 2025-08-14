import { HttpResponse, getResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/no-content.api.ts";

suite("Mocking no-content routes", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("returns responses with an empty body for DELETE requests", async () => {
    const request = new Request("http://localhost:3000/resource", {
      method: "delete",
    });

    const handler = http.delete("/resource", () => {
      return new HttpResponse(null, { status: 204 });
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(204);
    expect(response?.body).toBeNull();
  });

  test("returns responses with an empty body for POST requests", async () => {
    const request = new Request("http://localhost:3000/resource", {
      method: "post",
    });

    const handler = http.post("/resource", () => {
      return new HttpResponse(null, { status: 201 });
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(201);
    expect(response?.body).toBeNull();
  });
});
