import type { AxiosResponse } from "axios";
import axios from "axios";
import type { MethodType } from "../../const/methods.js";
import type { GetApiResponse } from "../../types/response.js";
import type {
  RouteResponsesByStatusCode,
  RoutesForMethod,
  SchemaType,
} from "../../types/schemeTypes.js";

export async function convertToAll<
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
): Promise<GetApiResponse<"all", DataByCode>> {
  return (
    response
      // @ts-expect-error @TODO See issue #3 - https://github.com/web-bee-ru/openapi-axios/issues/3
      .then<GetApiResponse<"all", DataByCode>>((response) => ({
        response,
        error: null,
        status: response.status,
        data: response.data,
      }))
      .catch<GetApiResponse<"all", DataByCode>>((error) => {
        if (!axios.isAxiosError(error)) {
          return {
            error,
            data: undefined as never,
            response: undefined,
            status: undefined,
          };
        }

        return {
          error,
          status: Number(error.response?.status) || undefined,
          data: error.response?.data || undefined,
          response: error.response,
        } as GetApiResponse<"all", DataByCode>;
      })
  );
}
