import type { FilterKeys } from "openapi-typescript-helpers";
import type { JSONLike } from "./type-utils.js";

/** A type-safe request helper that enhances native body methods based on the given OpenAPI spec. */
export interface OpenApiRequest<RequestMap> extends Request {
  json(): JSONLike<RequestMap> extends never
    ? never
    : Promise<JSONLike<RequestMap>>;
  text(): FilterKeys<RequestMap, `text/${string}`> extends never
    ? never
    : FilterKeys<RequestMap, `text/${string}`> extends string
      ? Promise<FilterKeys<RequestMap, `text/${string}`>>
      : never;
}
