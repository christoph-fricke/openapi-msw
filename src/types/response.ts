import type { AxiosError, AxiosResponse } from "axios";
import type { OkStatus, ValidStatusType } from "./types.js";

export type GetApiResponse<
  ValidStatus extends ValidStatusType,
  DataByCode extends Record<number, unknown>,
> =
  | (ValidStatus extends "all" ? ApiResponseAll<never, unknown> : never)
  | {
      [K in keyof DataByCode]: ValidStatus extends "all"
        ? ApiResponseAll<DataByCode[K], K>
        : ValidStatus extends "fetch"
          ? ApiResponseFetch<DataByCode[K], K>
          : ValidStatus extends "axios"
            ? K extends OkStatus
              ? ApiResponseAxios<DataByCode[K], K>
              : never
            : never;
    }[keyof DataByCode];

export type ApiResponseAxios<T, S> = {
  /**
   * HTTP status code. Can only be 1xx, 2xx, or 3xx.
   */
  status: S;

  /**
   * Data returned by the request.
   */
  data: T;

  /**
   * Axios response object. Contains all the information about the request.
   */
  response: AxiosResponse<T>;
};

export interface ApiResponseFetch<T, S> {
  /**
   * HTTP status code.
   */
  status: S;

  /**
   * Data returned by the request.
   */
  data: T;

  /**
   * Field to store the error.
   * This can be an error from a request with an HTTP status of 4xx or 5xx.
   * Does not include errors when the server does not respond
   * (e.g., due to a network error) or errors handled by
   * a custom interceptor.
   */
  error: AxiosError | undefined;

  /**
   * Axios response object. Contains all the information about the request.
   */
  response: AxiosResponse<T>;
}

export interface ApiResponseAll<T, S> {
  /**
   * HTTP status code. Can be undefined, check error description.
   */
  status: S;

  /**
   * Data returned by the request.
   */
  data: T;

  /**
   * Field to store the error.
   * This can include any errors such as:
   * - Errors from requests with an HTTP status of 4xx or 5xx.
   * - Errors when the server does not respond (e.g., due to a network error).
   * - Errors handled by a custom interceptor.
   */
  error: unknown;

  /**
   * Axios response object. Contains all the information about the request.
   */
  response: AxiosResponse<T>;
}
