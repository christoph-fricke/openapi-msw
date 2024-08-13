import { describe, expectTypeOf, test } from "vitest";
import type { OptionsTypeParams } from "../src/types/types.js";
import type { paths } from "./fixtures/example.api.js";

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
});
