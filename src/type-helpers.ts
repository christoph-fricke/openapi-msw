import type {
  FilterKeys,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
  ResponseObjectMap,
  SuccessResponse,
} from "openapi-typescript-helpers";
import type { http } from "msw";

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
    ? Required<ApiSpec[Path][Method]["parameters"]["path"]>
    : never
  : never;

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
    ? FilterKeys<
        SuccessResponse<ResponseObjectMap<ApiSpec[Path][Method]>>,
        MediaType
      >
    : never
  : never;

/** MSW http handler factory with type inference for provided api paths. */
export type HttpHandlerFactory<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
> = <Path extends PathsForMethod<ApiSpec, Method>>(
  path: Path,
  resolver: ResponseResolver<ApiSpec, Path, Method>,
  options?: RequestHandlerOptions,
) => ReturnType<typeof http.all>;

/** MSW handler options. */
export type RequestHandlerOptions = Required<Parameters<typeof http.all>[2]>;

/** MSW response resolver function that is made type-safe through an api spec. */
export interface ResponseResolver<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> extends ResponseResolverType<ApiSpec, Path, Method> {}

type ResponseResolverType<
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
