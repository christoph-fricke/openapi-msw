import type {
  ConvertToStringified,
  MapToValues,
  ResolvedObjectUnion,
} from "./type-utils.ts";

/** Base type that any api spec should extend. */
export type AnyApiSpec = NonNullable<unknown>;

/** Intersection of HTTP methods that are supported by both OpenAPI-TS and MSW. */
export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch";

/** Returns a union of all paths that exists in an api spec for a given method. */
export type PathsForMethod<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
> = {
  [Path in keyof ApiSpec]: ApiSpec[Path] extends Record<Method, unknown>
    ? Path
    : never;
}[keyof ApiSpec];

/** Extract the path params of a given path and method from an api spec. */
export type PathParams<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: { path: any };
    }
    ? ConvertToStringified<ApiSpec[Path][Method]["parameters"]["path"]>
    : never
  : never;

/** Extract the query params of a given path and method from an api spec. */
export type QueryParams<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: { query?: any };
    }
    ? ConvertToStringified<
        StrictQueryParams<
          Required<ApiSpec[Path][Method]["parameters"]>["query"]
        >
      >
    : never
  : never;

/** Ensures that query params are not usable in case no query params are specified (never). */
type StrictQueryParams<Params> = [Params] extends [never]
  ? NonNullable<unknown>
  : Params;

/**
 * Extract a request map for a given path and method from an api spec.
 * A request map has the shape of (media-type -> body).
 */
export type RequestMap<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestBody?: any;
    }
    ? undefined extends ApiSpec[Path][Method]["requestBody"]
      ? Partial<NonNullable<ApiSpec[Path][Method]["requestBody"]>["content"]>
      : ApiSpec[Path][Method]["requestBody"]["content"]
    : never
  : never;

/** Extract the request body of a given path and method from an api spec. */
export type RequestBody<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = MapToValues<RequestMap<ApiSpec, Path, Method>>;

/**
 * Extract a response map for a given path and method from an api spec.
 * A response map has the shape of (status -> media-type -> body).
 */
export type ResponseMap<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responses: any;
    }
    ? {
        [Status in keyof ApiSpec[Path][Method]["responses"]]: ConvertContent<
          ApiSpec[Path][Method]["responses"][Status]
        >["content"];
      }
    : never
  : never;

/** Extract the response body of a given path and method from an api spec. */
export type ResponseBody<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = MapToValues<
  ResolvedObjectUnion<MapToValues<ResponseMap<ApiSpec, Path, Method>>>
>;

/**
 * OpenAPI-TS generates "no content" with `content?: never`.
 * However, `new Response().body` is `null` and strictly typing no-content in
 * MSW requires `null`. Therefore, this helper ensures that "no-content"
 * can be mapped to null when typing the response body.
 */
type ConvertContent<Content> =
  Required<Content> extends { content: never }
    ? { content: { "no-content": null } }
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Content extends { content: any }
      ? Content
      : never;
