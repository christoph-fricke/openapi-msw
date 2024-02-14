import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/query-params.api.js";

describe("Given an OpenAPI schema endpoint with query parameters fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a endpoint is mocked, Then search parameter keys are strict typed", () => {
    http.get("/single-query", ({ query }) => {
      expectTypeOf(query.get)
        .parameter(0)
        .toEqualTypeOf<"sort" | "page" | "query">();
      expectTypeOf(query.getAll)
        .parameter(0)
        .toEqualTypeOf<"sort" | "page" | "query">();
      expectTypeOf(query.has)
        .parameter(0)
        .toEqualTypeOf<"sort" | "page" | "query">();
    });
  });

  test("When a endpoint is mocked, Then search parameters are converted into their stringified version", () => {
    http.get("/single-query", ({ query }) => {
      const sort = query.getAll("sort");
      const page = query.get("page");
      const queryString = query.get("query");

      expectTypeOf(sort).toEqualTypeOf<("asc" | "desc")[]>();
      expectTypeOf(page).toEqualTypeOf<string | null>();
      expectTypeOf(queryString).toEqualTypeOf<string>();
    });
  });

  test("When a endpoint is mocked, Then multiple search parameters are parsed from arrays", () => {
    http.get("/multi-query", ({ query }) => {
      const single = query.get("id");
      const multi = query.getAll("id");
      const singleSortBy = query.get("sortBy");
      const multiSortBy = query.getAll("sortBy");

      expectTypeOf(single).toEqualTypeOf<string | null>();
      expectTypeOf(multi).toEqualTypeOf<string[]>();
      expectTypeOf(singleSortBy).toEqualTypeOf<"asc" | "desc" | null>();
      expectTypeOf(multiSortBy).toEqualTypeOf<("asc" | "desc")[]>();
    });
  });
});
