import {
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseInit,
  type StrictResponse,
} from "msw";
import type { FilterKeys, JSONLike } from "openapi-typescript-helpers";
import type { Wildcard } from "./http-status-wildcard.js";

/**
 * Requires or removes the status code from {@linkcode HttpResponseInit} depending
 * on the chosen OpenAPI status code. When the status is a wildcard, a specific
 * status code must be provided.
 */
type DynamicResponseInit<Status> = Status extends keyof Wildcard
  ? ResponseInitForWildcard<Status>
  : ResponseInitNoStatus | void;

interface ResponseInitNoStatus extends Omit<HttpResponseInit, "status"> {}
interface ResponseInitForWildcard<Key extends keyof Wildcard>
  extends ResponseInitNoStatus {
  status: Wildcard[Key];
}

/** Creates a type-safe text response, which may require an additional status code. */
type TextResponse<ResponseBody, Status> = (
  body: ResponseBody extends string ? ResponseBody : never,
  init: DynamicResponseInit<Status>,
) => StrictResponse<typeof body>;

/** Creates a type-safe json response, which may require an additional status code. */
type JsonResponse<ResponseBody, Status> = (
  body: ResponseBody extends DefaultBodyType ? ResponseBody : never,
  init: DynamicResponseInit<Status>,
) => StrictResponse<typeof body>;

/** Creates a type-safe empty response, which may require an additional status code. */
type EmptyResponse<Status> = (
  init: DynamicResponseInit<Status>,
) => StrictResponse<null>;

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
    text: FilterKeys<ResponseMap[Status], `text/${string}`> extends never
      ? unknown
      : TextResponse<FilterKeys<ResponseMap[Status], `text/${string}`>, Status>;

    json: JSONLike<ResponseMap[Status]> extends never
      ? unknown
      : JsonResponse<JSONLike<ResponseMap[Status]>, Status>;

    empty: FilterKeys<ResponseMap[Status], "no-content"> extends never
      ? unknown
      : EmptyResponse<Status>;
  };
  untyped(response: Response): StrictResponse<ExpectedResponseBody>;
}

export function createResponseHelper<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
>(): OpenApiResponse<ResponseMap, ExpectedResponseBody> {
  const response: OpenApiResponse<ResponseMap, ExpectedResponseBody> = (
    status,
  ) => {
    const text: TextResponse<
      FilterKeys<ResponseMap[typeof status], `text/${string}`>,
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
      return new HttpResponse(null, {
        status: status as number,
        ...init,
      }) as StrictResponse<null>;
    };

    return { text, json, empty };
  };

  response.untyped = (response) => {
    return response as StrictResponse<ExpectedResponseBody>;
  };

  return response;
}
