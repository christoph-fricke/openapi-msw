import type { AsyncResponseResolverReturnType, http } from "msw";
import type {
  AnyApiSpec,
  HttpMethod,
  PathParams,
  RequestBody,
  ResponseBody,
} from "./api-spec.js";

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
> extends MSWResponseResolverInfo<ApiSpec, Path, Method> {}

/** Wraps MSW's resolver function to provide additional info to a given resolver. */
export function createResolverWrapper<
  ApiSpec extends AnyApiSpec,
  Path extends keyof ApiSpec,
  Method extends HttpMethod,
>(
  resolver: ResponseResolver<ApiSpec, Path, Method>,
): MSWResponseResolver<ApiSpec, Path, Method> {
  return (info) => {
    return resolver(info);
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
