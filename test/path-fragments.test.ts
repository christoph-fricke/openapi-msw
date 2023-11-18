import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/path-fragments.api.js";

describe("Given an OpenAPI schema endpoint that contains path fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a endpoint is mocked, Then OpenAPI path fragments can be parsed by the handler", async () => {
    const request = new Request(
      new URL("/resource/test-id/test-name", "http://localhost:3000"),
    );

    const handler = http.get("/resource/{id}/{name}", ({ params }) => {
      return HttpResponse.json({ id: params.id, name: params.name });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody?.id).toBe("test-id");
    expect(responseBody?.name).toBe("test-name");
  });

  test("When a path fragment is defined as a number, Then it can be parsed to a number", async () => {
    const request = new Request(
      new URL("/resource/42", "http://localhost:3000"),
    );

    const handler = http.get("/resource/{count}", ({ params }) => {
      const count = parseInt(params.count);

      return HttpResponse.json({ count });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody?.count).toBe(42);
  });
});
