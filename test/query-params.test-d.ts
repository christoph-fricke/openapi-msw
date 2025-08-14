import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/query-params.api.ts";

suite("Using the query helper", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("provides strict-typed search-param names for endpoints with defined search-params", () => {
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

  test("converts search-param value types into stringified types", () => {
    http.get("/single-query", ({ query }) => {
      const sort = query.getAll("sort");
      const page = query.get("page");
      const queryString = query.get("query");

      expectTypeOf(sort).toEqualTypeOf<("asc" | "desc")[]>();
      expectTypeOf(page).toEqualTypeOf<string | null>();
      expectTypeOf(queryString).toEqualTypeOf<string>();
    });
  });

  test("parses search-param value types from multi-param definitions", () => {
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

  test("accepts no search-param names for endpoints with no defined search-params", () => {
    http.get("/no-query", ({ query }) => {
      expectTypeOf(query.get).parameter(0).toEqualTypeOf<never>();
      expectTypeOf(query.getAll).parameter(0).toEqualTypeOf<never>();
      expectTypeOf(query.has).parameter(0).toEqualTypeOf<never>();
    });
  });
});
