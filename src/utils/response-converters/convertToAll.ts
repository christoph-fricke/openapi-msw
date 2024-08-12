import type { AxiosResponse } from "axios";
import axios from "axios";
import type { GetApiResponse } from "../../types/response.js";
import type {
  MethodType,
  RoutesType,
  SchemaType,
  StatusCodeData,
} from "../../types/types.js";

export async function convertToAll<
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
): Promise<GetApiResponse<"all", DataByCode>> {
  return (
    response
      .then<GetApiResponse<"all", DataByCode>>((response) => ({
        response,
        error: null,
        status: response.status,
        data: response.data,
      }))
      // @ts-expect-error You can't do it any other way, that's the end of my rope
      .catch<GetApiResponse<"all", DataByCode>>((error) => {
        if (!axios.isAxiosError(error)) {
          return {
            error,
            // @TODO: undefened & type nevers
            data: null,
            response: null,
            status: null,
          };
        }

        return {
          error,
          status: Number(error.response?.status) || undefined,
          data: error.response?.data || undefined,
          response: error.response,
        };
      })
  );
}
