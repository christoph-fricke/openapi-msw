import {
  createOpenApiHttp,
  type PathsFor,
  type RequestBodyFor,
  type ResponseBodyFor,
} from "openapi-msw";
import { expectTypeOf, suite, test } from "vitest";
import type { paths } from "./fixtures/http-utilities.api.ts";

suite("Using request-handler utilities", () => {
  const http = createOpenApiHttp<paths>();

  test("extracts the expected path union from a request handler", () => {
    const result = expectTypeOf<PathsFor<typeof http.get>>();

    result.toEqualTypeOf<"/resource" | "/resource/{id}">();
  });

  test("extracts the request body from a request handler", () => {
    const result =
      expectTypeOf<RequestBodyFor<typeof http.post, "/resource">>();
    const resultNoBody =
      expectTypeOf<RequestBodyFor<typeof http.get, "/resource/{id}">>();

    result.toEqualTypeOf<{ name: string }>();
    resultNoBody.toEqualTypeOf<never>();
  });

  test("extracts the response body from a request handler", () => {
    const result =
      expectTypeOf<ResponseBodyFor<typeof http.get, "/resource">>();
    const resultNoBody =
      expectTypeOf<ResponseBodyFor<typeof http.post, "/resource">>();

    result.toEqualTypeOf<{ id: string; name: string }>();
    resultNoBody.toEqualTypeOf<null>();
  });
});
