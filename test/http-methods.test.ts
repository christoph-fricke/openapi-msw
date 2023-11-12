import { createOpenApiHttp } from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/http-methods.api.js";

describe("Given an OpenAPI endpoint with multiple HTTP methods", () => {
  const http = createOpenApiHttp<paths>();

  test("When the GET method is mocked, Then only paths with GET methods are allowed", () => {
    const path = expectTypeOf<typeof http.get>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/get">();
  });

  test("When the PUT method is mocked, Then only paths with PUT methods are allowed", () => {
    const path = expectTypeOf<typeof http.put>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/put">();
  });

  test("When the POST method is mocked, Then only paths with POST methods are allowed", () => {
    const path = expectTypeOf<typeof http.post>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/post">();
  });

  test("When the PATCH method is mocked, Then only paths with PATCH methods are allowed", () => {
    const path = expectTypeOf<typeof http.patch>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/patch">();
  });

  test("When the DELETE method is mocked, Then only paths with DELETE methods are allowed", () => {
    const path = expectTypeOf<typeof http.delete>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/delete">();
  });

  test("When the OPTIONS method is mocked, Then only paths with OPTIONS methods are allowed", () => {
    const path = expectTypeOf<typeof http.options>().parameter(0);

    path.toEqualTypeOf<"/resource">();
  });

  test("When the HEAD method is mocked, Then only paths with HEAD methods are allowed", () => {
    const path = expectTypeOf<typeof http.head>().parameter(0);

    path.toEqualTypeOf<"/resource">();
  });

  test("When the vanilla HTTP fallback is used, Then any path value is allowed", () => {
    const extractPath = (method: keyof typeof http.untyped) =>
      expectTypeOf<(typeof http.untyped)[typeof method]>()
        .parameter(0)
        .extract<string>();

    extractPath("all").toEqualTypeOf<string>();
    extractPath("get").toEqualTypeOf<string>();
    extractPath("put").toEqualTypeOf<string>();
    extractPath("post").toEqualTypeOf<string>();
    extractPath("patch").toEqualTypeOf<string>();
    extractPath("delete").toEqualTypeOf<string>();
    extractPath("options").toEqualTypeOf<string>();
    extractPath("head").toEqualTypeOf<string>();
  });
});
