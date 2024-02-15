---
"openapi-msw": minor
---

Added `query` helper to resolver-info argument. It provides a type-safe wrapper around `URLSearchParams` for reading search parameters. As usual, the information about available parameters is inferred from your OpenAPI spec.

```typescript
/*
Imagine this endpoint specification for the following example:

/query-example:
  get:
    summary: Query Example
    operationId: getQueryExample
    parameters:
      - name: filter
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
  const filter = query.get("filter"); // Typed as string
  const page = query.get("page"); // Typed as string | null since it is not required
  const sort = query.get("sort"); // Typed as "asc" | "desc" | null
  const sortBy = query.getAll("sortBy"); // Typed as string[]

  // Supported methods from URLSearchParams: get(), getAll(), has(), size
  if (query.has("sort", "asc")) {
    /* ... */
  }

  return HttpResponse.json({
    /* ... */
  });
});
```
