# openapi-msw

## 0.1.0

### Minor Changes

- [#9](https://github.com/christoph-fricke/openapi-msw/pull/9)
  [`6364870`](https://github.com/christoph-fricke/openapi-msw/commit/636487083c131f582507b096318d114c97131630)
  Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added
  installation and complete usage guide to the documentation.

- [#5](https://github.com/christoph-fricke/openapi-msw/pull/5)
  [`d15a0c2`](https://github.com/christoph-fricke/openapi-msw/commit/d15a0c2720f4d51415309f432cdc50aefb90f25f)
  Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added
  `createOpenApiHttp(...)` to create a thin, type-safe wrapper around
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
