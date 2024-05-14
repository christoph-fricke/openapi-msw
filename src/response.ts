import {
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseInit,
  type StrictResponse,
} from "msw";
import type { FilterKeys, JSONLike } from "openapi-typescript-helpers";

type ScopedHttpResponseInit = Omit<HttpResponseInit, "status">;

// TODO: Handle status codes that contain "XX", e.g. 2XX, 4XX... 2XX --> 200, 201, 204...
export interface OpenApiResponse<
  ExpectedResponseBody extends DefaultBodyType,
  ResponseMap,
> {
  <Status extends keyof ResponseMap>(
    status: Status,
  ): {
    text(
      body: FilterKeys<ResponseMap[Status], `text/${string}`>,
      init?: ScopedHttpResponseInit,
    ): StrictResponse<ExpectedResponseBody>;
    json(
      body: JSONLike<ResponseMap[Status]>,
      init?: ScopedHttpResponseInit,
    ): StrictResponse<ExpectedResponseBody>;
    empty(init?: ScopedHttpResponseInit): StrictResponse<null>;
  };
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
      empty: (init) => new HttpResponse(null, init) as StrictResponse<null>,
    };
  };
  response.untyped = (response) =>
    response as StrictResponse<ExpectedResponseBody>;

  return response;
}
