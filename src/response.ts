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

export interface OpenApiResponse<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
> {
  <Status extends keyof ResponseMap>(
    status: Status,
  ): {
    text: FilterKeys<ResponseMap[Status], `text/${string}`> extends never
      ? unknown
      : (
          body: FilterKeys<ResponseMap[Status], `text/${string}`>,
          init: SafeResponseInit<Status>,
        ) => StrictResponse<ExpectedResponseBody>;
    json: JSONLike<ResponseMap[Status]> extends never
      ? unknown
      : (
          body: JSONLike<ResponseMap[Status]>,
          init: SafeResponseInit<Status>,
        ) => StrictResponse<ExpectedResponseBody>;
    empty: FilterKeys<ResponseMap[Status], "no-content"> extends never
      ? unknown
      : (init: SafeResponseInit<Status>) => StrictResponse<null>;
  };
  untyped(response: Response): StrictResponse<ExpectedResponseBody>;
}

export function createResponseHelper<
  ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
>(): OpenApiResponse<ResponseMap, ExpectedResponseBody> {
  const response = <Status extends keyof ResponseMap>(status: Status) => {
    return {
      text: (
        body: FilterKeys<ResponseMap[Status], `text/${string}`>,
        init: Status extends keyof Wildcard
          ? ResponseInitForWildcard<Status>
          : ResponseInitNoStatus | void,
      ): StrictResponse<ExpectedResponseBody> => {
        return HttpResponse.text(body as string, {
          status: status as number,
          ...init,
        }) as StrictResponse<ExpectedResponseBody>;
      },
      json: (
        body: JSONLike<ResponseMap[Status]>,
        init: SafeResponseInit<Status>,
      ): StrictResponse<ExpectedResponseBody> => {
        return HttpResponse.json(body as ExpectedResponseBody, {
          status: status as number,
          ...init,
        });
      },
      empty: (init: SafeResponseInit<Status>): StrictResponse<null> => {
        return new HttpResponse(null, {
          status: status as number,
          ...init,
        }) as StrictResponse<null>;
      },
    };
  };
  response.untyped = (response: Response) =>
    response as StrictResponse<ExpectedResponseBody>;

  return response;
}
