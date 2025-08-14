import { getResponse, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/query-params.api.ts";

suite("Using the query helper", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("exposes type-safe search-param values in the response resolver", async () => {
    expect.assertions(4); // Make sure assertions in the handler are executed.
    const request = new Request(
      "http://localhost:3000/single-query?page=3&sort=desc&query=test",
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
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(200);
  });

  test("aggregates multiple values for a search-param into an array", async () => {
    expect.assertions(2); // Make sure assertions in the handler are executed.
    const request = new Request(
      "http://localhost:3000/multi-query?id=1&id=2&id=3",
    );

    const handler = http.get("/multi-query", ({ query }) => {
      const ids = query.getAll("id");
      expect(ids).toStrictEqual(["1", "2", "3"]);

      return HttpResponse.json({ id: "test-id" });
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(200);
  });
});
