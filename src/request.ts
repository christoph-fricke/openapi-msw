import type { JSONLike, TextLike } from "./type-utils.js";

/** A type-safe request helper that enhances native body methods based on the given OpenAPI spec. */
export interface OpenApiRequest<RequestMap> extends Request {
  json(): JSONLike<RequestMap> extends never
    ? never
    : Promise<JSONLike<RequestMap>>;
  text(): TextLike<RequestMap> extends never
    ? never
    : TextLike<RequestMap> extends string
      ? Promise<TextLike<RequestMap>>
      : never;
}
