import type { AxiosRequestConfig } from "axios";
import type { MethodType } from "../const/methods.js";
import type {
  RoutePath,
  RouteQuery,
  RoutesForMethod,
  SchemaType,
} from "./schemeTypes.js";
import type { QuerySerializationParams } from "./serializer.js";
import type { MakeNeverEmpty } from "./utils.js";

/**
 * @description Type for valid status codes used in OpenAPI requests
 */
export type ValidStatusType = "all" | "axios" | "fetch";

/**
 * @description Interface for options passed to OpenAPI requests using Axios
 */
export interface IOpenApiAxiosOptions<Status extends ValidStatusType> {
  validStatus: Status;
  querySerializationParams?: QuerySerializationParams;
}

/**
 * @description Defines options that include path and query parameters, Axios configuration, and valid status codes
 */
export type OptionsType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
  Status extends ValidStatusType | undefined = undefined,
> = MakeNeverEmpty<{
  params: RoutePath<Schema, Method, Route>;
  query: RouteQuery<Schema, Method, Route>;
}> & {
  axios?: AxiosRequestConfig;
  validStatus?: Status;
  querySerializationParams?: QuerySerializationParams;
};
