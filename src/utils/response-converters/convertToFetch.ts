import type { AxiosResponse } from "axios";
import axios from "axios";
import type { MethodType } from "../../const/methods.js";
import type { GetApiResponse } from "../../types/response.js";
import type {
  RouteResponsesByStatusCode,
  RoutesForMethod,
  SchemaType,
} from "../../types/schemeTypes.js";

export async function convertToFetch<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
  DataByCode extends Record<number, unknown> = RouteResponsesByStatusCode<
    Schema,
    Method,
    Route
  >,
>(
  response: Promise<AxiosResponse>,
): Promise<GetApiResponse<"fetch", DataByCode>> {
  return response
    .then<GetApiResponse<"fetch", DataByCode>>((response) => ({
      response,
      error: undefined,
      status: response.status,
      data: response.data,
    }))
    .catch<GetApiResponse<"fetch", DataByCode>>((error) => {
      if (!axios.isAxiosError(error) || !error.response?.status) {
        throw error;
      }

      return {
        error,
        status: +error.response.status,
        data: error.response.data,
        response: error.response,
      };
    });
}
