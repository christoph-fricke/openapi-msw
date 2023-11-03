<h1 align="center">OpenAPI-MSW</h1>

A tiny, type-safe wrapper around [MSW](https://mswjs.io) to add support for full
type inference from OpenAPI schema definitions that are generated with
[OpenAPI-TS](https://openapi-ts.pages.dev/introduction).

## Installation

You can install OpenAPI-MSW with this shell command:

```bash
npm i -D openapi-msw
```

**Note:** This package has a peer-dependency to MSW **v2**. There is no plan to
provide backwards compatibility for MSW v1.

## Usage Guide

This guide assumes that you already have OpenAPI-TS set up and configured to
generate `paths` definitions. If you have not set it up, please refer to the
[OpenAPI-TS setup guide](https://openapi-ts.pages.dev/introduction) before
continuing with this usage guide.

### Getting Started

Once you have your OpenAPI schema types ready-to-go, you can use OpenAPI-MSW to
create an enhanced version of MSW's `http` object. The enhanced version is
designed to be almost identical to MSW in usage. Using the `http` object created
with OpenAPI-MSW enables multiple type-safety and editor suggestion benefits:

- **Paths:** Only accepts paths that are available for the current HTTP method
- **Params**: Automatically typed with path parameters in the current path
- **Request Body:** Automatically typed with the request-body schema of the
  current path
- **Response:** Automatically forced to match the response-body schema of the
  current path

```typescript
import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
// 1. Import the paths from your OpenAPI schema definitions
import type { paths } from "./your-openapi-schema";

// 2. Provide your paths definition to enable the above benefits during usage
const http = createOpenApiHttp<paths>();

// TS only suggests available GET paths
const getHandler = http.get("/resource/{id}", ({ params }) => {
  const id = params.id;
  return HttpResponse.json({ id /* ... more response data */ });
});

// TS only suggests available POST paths
const postHandler = http.post("/resource", async ({ request }) => {
  const data = await request.json();
  return HttpResponse.json({ ...data /* ... more response data */ });
});

// TS shows an error when "/unknown" is not defined in the OpenAPI schema paths
const otherHandler = http.get("/unknown", () => {
  return new HttpResponse();
});
```

### Provide a Base URL for Paths

You can provide an optional base URL to `createOpenApiHttp`, which is prepended
to all paths. This is especially useful when your application calls your API on
a subpath or another domain. The value can be any string that is resolvable by
MSW.

```typescript
const http = createOpenApiHttp<paths>({ baseUrl: "/api/rest" });

// Requests will be matched by MSW against "/api/rest/resource"
export const getHandler = http.get("/resource", () => {
  return HttpResponse.json(/* ... */);
});
```

### Handling Unknown Paths

MSW handlers can be very flexible with the ability to define wildcards (\*) in a
path. This can be very useful for catch-all handlers but clashes with your
OpenAPI spec, since it probably is not an endpoint of your API. To define
handlers that are unknown to your OpenAPI spec, you can access the original
`http` object through `http.untyped`.

```typescript
const http = createOpenApiHttp<paths>();

// Fallback to MSW's original implementation and typings
const catchAll = http.untyped.all("/resource/*", ({ params }) => {
  return HttpResponse.json(/* ... */);
});
```

Alternatively, you can import the original `http` object from MSW and use that
one for unknown paths instead.

## License

This package is published under the [MIT license](./LICENSE).
