import type {
  AsyncResponseResolverReturnType,
  HttpResponseResolver,
} from "msw";
import type {
  AnyApiSpec,
  HttpMethod,
  PathParams,
  QueryParams,
  RequestBody,
  RequestMap,
  ResponseBody,
  ResponseMap,
} from "./api-spec.ts";
import { QueryParams as QueryParamsUtil } from "./query-params.ts";
import type { OpenApiRequest } from "./request.ts";
import { createResponseHelper, type OpenApiResponse } from "./response.ts";

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
  /** Standard request with enhanced typing for body methods based on the given OpenAPI spec. */
  request: OpenApiRequest<RequestMap<ApiSpec, Path, Method>>;

  /**
   * Type-safe wrapper around {@link URLSearchParams} that implements methods for
   * reading query parameters.
   *
   * **Example**
   * ```typescript
   * const handler = http.get("/query-example", ({ query }) => {
   *   const filter = query.get("filter");
   *   const sortBy = query.getAll("sortBy");
   *
   *   if (query.has("sort", "asc")) { ... }
   *
   *   return HttpResponse.json({ ... });
   * });
   * ```
   */
  query: QueryParamsUtil<QueryParams<ApiSpec, Path, Method>>;

  /**
   * A type-safe response helper that narrows allowed status codes and content types
   * based on the given OpenAPI spec. The response body is further narrowed to
   * the match the selected status code and content type.
   *
   * If a wildcard status code is chosen, a specific status code for the response
   * must be provided in the {@linkcode ResponseInit} argument. All status codes
   * allowed by the wildcard are inferred.
   *
   * A fallback for returning any response without casting is provided
   * through `response.untyped(...)`.
   *
   * **Example**
   * ```typescript
   * const handler = http.get("/response-example", ({ response }) => {
   *   return response(200).json({ id: 123 });
   * });
   *
   * const empty = http.get("/response-example", ({ response }) => {
   *   return response(204).empty();
   * });
   *
   * const wildcard = http.get("/response-example", ({ response }) => {
   *   return response("5XX").text("Unexpected Error", { status: 501 });
   * });
   *
   * const fallback = http.get("/response-example", ({ response }) => {
   *   return response.untyped(new Response("Hello"));
   * });
   * ```
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
      request: info.request as OpenApiRequest<
        RequestMap<ApiSpec, Path, Method>
      >,
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
> = HttpResponseResolver<
  PathParams<ApiSpec, Path, Method>,
  RequestBody<ApiSpec, Path, Method>,
  ResponseBody<ApiSpec, Path, Method>
>;
