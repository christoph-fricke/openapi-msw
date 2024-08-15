import type { AxiosResponse } from "axios";
import axios from "axios";
import type { MethodType } from "../../const/methods.js";
import type { GetApiResponse } from "../../types/response.js";
import type {
  RoutesType,
  SchemaType,
  StatusCodeData,
} from "../../types/schemeTypes.js";

export async function convertToFetch<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  DataByCode extends Record<number, unknown> = StatusCodeData<
    Schema,
    Method,
    Route,
    "responses"
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
