import type { AxiosError, AxiosResponse } from "axios";
import type { ErrorStatus, OkStatus } from "openapi-typescript-helpers";
import type { ValidStatusType } from "./options.js";

/**
 * @description Type for retrieving an API response based on the ValidStatus type and data by status code.
 *
 * @description The ValidStatus type configures the error handling strategy and sets up the returned value:
 * - "axios" (default): Throws an error in the following cases:
 *   - `response.status >= 400`
 *   - Request failure (e.g., network error)
 *   - Axios interceptors failure
 * - "fetch": Throws an error in the following cases:
 *   - Request failure (e.g., network error)
 *   - Axios interceptors failure
 * - "all": Never throws an error, so no try/catch is required.
 *
 * @template ValidStatus - The type that determines whether all, fetch, or axios valid statuses are used.
 * @template DataByCode - A record type mapping status codes to their corresponding data types.
 */
export type GetApiResponse<
  ValidStatus extends ValidStatusType,
  DataByCode extends Record<number, unknown>,
> =
  | (ValidStatus extends "all"
      ? ApiResponseAll<never, undefined, undefined>
      : never)
  | {
      [K in keyof DataByCode]: ValidStatus extends "all"
        ? ApiResponseAll<
            DataByCode[K],
            K,
            K extends OkStatus | ErrorStatus
              ? AxiosResponse<DataByCode[K]>
              : never,
            AxiosError
          >
        : ValidStatus extends "fetch"
          ? ApiResponseFetch<DataByCode[K], K>
          : ValidStatus extends "axios"
            ? K extends OkStatus
              ? ApiResponseAxios<DataByCode[K], K>
              : never
            : never;
    }[keyof DataByCode];

/**
 * @description Type representing an Axios-specific API response for successful requests.
 *
 * @template ResponseData - The type of the data returned by the request.
 * @template StatusCode - The HTTP status code.
 */
export type ApiResponseAxios<ResponseData, StatusCode> = {
  /**
   * @description HTTP status code. Can only be 1xx, 2xx, or 3xx.
   */
  status: StatusCode;

  /**
   * @description Data returned by the request.
   */
  data: ResponseData;

  /**
   * @description Axios response object. Contains all the information about the request.
   */
  response: AxiosResponse<ResponseData>;
};

/**
 * @description Interface representing an API response for fetch requests.
 *
 * @template ResponseData - The type of the data returned by the request.
 * @template StatusCode - The HTTP status code.
 */
export interface ApiResponseFetch<ResponseData, StatusCode> {
  /**
   * @description HTTP status code.
   */
  status: StatusCode;

  /**
   * @description Data returned by the request.
   */
  data: ResponseData;

  /**
   * @description Field to store the error.
   * This can be an error from a request with an HTTP status of 4xx or 5xx.
   * Does not include errors when the server does not respond
   * (e.g., due to a network error) or errors handled by
   * a custom interceptor.
   */
  error: AxiosError | undefined;

  /**
   * @description Axios response object. Contains all the information about the request.
   */
  response: AxiosResponse<ResponseData>;
}

/**
 * @description Interface representing an API response for any valid status type, including both success and error responses.
 *
 * @template ResponseData - The type of the data returned by the request.
 * @template StatusCode - The HTTP status code.
 * @template AxiosResponseType - The type of the Axios response object.
 * @template ErrorResponseType - The type of the error object.
 */
export interface ApiResponseAll<
  ResponseData,
  StatusCode,
  AxiosResponseType = AxiosResponse<ResponseData>,
  ErrorResponseType = unknown,
> {
  /**
   * @description HTTP status code. Can be undefined, check error description.
   */
  status: StatusCode;

  /**
   * @description Data returned by the request.
   */
  data: ResponseData;

  /**
   * @description Field to store the error.
   * This can include any errors such as:
   * - Errors from requests with an HTTP status of 4xx or 5xx.
   * - Errors when the server does not respond (e.g., due to a network error).
   * - Errors handled by a custom interceptor.
   */
  error: ErrorResponseType;

  /**
   * @description Axios response object. Contains all the information about the request.
   */
  response: AxiosResponseType;
}
