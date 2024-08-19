import type { AxiosResponse } from "axios";
import type { MethodType } from "../../const/methods.js";
import type { GetApiResponse } from "../../types/response.js";
import type {
  RouteResponsesByStatusCode,
  RoutesForMethod,
  SchemaType,
} from "../../types/schemeTypes.js";

export async function convertToAxios<
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
