import type {
  AsyncResponseResolverReturnType,
  RequestHandlerOptions,
  http,
} from "msw";
import type {
  FilterKeys,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
  ResponseObjectMap,
  SuccessResponse,
} from "openapi-typescript-helpers";

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
> = PathsWithMethod<ApiSpec, Method>;

/** Extract the params of a given path and method from an api spec. */
export type PathParams<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: { path: any };
    }
    ? ConvertToStringLike<ApiSpec[Path][Method]["parameters"]["path"]>
    : never
  : never;

type ConvertToStringLike<Params> = {
  [Name in keyof Params]: Params[Name] extends string ? Params[Name] : string;
};

/** Extract the request body of a given path and method from an api spec. */
export type RequestBody<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? OperationRequestBodyContent<ApiSpec[Path][Method]>
  : never;

/** Extract the response body of a given path and method from an api spec. */
export type ResponseBody<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Method extends keyof ApiSpec[Path]
  ? ApiSpec[Path][Method] extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responses: any;
    }
    ? ConvertNoContent<
        FilterKeys<
          SuccessResponse<ResponseObjectMap<ApiSpec[Path][Method]>>,
          MediaType
        >
      >
    : never
  : never;

/**
 * OpenAPI-TS generates "no content" with `content?: never`.
 * However, `new Response().body` is `null` and strictly typing no-content in MSW requires `null`.
 * Therefore, this helper maps no-content to `null`.
 */
export type ConvertNoContent<Content> = [Content] extends [never]
  ? null
  : Content;

/** HTTP handler factory with type inference for provided api paths. */
export type HttpHandlerFactory<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
> = <Path extends PathsForMethod<ApiSpec, Method>>(
  path: Path,
  resolver: ResponseResolver<ApiSpec, Path, Method>,
  options?: RequestHandlerOptions,
) => ReturnType<typeof http.all>;

/** Response resolver that gets provided to HTTP handler factories. */
export type ResponseResolver<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = (
  info: ResponseResolverInfo<ApiSpec, Path, Method>,
) => AsyncResponseResolverReturnType<ResponseBody<ApiSpec, Path, Method>>;

/** Response resolver info that extends MSW's resolver info with additional functionality. */
interface ResponseResolverInfo<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> extends MSWResponseResolverInfo<ApiSpec, Path, Method> {}

/** MSW response resolver info that is made type-safe through an api spec. */
type MSWResponseResolverInfo<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Parameters<MSWResponseResolver<ApiSpec, Path, Method>>[0];

/** MSW response resolver function that is made type-safe through an api spec. */
export type MSWResponseResolver<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Parameters<
  typeof http.all<
    PathParams<ApiSpec, Path, Method>,
    RequestBody<ApiSpec, Path, Method>,
    ResponseBody<ApiSpec, Path, Method>
  >
>[1];
