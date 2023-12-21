import { http } from "msw";
import { convertToColonPath } from "./path-mapping.js";
import type {
  AnyApiSpec,
  HttpHandlerFactory,
  HttpMethod,
  MSWResponseResolver,
  ResponseResolver,
} from "./type-helpers.js";
import { QueryParams } from "./query-params.js";

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
    get: createHttpWrapper<ApiSpec, "get">("get", options),
    put: createHttpWrapper<ApiSpec, "put">("put", options),
    post: createHttpWrapper<ApiSpec, "post">("post", options),
    delete: createHttpWrapper<ApiSpec, "delete">("delete", options),
    options: createHttpWrapper<ApiSpec, "options">("options", options),
    head: createHttpWrapper<ApiSpec, "head">("head", options),
    patch: createHttpWrapper<ApiSpec, "patch">("patch", options),
    untyped: http,
  };
}

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

function createResolverWrapper<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
>(
  resolver: ResponseResolver<ApiSpec, Path, Method>,
): MSWResponseResolver<ApiSpec, Path, Method> {
  return (info) => {
    return resolver({
      ...info,
      query: new QueryParams(info.request),
    });
  };
}
