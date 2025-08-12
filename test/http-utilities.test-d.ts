import {
  createOpenApiHttp,
  type PathsFor,
  type RequestBodyFor,
  type ResponseBodyFor,
} from "openapi-msw";
import { describe, expectTypeOf, test } from "vitest";
import type { paths } from "./fixtures/http-utilities.api.ts";

describe("Given an OpenApiHttpHandlers namespace", () => {
  const http = createOpenApiHttp<paths>();

  test("When paths are extracted, Then a path union is returned", () => {
    const result = expectTypeOf<PathsFor<typeof http.get>>();

    result.toEqualTypeOf<"/resource" | "/resource/{id}">();
  });

  test("When the request body is extracted, Then the request body is returned", () => {
    const result =
      expectTypeOf<RequestBodyFor<typeof http.post, "/resource">>();
    const resultNoBody =
      expectTypeOf<RequestBodyFor<typeof http.get, "/resource/{id}">>();

    result.toEqualTypeOf<{ name: string }>();
    resultNoBody.toEqualTypeOf<never>();
  });

  test("When the response body is extracted, Then the response body is returned", () => {
    const result =
      expectTypeOf<ResponseBodyFor<typeof http.get, "/resource">>();
    const resultNoBody =
      expectTypeOf<ResponseBodyFor<typeof http.post, "/resource">>();

    result.toEqualTypeOf<{ id: string; name: string }>();
    resultNoBody.toEqualTypeOf<null>();
  });
});
