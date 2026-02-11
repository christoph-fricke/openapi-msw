import { HttpResponse, type DefaultBodyType, type HttpResponseInit } from "msw";
import type { Wildcard } from "./http-status-wildcard.ts";
import type { JSONLike, NoContent, TextLike } from "./type-utils.ts";

/**
 * Requires or removes the status code from {@linkcode HttpResponseInit} depending
 * on the chosen OpenAPI status code. When the status is a wildcard, a specific
 * status code must be provided.
 */
type DynamicResponseInit<Status> = Status extends keyof Wildcard
  ? ResponseInitForWildcard<Status>
  : ResponseInitNoStatus | void;

interface ResponseInitNoStatus extends Omit<HttpResponseInit, "status"> {}
interface ResponseInitForWildcard<
  Key extends keyof Wildcard,
> extends ResponseInitNoStatus {
  status: Wildcard[Key];
}

/** Creates a type-safe text response, which may require an additional status code. */
type TextResponse<ResponseBody, Status> = (
  body: ResponseBody extends string ? ResponseBody : never,
  init: DynamicResponseInit<Status>,
) => HttpResponse<typeof body>;

/** Creates a type-safe json response, which may require an additional status code. */
type JsonResponse<ResponseBody, Status> = (
  body: ResponseBody extends DefaultBodyType ? ResponseBody : never,
  init: DynamicResponseInit<Status>,
) => HttpResponse<typeof body>;

/** Creates a type-safe empty response, which may require an additional status code. */
type EmptyResponse<Status> = (
  init: DynamicResponseInit<Status>,
) => HttpResponse<null>;

/**
 * A type-safe response helper that narrows available status codes and content types,
 * based on the given OpenAPI spec. The response body is specifically narrowed to
 * the specified status code and content type.
 */
export interface OpenApiResponse<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
> {
  <Status extends keyof ResponseMap>(
    status: Status,
  ): {
    text: TextLike<ResponseMap[Status]> extends never
      ? unknown
      : TextResponse<TextLike<ResponseMap[Status]>, Status>;

    json: JSONLike<ResponseMap[Status]> extends never
      ? unknown
      : JsonResponse<JSONLike<ResponseMap[Status]>, Status>;

    empty: NoContent<ResponseMap[Status]> extends never
      ? unknown
      : EmptyResponse<Status>;
  };
  untyped(response: Response): HttpResponse<ExpectedResponseBody>;
}

export function createResponseHelper<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
>(): OpenApiResponse<ResponseMap, ExpectedResponseBody> {
  const response: OpenApiResponse<ResponseMap, ExpectedResponseBody> = (
    status,
  ) => {
    const text: TextResponse<
      TextLike<ResponseMap[typeof status]>,
      typeof status
    > = (body, init) => {
      return HttpResponse.text(body, {
        status: status as number,
        ...init,
      });
    };

    const json: JsonResponse<
      JSONLike<ResponseMap[typeof status]>,
      typeof status
    > = (body, init) => {
      return HttpResponse.json(body, { status: status as number, ...init });
    };

    const empty: EmptyResponse<typeof status> = (init) => {
      const headers = new Headers(init?.headers);
      if (!headers.has("content-length")) headers.set("content-length", "0");

      return new HttpResponse(null, {
        status: status as number,
        ...init,
        headers,
      });
    };

    return { text, json, empty };
  };

  response.untyped = (response) => {
    return response as HttpResponse<ExpectedResponseBody>;
  };

  return response;
}
