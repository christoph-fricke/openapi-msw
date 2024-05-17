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
designed to be almost identical to MSW in usage. To go beyond MSW's typing
capabilities, OpenAPI-MSW provides optional helpers for an even better type-safe
experience. Using the `http` object created with OpenAPI-MSW enables multiple
type-safety and editor suggestion benefits:

- **Paths:** Only accepts paths that are available for the current HTTP method
- **Params**: Automatically typed with path parameters in the current path
- **Query Params**: Automatically typed with the query parameters schema of the
  current path
- **Request Body:** Automatically typed with the request-body schema of the
  current path
- **Response:** Automatically forced to match an specified status-code,
  content-type, and response-body schema of the current path

```typescript
import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
// 1. Import the paths from your OpenAPI schema definitions
import type { paths } from "./your-openapi-schema";

// 2. Provide your paths definition to enable the above benefits during usage
const http = createOpenApiHttp<paths>();

// TS only suggests available GET paths
const getHandler = http.get("/resource/{id}", ({ params, response }) => {
  const id = params.id;
  return response(200).json({ id /* ... more response data */ });
});

// TS only suggests available POST paths
const postHandler = http.post(
  "/resource",
  async ({ request, query, response }) => {
    const sortDir = query.get("sort");

    const data = await request.json();
    return response(201).json({ ...data /* ... more response data */ });
  },
);

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

### Optional Helpers

For an even better type-safe experience, OpenAPI-MSW provides optional helpers
that are attached to MSW's resolver-info argument. Currently, the helper `query`
is provided for type-safe access to query parameters. Furthermore, the helper
`response` can be used for enhanced type-safety when creating HTTP responses.

#### `query` Helper

Type-safe wrapper around
[`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams)
that implements methods for reading query parameters. For the following example,
imagine an OpenAPI specification that defines some query parameters:

- **filter**: required string
- **sort**: optional string enum of "desc" and "asc"
- **sortBy**: optional array of strings

```typescript
const http = createOpenApiHttp<paths>();

const handler = http.get("/query-example", ({ query }) => {
  const filter = query.get("filter"); // string
  const sort = query.get("sort"); // "asc" | "desc" | null
  const sortBy = query.getAll("sortBy"); // string[]

  // Supported methods from URLSearchParams: get(), getAll(), has(), size
  if (query.has("sort", "asc")) {
    /* ... */
  }

  return HttpResponse.json({
    /* ... */
  });
});
```

#### `response` Helper

Type-safe response constructor that narrows allowed response bodies based on the
chosen status code and content type. This helper enables granular type-safety
for responses. Instead of being able to return any status code, `response`
limits status codes, content types, and their response bodies to the
combinations defined by the given OpenAPI spec.

For the following example, imagine an OpenAPI specification that defines various
responses for an endpoint:

| Status Code | Content Type       | Content                |
| :---------- | :----------------- | :--------------------- |
| `200`       | `application/json` | _Some Object Schema_   |
| `200`       | `text/plain`       | Literal: "Hello World" |
| `204`       | Empty              |                        |

```typescript
const http = createOpenApiHttp<paths>();

const handler = http.get("/response-example", ({ response }) => {
  // Error: Status Code 204 only allows empty responses
  const invalidRes = response(204).text("Hello World");

  // Error: Status Code 200 does not allow empty responses
  const invalidRes = response(200).empty();

  // Error: Status Code 200 only allows "Hello World" as text
  const invalidRes = response(200).text("Some other string");

  // No Error: This combination is part of the defined OpenAPI spec
  const validRes = response(204).empty();

  // No Error: This combination is part of the defined OpenAPI spec
  const validRes = response(200).text("Hello World");

  // No Error: This combination is part of the defined OpenAPI spec
  const validRes = response(200).json({
    /* ... */
  });
});
```

##### Wildcard Status Codes

The OpenAPI specification allows the
[definition of wildcard status codes](https://spec.openapis.org/oas/v3.1.0#patterned-fields-0),
such as `"default"`, `"3XX"`, and `"5XX"`. OpenAPI-MSW's `response` helper
supports using wildcards as status codes. When a wildcard is used, TypeScript
requires you to provide a matching status code that will be used for the
response. Allowed status codes are inferred by TS and suggested based on
[RFC 9110](https://httpwg.org/specs/rfc9110.html#overview.of.status.codes).

**Note:** The `"default"` wildcard is categorized as
["any error status code" in OpenAPI-TS](https://github.com/drwpow/openapi-typescript/blob/a7dbe90905e07921147a2239c0323d778d1a72de/packages/openapi-typescript-helpers/index.d.ts#L8).
To align with this assumption, OpenAPI-MSW only allows matching `"4XX"` and
`"5XX"` status codes for the response if the `"default"` wildcard is used.

```typescript
const http = createOpenApiHttp<paths>();

const handler = http.get("/wildcard-status-code-example", ({ response }) => {
  // Error: A wildcards is used but no status code provided
  const invalidRes = response("5XX").text("Fatal Error");

  // Error: Provided status code does not match the used wildcard
  const invalidRes = response("5XX").text("Fatal Error", { status: 403 });

  // Error: Provided status code is not defined in RFC 9110
  const invalidRes = response("5XX").text("Fatal Error", { status: 520 });

  // No Error: Provided status code matches the used wildcard
  const validRes = response("5XX").text("Fatal Error", { status: 503 });

  // No Error: "default" wildcard allows 5XX and 4XX status codes
  const validRes = response("default").text("Fatal Error", { status: 507 });
});
```

##### Untyped Response Fallback

Sometimes an OpenAPI spec might not define all status codes that are actually
returned by the implementing API. This can be quite common for server error
responses (5XX). Nonetheless, still being able to mock those with MSW through
otherwise fully typed http-handlers is really helpful. OpenAPI-MSW supports this
scenario with an `untyped` wrapper on the `response` helper, which type-casts
any response into an allowed response.

```typescript
const http = createOpenApiHttp<paths>();

const handler = http.get("/untyped-response-example", ({ response }) => {
  // Any response wrapped with `untyped` can be returned regardless
  // of the expected response body.
  return response.untyped(
    HttpResponse.json({ message: "Teapot" }, { status: 418 }),
  );
});
```

## License

This package is published under the [MIT license](./LICENSE).
