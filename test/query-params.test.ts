import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/query-params.api.js";

describe("Given an OpenAPI schema endpoint with query parameters fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a endpoint is mocked, Then query parameters can be accessed through a 'query' helper", async () => {
    expect.assertions(4); // Make sure that assertion in handler is executed.
    const request = new Request(
      new URL(
        "/single-query?page=3&sort=desc&query=test",
        "http://localhost:3000",
      ),
    );

    const handler = http.get("/single-query", ({ query }) => {
      const sort = query.getAll("sort");
      const page = query.get("page");
      const queryString = query.get("query");

      expect(sort).toEqual(["desc"]);
      expect(page).toBe("3");
      expect(queryString).toBe("test");

      return HttpResponse.json({ id: "test-id" });
    });
    const result = await handler.run({ request });

    expect(result?.response?.status).toBe(200);
  });

  test("When a endpoint is mocked, Then multiple query parameters are grouped into an array", async () => {
    expect.assertions(2); // Make sure that assertion in handler is executed.
    const request = new Request(
      new URL("/multi-query?id=1&id=2&id=3", "http://localhost:3000"),
    );

    const handler = http.get("/multi-query", ({ query }) => {
      const ids = query.getAll("id");
      expect(ids).toStrictEqual(["1", "2", "3"]);

      return HttpResponse.json({ id: "test-id" });
    });
    const result = await handler.run({ request });

    expect(result?.response?.status).toBe(200);
  });
});
