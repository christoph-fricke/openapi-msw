---
"openapi-msw": patch
---

Fixed OpenAPI operations with no-content responses cannot return a response. Now they are required to return an empty response, i.e. `null` as response body.

```typescript
const http = createOpenApiHttp<paths>();

// Resolver function is required to return a `StrictResponse<null>` (empty response)
// if the OpenAPI operation specifies `content?: never` for the response.
const noContent = http.delete("/resource", ({ params }) => {
  return HttpResponse.json(null, { status: 204 });
});
```
