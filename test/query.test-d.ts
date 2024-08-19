import { describe, expectTypeOf, test } from "vitest";
import type { RouteQuery } from "../src/types/schemeTypes.js";
import type {
  PathsPetFindByStatusGetParametersQueryStatus,
  paths,
} from "./fixtures/example.api.js";

describe("Query type tests", () => {
  test("Check is query type are valid when is filled", () => {
    expectTypeOf<
      RouteQuery<paths, "get", "/pet/findByStatus">
    >().toEqualTypeOf<{
      status: PathsPetFindByStatusGetParametersQueryStatus;
    }>();
  });

  test("Check is query type are valid when is empty", () => {
    expectTypeOf<
      RouteQuery<paths, "get", "/pet/{petId}">
    >().toEqualTypeOf<never>();
  });
});
