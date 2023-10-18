import { http as mswHttp } from "msw";
import { convertToColonPath } from "./path-mapping.js";
import type {
  AnyApiSpec,
  HttpHandlerFactory,
  HttpMethod,
} from "./type-helpers.js";

export type OpenApiHttpHandlers<ApiSpec extends AnyApiSpec> = {
  [Method in HttpMethod]: HttpHandlerFactory<ApiSpec, Method>;
} & { untyped: typeof mswHttp };

export interface HttpOptions {
  baseUrl?: string;
}

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
    untyped: mswHttp,
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
    return mswHttp[method](mswPath, resolver, options);
  };
}
