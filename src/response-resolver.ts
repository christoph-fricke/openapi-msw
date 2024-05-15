import type { AsyncResponseResolverReturnType, http } from "msw";
import type {
  AnyApiSpec,
  HttpMethod,
  PathParams,
  QueryParams,
  RequestBody,
  ResponseBody,
  ResponseMap,
} from "./api-spec.js";
import { QueryParams as QueryParamsUtil } from "./query-params.js";
import { createResponseHelper, type OpenApiResponse } from "./response.js";

/** Response resolver that gets provided to HTTP handler factories. */
export type ResponseResolver<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> = (
  info: ResponseResolverInfo<ApiSpec, Path, Method>,
) => AsyncResponseResolverReturnType<ResponseBody<ApiSpec, Path, Method>>;

/** Response resolver info that extends MSW's resolver info with additional functionality. */
export interface ResponseResolverInfo<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
> extends MSWResponseResolverInfo<ApiSpec, Path, Method> {
  /**
   * Type-safe wrapper around {@link URLSearchParams} that implements methods for
   * reading query parameters.
   *
   * @example
   * const handler = http.get("/query-example", ({ query }) => {
   *   const filter = query.get("filter");
   *   const sortBy = query.getAll("sortBy");
   *
   *   if (query.has("sort", "asc")) { ... }
   *
   *   return HttpResponse.json({ ... });
   * });
   */
  query: QueryParamsUtil<QueryParams<ApiSpec, Path, Method>>;
  /**
   * Helper function for creating responses based on status codes allowed in the
   * provided OpenAPI spec.
   *
   * @example
   * const handler = http.get("/response-example", ({ response }) => {
   *   // Helper provided type safety for the status code as well as the json body
   *   return response(200).json({id: 123});
   * });
   */
  response: OpenApiResponse<
    ResponseMap<ApiSpec, Path, Method>,
    ResponseBody<ApiSpec, Path, Method>
  >;
}

/** Wraps MSW's resolver function to provide additional info to a given resolver. */
export function createResolverWrapper<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
>(
  resolver: ResponseResolver<ApiSpec, Path, Method>,
): MSWResponseResolver<ApiSpec, Path, Method> {
  return (info) => {
    return resolver({
      ...info,
      query: new QueryParamsUtil(info.request),
      response: createResponseHelper(),
    });
  };
}

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
