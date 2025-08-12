import type {
  AnyApiSpec,
  HttpMethod,
  PathsForMethod,
  RequestBody,
  ResponseBody,
} from "./api-spec.js";
import type { OpenApiHttpRequestHandler } from "./openapi-http.js";

/**
 * Base type that generic {@link OpenApiHttpRequestHandler | OpenApiHttpRequestHandlers}
 * can extend.
 */
export type AnyOpenApiHttpRequestHandler = OpenApiHttpRequestHandler<
  AnyApiSpec,
  HttpMethod
>;

/**
 * Extracts a union of all paths that can be provided to the given request handler.
 *
 * **Example**
 * ```typescript
 * const http = createOpenApiHttp<paths>();
 *
 * type Paths = PathsFor<typeof http.get>;
 * ```
 */
export type PathsFor<Handler extends AnyOpenApiHttpRequestHandler> =
  Handler extends OpenApiHttpRequestHandler<infer ApiSpec, infer Method>
    ? PathsForMethod<ApiSpec, Method>
    : never;

/**
 * Extracts the request body of a specific path for the given request handler.
 *
 * **Example**
 * ```typescript
 * const http = createOpenApiHttp<paths>();
 *
 * type RequestBody = RequestBodyFor<typeof http.post, "/create">;
 * ```
 */
export type RequestBodyFor<
  Handler extends AnyOpenApiHttpRequestHandler,
  Path extends PathsFor<Handler>,
> =
  Handler extends OpenApiHttpRequestHandler<infer ApiSpec, infer Method>
    ? RequestBody<ApiSpec, Path, Method>
    : never;

/**
 * Extracts the response body of a specific path for the given request handler.
 *
 * **Example**
 * ```typescript
 * const http = createOpenApiHttp<paths>();
 *
 * type ResponseBody = ResponseBodyFor<typeof http.get, "/tasks">;
 * ```
 */
export type ResponseBodyFor<
  Handler extends AnyOpenApiHttpRequestHandler,
  Path extends PathsFor<Handler>,
> =
  Handler extends OpenApiHttpRequestHandler<infer ApiSpec, infer Method>
    ? ResponseBody<ApiSpec, Path, Method>
    : never;
