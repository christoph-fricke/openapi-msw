import { HttpHandler, http as mswHttp } from "msw";
import type { RequestHandlerOptions } from "./missing-msw-types.js";
import { convertToColonPath } from "./path-mapping.js";
import type {
  AnyApiSpec,
  HttpMethod,
  PathsForMethod,
  SafeRequestResolver,
} from "./type-helpers.js";

export type SafeHttpHandlers<ApiSpec extends AnyApiSpec> = {
  [Method in HttpMethod]: <Path extends PathsForMethod<ApiSpec, Method>>(
    path: Path,
    resolver: SafeRequestResolver<ApiSpec, Path, Method>,
    options?: RequestHandlerOptions,
  ) => HttpHandler;
} & { unsafe: typeof mswHttp };

export interface HttpOptions {
  baseUrl?: string;
}

export function createSafeHttp<ApiSpec extends AnyApiSpec>(
  options?: HttpOptions,
): SafeHttpHandlers<ApiSpec> {
  return {
    get: createHttpWrapper<ApiSpec, "get">("get", options),
    put: createHttpWrapper<ApiSpec, "put">("put", options),
    post: createHttpWrapper<ApiSpec, "post">("post", options),
    delete: createHttpWrapper<ApiSpec, "delete">("delete", options),
    options: createHttpWrapper<ApiSpec, "options">("options", options),
    head: createHttpWrapper<ApiSpec, "head">("head", options),
    patch: createHttpWrapper<ApiSpec, "patch">("patch", options),
    unsafe: mswHttp,
  };
}

function createHttpWrapper<
  ApiSpec extends AnyApiSpec,
  Method extends HttpMethod,
>(method: Method, httpOptions?: HttpOptions) {
  return <Path extends PathsForMethod<ApiSpec, Method>>(
    path: Path,
    resolver: SafeRequestResolver<ApiSpec, Path, Method>,
    options?: RequestHandlerOptions,
  ): HttpHandler => {
    const mswPath = convertToColonPath(path as string, httpOptions?.baseUrl);
    return mswHttp[method](mswPath, resolver, options);
  };
}
