import { http as mswHttp, HttpHandler, type DefaultBodyType } from "msw";
import type {
  FilterKeys,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
  ResponseObjectMap,
  SuccessResponse,
} from "openapi-typescript-helpers";
import type {
  RequestHandlerOptions,
  HttpHandlerFactory,
} from "./missing-msw-types.js";
import { convertToColonPath } from "./path-mapping.js";

type AnyPathsDef = NonNullable<unknown>;

/** Intersection of HTTP methods that are supported by both OpenApi-TS and MSW. */
type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch";

type PParams<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: any;
}
  ? Required<T["parameters"]["path"]>
  : never;

type RequestBody<T> = OperationRequestBodyContent<T>;

type Response<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses: any;
}
  ? FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
  : DefaultBodyType;

type Resolver<
  ApiPaths extends AnyPathsDef,
  P extends keyof ApiPaths,
  M extends HttpMethod,
> = Parameters<
  HttpHandlerFactory<
    PParams<M extends keyof ApiPaths[P] ? ApiPaths[P][M] : never>,
    RequestBody<M extends keyof ApiPaths[P] ? ApiPaths[P][M] : unknown>,
    Response<M extends keyof ApiPaths[P] ? ApiPaths[P][M] : never>
  >
>[1];

export interface HttpOptions {
  baseUrl?: string;
}

export type HttpHandlers<ApiPaths extends AnyPathsDef> = {
  [M in HttpMethod]: <P extends PathsWithMethod<ApiPaths, M>>(
    path: P,
    resolver: Resolver<ApiPaths, P, M>,
    options?: RequestHandlerOptions,
  ) => HttpHandler;
} & { unsafe: typeof mswHttp };

export function createSafeHttp<ApiPaths extends AnyPathsDef>(
  options?: HttpOptions,
): HttpHandlers<ApiPaths> {
  return {
    get: createHttpWrapper<ApiPaths, "get">("get", options),
    put: createHttpWrapper<ApiPaths, "put">("put", options),
    post: createHttpWrapper<ApiPaths, "post">("post", options),
    delete: createHttpWrapper<ApiPaths, "delete">("delete", options),
    options: createHttpWrapper<ApiPaths, "options">("options", options),
    head: createHttpWrapper<ApiPaths, "head">("head", options),
    patch: createHttpWrapper<ApiPaths, "patch">("patch", options),
    unsafe: mswHttp,
  } as const;
}

function createHttpWrapper<ApiPaths extends AnyPathsDef, M extends HttpMethod>(
  method: keyof typeof mswHttp,
  httpOptions?: HttpOptions,
) {
  return <P extends PathsWithMethod<ApiPaths, M>>(
    path: P,
    resolver: Resolver<ApiPaths, P, M>,
    options?: RequestHandlerOptions,
  ): HttpHandler => {
    const mswPath = convertToColonPath(path as string, httpOptions?.baseUrl);
    return mswHttp[method](mswPath, resolver, options);
  };
}
