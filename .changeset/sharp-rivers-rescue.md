---
"openapi-msw": minor
---

Changed response body types to be a union of all response bodies for all status codes and media types. This makes it possible to return responses for specified error codes without requiring a type cast. Imagine the following endpoint. Its response body is now typed as `StrictResponse<{ id: string, value: number } | string | null>`.

```yaml
/resource:
  get:
    summary: Get Resource
    operationId: getResource
    responses:
      200:
        description: Success
        content:
          application/json:
            schema:
              type: object
              required: [id, value]
              properties:
                id:
                  type: string
                value:
                  type: integer
      202:
        description: Accepted
        content:
          text/plain:
            schema:
              type: string
      418:
        description: NoContent
```
