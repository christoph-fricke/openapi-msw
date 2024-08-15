import type { AxiosRequestConfig } from "axios";
import type { MethodType } from "../const/methods.js";
import type { MakeNeverEmpty } from "./utils.js";

/**
 * @description Define possible field types in OpenAPI schema
 */
export type FieldType = "parameters" | "requestBody" | "responses";
type MediaType = `${string}/${string}`;

/**
 * @description Define acceptable HTTP status codes for successful responses
 */
// prettier-ignore
export type OkStatus = 100 | 101 | 102 | 103 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;

/**
 * @description Define acceptable HTTP status codes for error responses
 */
// prettier-ignore
export type ErrorStatus = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | '5XX' | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 429 | 431 | 444 | 450 | 451 | 497 | 498 | 499 | '4XX' | 'default';

/**
 * @description Enumeration for different styles of query parameter serialization
 */
export enum QuerySerializerStyle {
  From = "form",
  SpaceDelimited = "spaceDelimited",
  PipeDelimited = "pipeDelimited",
  DeepObject = "deepObject",
}

/**
 * @description Define a type for query serialization parameters with different styles and explode options
 */
type QuerySerializationParamsVariant<
  Style extends QuerySerializerStyle,
  Explode extends boolean,
> = {
  style: Style;
  explode: Explode;
};

/**
 * @description Combine all possible query serialization parameters into a union type
 */
export type QuerySerializationParams =
  | QuerySerializationParamsVariant<
      Exclude<QuerySerializerStyle, QuerySerializerStyle.DeepObject>,
      boolean
    >
  | QuerySerializationParamsVariant<QuerySerializerStyle.DeepObject, true>;

/**
 * @description Interface for options passed to OpenAPI requests using Axios
 */
export interface IOpenApiAxiosOptions<Status extends ValidStatusType> {
  validStatus: Status;
  querySerializationParams?: QuerySerializationParams;
}

/**
 * @description Type definition for the OpenAPI schema
 */
export type SchemaType = {
  [route in keyof object]: {
    [method in MethodType]?: {
      parameters: {
        query?: object;
        path?: object;
      };
      requestBody?: {
        content: {
          [content in MediaType]: unknown;
        };
      };
      responses?: {
        [code in number]: {
          content: {
            [content in MediaType]: unknown;
          };
        };
      };
    };
  };
};

/**
 * @description Extracts all path parameters for a given route and method in the schema
 */
type ParametersPathType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  CurrentFieldType<Schema, Method, Route, Field> extends Partial<
    Record<"path", object>
  >
    ? Required<Required<CurrentFieldType<Schema, Method, Route, Field>>["path"]>
    : never;

/**
 * @description Extracts all query parameters for a given route and method in the schema
 */
export type ParametersQueryType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  CurrentFieldType<Schema, Method, Route, Field> extends Partial<
    Record<"query", object>
  >
    ? Required<
        Required<CurrentFieldType<Schema, Method, Route, Field>>["query"]
      >
    : never;

/**
 * @description Defines options that include path and query parameters, Axios configuration, and valid status codes
 */
export type OptionsType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Status extends ValidStatusType | undefined = undefined,
> = MakeNeverEmpty<{
  params: ParametersPathType<Schema, Method, Route, "parameters">;
  query: ParametersQueryType<Schema, Method, Route, "parameters">;
}> & {
  axios?: AxiosRequestConfig;
  validStatus?: Status;
  querySerializationParams?: QuerySerializationParams;
};

/**
 * @description Defines a type for options parameters including path and query parameters
 */
export type OptionsTypeParams<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
> = {
  params: ParametersPathType<Schema, Method, Route, "parameters">;
  query: ParametersQueryType<Schema, Method, Route, "parameters">;
};

/**
 * @description Type for valid status codes used in OpenAPI requests
 */
export type ValidStatusType = "all" | "axios" | "fetch";

/**
 * @description Extracts all routes from the OpenAPI schema interface
 */
export type RoutesType<Schema extends SchemaType, Method extends MethodType> = {
  [K in keyof Schema]: Method extends keyof Schema[K]
    ? [Schema[K][Method]] extends [undefined]
      ? never
      : K
    : never;
}[keyof Schema];

/**
 * @description Checks for the existence of an internal field. If it exists, it retrieves it
 */
export type CurrentFieldType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> = Method extends keyof Schema[Route]
  ? Required<Schema[Route]>[Method] extends Partial<Record<Field, unknown>>
    ? Required<Required<Schema[Route]>[Method]>[Field]
    : never
  : never;

/**
 * @description Retrieves the content field from the request body
 */
type BodyDataContentType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  CurrentFieldType<Schema, Method, Route, Field> extends Partial<
    Record<"content", unknown>
  >
    ? CurrentFieldType<Schema, Method, Route, Field>["content"]
    : never;

/**
 * @description Retrieves the multipart/form-data field from the request body
 */
type FormDataType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  BodyDataContentType<Schema, Method, Route, Field> extends Partial<
    Record<"multipart/form-data", unknown>
  >
    ? BodyDataContentType<Schema, Method, Route, Field>["multipart/form-data"]
    : never;

/**
 * @description Retrieves the application/json field from the request body
 */
type JsonDataType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  BodyDataContentType<Schema, Method, Route, Field> extends Partial<
    Record<"application/json", unknown>
  >
    ? BodyDataContentType<Schema, Method, Route, Field>["application/json"]
    : never;

/**
 * @description Retrieves the request body
 */
export type BodyType<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> =
  | FormDataType<Schema, Method, Route, Field>
  | JsonDataType<Schema, Method, Route, Field>;

/**
 * @description Retrieves the response for a specific status code
 */
type FilterKeys<Obj, Matchers> = {
  [K in keyof Obj]: K extends Matchers ? Obj[K] : never;
}[keyof Obj];

/**
 * @description Type definition for response content
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseContent<T> = T extends { content: any } ? T["content"] : unknown;

/**
 * @description Type to define a successful response
 */
type SuccessResponse<T> = ResponseContent<FilterKeys<T, OkStatus>>;

/**
 * @description Type to define an error response
 */
type ErrorResponse<T> = ResponseContent<FilterKeys<T, ErrorStatus>>;

/**
 * @description Extracts the success data from the response content
 */
type SuccessData<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> = FilterKeys<
  SuccessResponse<CurrentFieldType<Schema, Method, Route, Field>>,
  MediaType
>;

/**
 * @description Extracts the error data from the response content
 */
type ErrorData<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> = FilterKeys<
  ErrorResponse<CurrentFieldType<Schema, Method, Route, Field>>,
  MediaType
>;

/**
 * @description Flattens the response data structure to map status codes to their corresponding data
 */
type FlattenResponse<
  Type,
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> = {
  [Key in keyof Type]: Key extends OkStatus
    ? SuccessData<Schema, Method, Route, Field>
    : Key extends ErrorStatus
      ? ErrorData<Schema, Method, Route, Field>
      : never;
};

/**
 * @example
 * {
 *  200: data,
 *  400: data
 * }
 */
export type StatusCodeData<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesType<Schema, Method>,
  Field extends FieldType,
> = FlattenResponse<
  CurrentFieldType<Schema, Method, Route, Field>,
  Schema,
  Method,
  Route,
  Field
>;
