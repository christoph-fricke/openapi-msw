import {
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseInit,
  type StrictResponse,
} from "msw";
import type { FilterKeys, JSONLike } from "openapi-typescript-helpers";
import type { Wildcard } from "./http-status-wildcard.js";

type SafeResponseInit<Status> = Status extends keyof Wildcard
  ? ResponseInitForWildcard<Status>
  : ResponseInitNoStatus | void;

type ResponseInitNoStatus = Omit<HttpResponseInit, "status">;
type ResponseInitForWildcard<Key extends keyof Wildcard> =
  ResponseInitNoStatus & {
    status: Wildcard[Key];
  };

type TextResponse<
  ResponseMap,
  Status extends keyof ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
> = (
  body: FilterKeys<ResponseMap[Status], `text/${string}`>,
  init: SafeResponseInit<Status>,
) => StrictResponse<ExpectedResponseBody>;

type JSONResponse<
  ResponseMap,
  Status extends keyof ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
> = (
  body: JSONLike<ResponseMap[Status]>,
  init: SafeResponseInit<Status>,
) => StrictResponse<ExpectedResponseBody>;

type EmptyResponse<ResponseMap, Status extends keyof ResponseMap> = (
  init: SafeResponseInit<Status>,
) => StrictResponse<null>;

export interface OpenApiResponse<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
> {
  <Status extends keyof ResponseMap>(
    status: Status,
  ): {
    text: FilterKeys<ResponseMap[Status], `text/${string}`> extends never
      ? unknown
      : TextResponse<ResponseMap, Status, ExpectedResponseBody>;
    json: JSONLike<ResponseMap[Status]> extends never
      ? unknown
      : JSONResponse<ResponseMap, Status, ExpectedResponseBody>;
    empty: FilterKeys<ResponseMap[Status], "no-content"> extends never
      ? unknown
      : EmptyResponse<ResponseMap, Status>;
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
      ResponseMap,
      typeof status,
      ExpectedResponseBody
    > = (body, init) => {
      return HttpResponse.text(body as string, {
        status: status as number,
        ...init,
      }) as StrictResponse<ExpectedResponseBody>;
    };

    const json: JSONResponse<
      ResponseMap,
      typeof status,
      ExpectedResponseBody
    > = (body, init) => {
      return HttpResponse.json(body as ExpectedResponseBody, {
        status: status as number,
        ...init,
      });
    };

    const empty: EmptyResponse<ResponseMap, typeof status> = (init) => {
      return new HttpResponse(null, {
        status: status as number,
        ...init,
      }) as StrictResponse<null>;
    };

    return { text, json, empty };
  };

  response.untyped = (response) =>
    response as StrictResponse<ExpectedResponseBody>;

  return response;
}
