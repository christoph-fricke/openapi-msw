import { http, type RequestHandlerOptions } from "msw";
import type { AnyApiSpec, HttpMethod, PathsForMethod } from "./api-spec.js";
import { convertToColonPath } from "./path-mapping.js";
import {
  createResolverWrapper,
  type ResponseResolver,
} from "./response-resolver.js";

/** HTTP handler factory with type inference for provided api paths. */
export type HttpHandlerFactory<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
> = <Path extends PathsForMethod<ApiSpec, Method>>(
  path: Path,
  resolver: ResponseResolver<ApiSpec, Path, Method>,
  options?: RequestHandlerOptions,
) => ReturnType<typeof http.all>;

function createHttpWrapper<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
>(
  method: Method,
  httpOptions?: HttpOptions,
): HttpHandlerFactory<ApiSpec, Method> {
  return (path, resolver, options) => {
    const mswPath = convertToColonPath(path as string, httpOptions?.baseUrl);
    const mswResolver = createResolverWrapper(resolver);

    return http[method](mswPath, mswResolver, options);
  };
}

/** Collection of enhanced HTTP handler factories for each available HTTP Method. */
export type OpenApiHttpHandlers<ApiSpec extends AnyApiSpec> = {
  [Method in HttpMethod]: HttpHandlerFactory<ApiSpec, Method>;
} & { untyped: typeof http };

export interface HttpOptions {
  /** Optional baseUrl that is prepended to the `path` of each HTTP handler. */
  baseUrl?: string;
}

/**
 * Creates a wrapper around MSW's {@link http} object, which is enhanced with
 * type inference from the provided OpenAPI-TS `paths` definition.
 *
 * @param options Additional options that are used by all defined HTTP handlers.
 *
 * @example
 * import { HttpResponse } from "msw";
 * import { createOpenApiHttp } from "openapi-msw";
 * // 1. Import the paths from your OpenAPI schema definitions
 * import type { paths } from "./your-openapi-schema";
 *
 * // 2. Provide your paths definition to enable type inference in HTTP handlers
 * const http = createOpenApiHttp<paths>();
 *
 * // TS only suggests available GET paths
 * const getHandler = http.get("/resource/{id}", ({ params }) => {
 *   const id = params.id;
 *   return HttpResponse.json({ id, other: "..." });
 * });
 */
export function createOpenApiHttp<ApiSpec extends AnyApiSpec>(
  options?: HttpOptions,
): OpenApiHttpHandlers<ApiSpec> {
  return {
    get: createHttpWrapper("get", options),
    put: createHttpWrapper("put", options),
    post: createHttpWrapper("post", options),
    delete: createHttpWrapper("delete", options),
    options: createHttpWrapper("options", options),
    head: createHttpWrapper("head", options),
    patch: createHttpWrapper("patch", options),
    untyped: http,
  };
}
