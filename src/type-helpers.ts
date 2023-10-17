import type {
  FilterKeys,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
  ResponseObjectMap,
  SuccessResponse,
} from "openapi-typescript-helpers";
import type { HttpHandlerFactory } from "./missing-msw-types.js";

/** Base type that any api spec should extend. */
export type AnyApiSpec = NonNullable<unknown>;

/** Intersection of HTTP methods that are supported by both OpenApi-TS and MSW. */
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

/** MSW handler resolver function that is made type-safe through an api spec. */
export type SafeRequestResolver<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = Parameters<
  HttpHandlerFactory<
    PathParams<ApiSpec, Path, Method>,
    RequestBody<ApiSpec, Path, Method>,
    ResponseBody<ApiSpec, Path, Method>
  >
>[1];
