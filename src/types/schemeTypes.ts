import type { FilterKeys, PathsWithMethod } from "openapi-typescript-helpers";
import type { MethodType } from "../const/methods.js";
import type { FilterKeyOrNever, IsFieldOptional } from "./utils.js";

/**
 * @description Define possible field types in OpenAPI schema
 */
export type FieldType = "parameters" | "requestBody" | "responses";
type MediaType = `${string}/${string}`;

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
 * @description Checks for the existence of an internal field. If it exists, it retrieves it
 */
export type SchemeRoute<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
> = FilterKeys<FilterKeys<Schema, Route>, Method>;

/**
 * @description Checks for the existence of an internal field. If it exists, it retrieves it
 */
export type SchemeRouteField<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
  Field extends FieldType,
> = FilterKeys<SchemeRoute<Schema, Method, Route>, Field>;

/**
 * @description Extracts all path parameters for a given route and method in the schema
 */
export type RoutePath<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
> = FilterKeyOrNever<
  SchemeRouteField<Schema, Method, Route, "parameters">,
  "path"
>;

/**
 * @description Extracts all query parameters for a given route and method in the schema
 */
export type RouteQuery<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
> = FilterKeyOrNever<
  SchemeRouteField<Schema, Method, Route, "parameters">,
  "query"
>;

/**
 * @description Extracts all routes from the OpenAPI schema interface
 */
export type RoutesForMethod<
  Schema extends SchemaType,
  Method extends MethodType,
> = PathsWithMethod<Schema, Method>;

type TargetMimeTypes = `${string}/json` | `multipart/form-data`;

/**
 * @description Retrieves the request body
 */
export type RouteRequestBody<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
> =
  IsFieldOptional<
    SchemeRoute<Schema, Method, Route>,
    "requestBody"
  > extends true
    ?
        | FilterKeys<
            FilterKeys<
              FilterKeys<
                Required<SchemeRoute<Schema, Method, Route>>,
                "requestBody"
              >,
              "content"
            >,
            TargetMimeTypes
          >
        | undefined
    : FilterKeys<
        FilterKeys<
          FilterKeys<
            FilterKeys<FilterKeys<Schema, Route>, Method>,
            "requestBody"
          >,
          "content"
        >,
        TargetMimeTypes
      >;
// : FilterKeys<FilterKeys<SchemeRouteField<Schema, Method, Route, "requestBody">, "content">, TargetMimeTypes>

// : FilterKeys<FilterKeys<Required<SchemeRouteField<Schema, Method, Route, "requestBody">>, "content">, TargetMimeTypes> ;

// FilterKeys<
//   FilterKeys<SchemeRouteField<Schema, Method, Route, "requestBody">, "content">,
//   TargetMimeTypes
// >;

/**
 * @example
 * {
 *  200: data,
 *  400: data
 * }
 */
export type RouteResponsesByStatusCode<
  Schema extends SchemaType,
  Method extends MethodType,
  Route extends RoutesForMethod<Schema, Method>,
  Responses = SchemeRouteField<Schema, Method, Route, "responses">,
> = {
  [k in keyof Responses]: FilterKeys<
    FilterKeys<Responses[k], "content">,
    TargetMimeTypes
  >;
};
