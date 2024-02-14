---
"openapi-msw": minor
---

Added `query` helper to resolver info. It provides a type-safe wrapper around `URLSearchParams` for reading search params. As usual, the information about available params is inferred from your OpenAPI spec.

```ts
/*
Imagine this endpoint specification for the following example:
/query-example:
  get:
    summary: Query Example
    operationId: getQueryExample
    parameters:
      - name: query
        in: query
        required: true
        schema:
          type: string
      - name: page
        in: query
        schema:
          type: number
      - name: sort
        in: query
        required: false
        schema:
          type: string
          enum: ["asc", "desc"]
      - name: sortBy
        in: query
        schema:
          type: array
          items:
            type: string
*/
const handler = http.get("/query-example", ({ query }) => {
  const queryString = query.get("query"); // Typed as string
  const page = query.get("page"); // Typed as string | null since it is not required
  const sort = query.get("sort"); // Typed as "asc" | "desc" | null
  const sortBy = query.getAll("sortBy"); // Types as string[]

  // Supported methods from URLSearchParams: get(), getAll(), has(), size
  const exists = query.has("sort");

  return HttpResponse.json({
    /* ... */
  });
});
```
