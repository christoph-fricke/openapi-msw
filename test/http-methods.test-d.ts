import { createOpenApiHttp } from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/http-methods.api.ts";

suite("Calling HTTP methods", () => {
  const http = createOpenApiHttp<paths>();

  test("expects only GET methods when 'get' is called", () => {
    const path = expectTypeOf<typeof http.get>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/get">();
  });

  test("expects only PUT methods when 'put' is called", () => {
    const path = expectTypeOf<typeof http.put>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/put">();
  });

  test("expects only POST methods when 'post' is called", () => {
    const path = expectTypeOf<typeof http.post>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/post">();
  });

  test("expects only PATCH methods when 'patch' is called", () => {
    const path = expectTypeOf<typeof http.patch>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/patch">();
  });

  test("expects only DELETE methods when 'delete' is called", () => {
    const path = expectTypeOf<typeof http.delete>().parameter(0);

    path.toEqualTypeOf<"/resource" | "/resource/delete">();
  });

  test("expects only OPTIONS methods when 'options' is called", () => {
    const path = expectTypeOf<typeof http.options>().parameter(0);

    path.toEqualTypeOf<"/resource">();
  });

  test("expects only HEAD methods when 'head' is called", () => {
    const path = expectTypeOf<typeof http.head>().parameter(0);

    path.toEqualTypeOf<"/resource">();
  });

  test("expects any string when the untyped HTTP fallback is used", () => {
    const extractPath = (method: keyof typeof http.untyped) => {
      return expectTypeOf<(typeof http.untyped)[typeof method]>()
        .parameter(0)
        .extract<string>();
    };

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
