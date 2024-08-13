import { describe, expectTypeOf, test } from "vitest";
import type { OptionsTypeParams } from "../src/types/types.js";
import type {
  PathsPetFindByStatusGetParametersQueryStatus,
  paths,
} from "./fixtures/example.api.js";

describe("Query type tests", () => {
  test("Check is query type are valid when is filled", () => {
    expectTypeOf<
      OptionsTypeParams<paths, "get", "/pet/findByStatus">["query"]
    >().toEqualTypeOf<{
      status: PathsPetFindByStatusGetParametersQueryStatus;
    }>();
  });

  test("Check is query type are valid when is empty", () => {
    expectTypeOf<
      OptionsTypeParams<paths, "get", "/pet/{petId}">["query"]
    >().toEqualTypeOf<never>();
  });
});
