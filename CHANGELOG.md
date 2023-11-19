# openapi-msw

## 0.2.2

### Patch Changes

- [#31](https://github.com/christoph-fricke/openapi-msw/pull/31) [`556dfca`](https://github.com/christoph-fricke/openapi-msw/commit/556dfca3a2c87eeec6f1f7acd2db63af52df2806) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Fixed a type mismatch between path fragment types and the values provided at runtime, which are always strings. Now all path-fragments are typed as string. If a fragment's schema is a string constrained by an enum, the resulting string literals are preserved. This fixes bug [#22](https://github.com/christoph-fricke/openapi-msw/issues/22).

  ```typescript
  const handler = http.get("/resource/{id}", ({ params }) => {
    // Previously calling "parseInt(...)" caused a type error
    // when the schema type for "id" is defined as number.
    const id = parseInt(params.id);

    return HttpResponse.json({ id });
  });
  ```

## 0.2.1

### Patch Changes

- [#27](https://github.com/christoph-fricke/openapi-msw/pull/27) [`232ae11`](https://github.com/christoph-fricke/openapi-msw/commit/232ae11b46bda40ec493b4eed6c270e4a9160a00) Thanks [@luchsamapparat](https://github.com/luchsamapparat)! - Fixed a compilation warning in projects using OpenAPI-MSW, which was caused by missing sources in source maps.

## 0.2.0

### Minor Changes

- [#24](https://github.com/christoph-fricke/openapi-msw/pull/24) [`bfd7a99`](https://github.com/christoph-fricke/openapi-msw/commit/bfd7a997c662c29bac8a91ea0952993c20dadee8) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added JSDoc comments to public API for improved DX.

### Patch Changes

- [#23](https://github.com/christoph-fricke/openapi-msw/pull/23) [`29ecb9c`](https://github.com/christoph-fricke/openapi-msw/commit/29ecb9cbccff09d042fe3e55552c906e22f6054c) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Fixed a small naming mistake in the "Getting Started" code example.

## 0.1.2

### Patch Changes

- [#17](https://github.com/christoph-fricke/openapi-msw/pull/17) [`2931f0c`](https://github.com/christoph-fricke/openapi-msw/commit/2931f0c37e5ca66378ec2a9596e07736b417a96b) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Fixed OpenAPI operations with no-content responses cannot return a response. Now they are required to return an empty response, i.e. `null` as response body.

  ```typescript
  const http = createOpenApiHttp<paths>();

  // Resolver function is required to return a `StrictResponse<null>` (empty response)
  // if the OpenAPI operation specifies `content?: never` for the response.
  const noContent = http.delete("/resource", ({ params }) => {
    return HttpResponse.json(null, { status: 204 });
  });
  ```

## 0.1.1

### Patch Changes

- [#12](https://github.com/christoph-fricke/openapi-msw/pull/12) [`96ce15c`](https://github.com/christoph-fricke/openapi-msw/commit/96ce15c5f81535fb1091143dab2dce671ba65836) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Add legacy entrypoint definitions (types, module) for tools and bundlers that do not understand package.json#exports fields.

## 0.1.0

### Minor Changes

- [#9](https://github.com/christoph-fricke/openapi-msw/pull/9) [`6364870`](https://github.com/christoph-fricke/openapi-msw/commit/636487083c131f582507b096318d114c97131630) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added installation and complete usage guide to the documentation.

- [#5](https://github.com/christoph-fricke/openapi-msw/pull/5) [`d15a0c2`](https://github.com/christoph-fricke/openapi-msw/commit/d15a0c2720f4d51415309f432cdc50aefb90f25f) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `createOpenApiHttp(...)` to create a thin, type-safe wrapper around [MSW](https://mswjs.io/)'s `http` that uses [openapi-ts](https://openapi-ts.pages.dev/introduction/) `paths`:

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
