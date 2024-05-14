import {
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseInit,
  type StrictResponse,
} from "msw";
import type { FilterKeys, JSONLike } from "openapi-typescript-helpers";
import type { Wildcard } from "./http-status-wildcard.js";

type ResponseInitNoStatus = Omit<HttpResponseInit, "status">;
type ResponseInitForWildcard<Key extends keyof Wildcard> =
  ResponseInitNoStatus & {
    status: Wildcard[Key];
  };

interface StrictResponseForStatus<
  Status extends keyof ResponseMap,
  ExpectedResponseBody extends DefaultBodyType,
  ResponseMap,
> {
  text(
    body: FilterKeys<ResponseMap[Status], `text/${string}`>,
    init: Status extends keyof Wildcard
      ? ResponseInitForWildcard<Status>
      : // TODO: Void is a but weird. Can this be solved better?
        // Using "undefined" causes type errors when undefined is not explicitly provided...
        ResponseInitNoStatus | void,
  ): StrictResponse<ExpectedResponseBody>;
  json(
    body: JSONLike<ResponseMap[Status]>,
    init: Status extends keyof Wildcard
      ? ResponseInitForWildcard<Status>
      : ResponseInitNoStatus | void,
  ): StrictResponse<ExpectedResponseBody>;
  empty(
    init: Status extends keyof Wildcard
      ? ResponseInitForWildcard<Status>
      : ResponseInitNoStatus | void,
  ): StrictResponse<null>;
}

export interface OpenApiResponse<
  ExpectedResponseBody extends DefaultBodyType,
  ResponseMap,
> {
  <Status extends keyof ResponseMap>(
    status: Status,
  ): StrictResponseForStatus<Status, ExpectedResponseBody, ResponseMap>;
  untyped(response: Response): StrictResponse<ExpectedResponseBody>;
}

export function createResponseHelper<
  ExpectedResponseBody extends DefaultBodyType,
  ResponseMap,
>(): OpenApiResponse<ExpectedResponseBody, ResponseMap> {
  const response: OpenApiResponse<ExpectedResponseBody, ResponseMap> = (
    status,
  ) => {
    return {
      text: (body, init) =>
        HttpResponse.text(body as string, {
          ...init,
          status: status as number,
        }) as StrictResponse<ExpectedResponseBody>,
      json: (body, init) =>
        HttpResponse.json(body as ExpectedResponseBody, {
          ...init,
          status: status as number,
        }),
      empty: (init) =>
        new HttpResponse(
          null,
          init as HttpResponseInit,
        ) as StrictResponse<null>,
    };
  };
  response.untyped = (response) =>
    response as StrictResponse<ExpectedResponseBody>;

  return response;
}
