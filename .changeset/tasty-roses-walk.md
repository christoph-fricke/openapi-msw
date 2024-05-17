---
"openapi-msw": minor
---

Added `response` helper to the resolver-info argument. It provides an granular type-safety when creating HTTP responses. Instead of being able to return any status code, `response` limits status codes, content types, and their response bodies to the combinations defined by the given OpenAPI spec.

```typescript
/*
Imagine this endpoint specification for the following example:

/response-example:
  get:
    summary: Get Resource
    operationId: getResource
    responses:
      200:
        description: Success
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Resource"
          text/plain:
            schema:
              type: string
              enum: ["Hello", "Goodbye"]
      204:
        description: NoContent
      "5XX":
        description: Error
        content:
          text/plain:
            schema:
              type: string
*/

const handler = http.get("/response-example", ({ response }) => {
  // Error: Status Code 204 only allows empty responses
  const invalidRes = response(204).text("Hello");

  // Error: Status Code 200 only allows "Hello" as text
  const invalidRes = response(200).text("Some other string");

  // No Error: This combination is part of the defined OpenAPI spec
  const validRes = response(204).empty();

  // No Error: This combination is part of the defined OpenAPI spec
  const validRes = response(200).text("Hello");

  // Using a wildcard requires you to provide a matching status code for the response
  const validRes = response("5XX").text("Fatal Error", { status: 503 });
});
```
