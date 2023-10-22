---
"openapi-msw": minor
---

Added `createOpenApiHttp(...)` to create a thin, type-safe wrapper around
[MSW](https://mswjs.io/)'s `http` that uses
[openapi-ts](https://openapi-ts.pages.dev/introduction/) `paths`:

```ts
import type { paths } from "./openapi-ts-definitions";

const http = createOpenApiHttp<paths>();

// Define handlers with fully typed paths, path params, and request/response bodies
const handler = http.get("/pets/{id}", () => {
  /* ... */
});

// Fallback to default http implementation
const catchAll = http.untyped.all("*", () => {
  /* ... */
});
```
