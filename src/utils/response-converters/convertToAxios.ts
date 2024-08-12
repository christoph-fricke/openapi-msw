import type { AxiosResponse } from "axios";
import type { GetApiResponse } from "../../types/response.js";
import type {
  MethodType,
  RoutesType,
  SchemaType,
  StatusCodeData,
} from "../../types/types.js";

export async function convertToAxios<
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
): Promise<GetApiResponse<"axios", DataByCode>> {
  return response.then<GetApiResponse<"axios", DataByCode>>(
    // @ts-expect-error You can't do it any other way, that's the end of my rope
    (response) => ({
      response,
      status: response.status,
      data: response.data,
    }),
  );
}
