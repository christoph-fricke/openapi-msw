/* eslint-disable */
// Delete once https://github.com/mswjs/msw/pull/1774 is merged and published.

import {
  HttpHandler,
  type DefaultBodyType,
  type Path,
  type PathParams,
  type ResponseResolver,
} from "msw";

export type HttpHandlerFactory<
  Params extends PathParams<keyof Params> = PathParams,
  RequestBodyType extends DefaultBodyType = DefaultBodyType,
  ResponseBodyType extends DefaultBodyType = undefined,
> = (
  path: Path,
  resolver: ResponseResolver<
    HttpRequestResolverExtras<Params>,
    RequestBodyType,
    ResponseBodyType
  >,
  options?: RequestHandlerOptions,
) => HttpHandler;

export type HttpRequestResolverExtras<Params extends PathParams> = {
  params: Params;
  cookies: Record<string, string | Array<string>>;
};

export interface RequestHandlerOptions {
  once?: boolean;
}
