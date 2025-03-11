---
"openapi-msw": minor
---

Added utility types for creating type-safe functionality around OpenAPI-MSW. Special thanks to [@DrewHoo](https://github.com/DrewHoo) for suggesting and inspiring this change.

```typescript
import {
  createOpenApiHttp,
  type PathsFor,
  type RequestBodyFor,
  type ResponseBodyFor,
} from "openapi-msw";

const http = createOpenApiHttp<paths>();

// A union of all possible GET paths.
type Paths = PathsFor<typeof http.get>;

// The request body for POST /tasks.
type RequestBody = RequestBodyFor<typeof http.post, "/tasks">;

// The response body for GET /tasks.
type ResponseBody = ResponseBodyFor<typeof http.get, "/tasks">;
```
