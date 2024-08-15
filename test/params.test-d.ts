import { describe, expectTypeOf, test } from "vitest";
import type {
  FetcherWithBodyParameters,
  FetcherWithoutBodyParameters,
} from "../src/types/requestParameters.js";
import type { OptionsTypeParams } from "../src/types/schemeTypes.js";
import type { paths } from "./fixtures/example.api.js";

type IsUndefinable<T> = T extends undefined ? true : never;
type IsNotUndefinable<T> = IsUndefinable<T> extends never ? true : never;

describe("Params type tests", () => {
  test("Check is params type are valid when is filled", () => {
    expectTypeOf<
      OptionsTypeParams<paths, "get", "/pet/{petId}">["params"]
    >().toEqualTypeOf<{ petId: number }>();
  });

  test("Check is params type are valid when is empty", () => {
    expectTypeOf<
      OptionsTypeParams<paths, "get", "/pet/findByStatus">["params"]
    >().toEqualTypeOf<never>();
  });

  test("Check is bodyless method, options params type are may be required", () => {
    expectTypeOf<
      IsNotUndefinable<
        FetcherWithoutBodyParameters<paths, "get", "/pet/findByStatus">[1]
      >
    >().toMatchTypeOf<true>();
  });

  test("Check is bodyless method, options params type are may be optional", () => {
    expectTypeOf<
      IsUndefinable<
        FetcherWithoutBodyParameters<paths, "get", "/user/{username}">[1]
      >
    >().toMatchTypeOf<true>();
  });

  test("Check is method with body, body params type are may be required", () => {
    expectTypeOf<
      IsNotUndefinable<FetcherWithBodyParameters<paths, "post", "/pet">[1]>
    >().toMatchTypeOf<true>();
  });

  test("Check is method with body, body params type are may be optional", () => {
    expectTypeOf<
      IsUndefinable<
        FetcherWithBodyParameters<paths, "post", "/pet/{petId}/uploadImage">[1]
      >
    >().toMatchTypeOf<true>();
  });

  test("Check is method with body, options params type are may be required", () => {
    expectTypeOf<
      IsNotUndefinable<
        FetcherWithBodyParameters<paths, "post", "/pet/{petId}">[2]
      >
    >().toMatchTypeOf<true>();
  });

  test("Check is method with body, options params type are may be optional", () => {
    expectTypeOf<
      IsUndefinable<FetcherWithBodyParameters<paths, "post", "/pet">[2]>
    >().toMatchTypeOf<true>();
  });
});
