import {
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseInit,
  type StrictResponse,
} from "msw";
import type { FilterKeys } from "openapi-typescript-helpers";

export interface OpenApiResponse<
  ResponseMap extends Record<number, unknown>,
  // TODO: Should a resolver continue to only allow successful responses or a union of typed responses?
  // The later, might make this generic for type casting obsolete.
  ExpectedResponse extends DefaultBodyType,
> {
  // TODO: Handle status codes that contain "XX", e.g. 2XX, 4XX... 2XX --> 200, 201, 204...
  <Status extends keyof ResponseMap>(
    status: Status,
  ): {
    // TODO: Do we need to support more HttpResponse helpers? Those are the only onces that return a `StrictResponse`.
    // Currently, our strict typed resolver do not allow returning a `Response` anyway...
    text(
      body: FilterKeys<ResponseMap[Status], `plain/${string}`>,
      init?: Omit<HttpResponseInit, "status">,
    ): StrictResponse<ExpectedResponse>;
    json(
      body: FilterKeys<ResponseMap[Status], `${string}/json`>,
      init?: Omit<HttpResponseInit, "status">,
    ): StrictResponse<ExpectedResponse>;
  };
  // TODO: Allow "untyped" helper to return any response as a fallback for unknown codes, e.g. 401, 5XX
  untyped: typeof HttpResponse;
}

export function createResponseHelper<
  ResponseMap extends Record<number, unknown>,
  ExpectedResponse extends DefaultBodyType,
>(): OpenApiResponse<ResponseMap, ExpectedResponse> {
  const response: OpenApiResponse<ResponseMap, ExpectedResponse> = (status) => {
    return {
      text: (body, init) =>
        HttpResponse.text(body as string, {
          ...init,
          status: status as number,
        }) as StrictResponse<ExpectedResponse>,
      json: (body, init) =>
        HttpResponse.json(body as ExpectedResponse, {
          ...init,
          status: status as number,
        }),
    };
  };
  response.untyped = HttpResponse;

  return response;
}
