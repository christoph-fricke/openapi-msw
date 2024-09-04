import type { MethodType, MethodTypeWithBody } from "../const/methods.js";
import type { OptionsType, ValidStatusType } from "./options.js";
import type {
  RouteQuery,
  RouteRequestBody,
  RoutesForMethod,
  SchemaType,
} from "./schemeTypes.js";
import type { NotNever } from "./utils.js";

/**
 * @description Type definition for fetcher functions without a request body.
 * This type handles methods that do not require a request body (e.g., GET, DELETE).
 *
 * @template Schema - The OpenAPI schema type.
 * @template Method - The HTTP method type (excluding methods with a body).
 * @template Route - The route type within the schema.
 */
export type FetcherWithoutBodyParameters<
  Schema extends SchemaType,
  Method extends Exclude<MethodType, MethodTypeWithBody>,
  Route extends RoutesForMethod<Schema, Method>,
  MethodValidStatus extends ValidStatusType | undefined = undefined,
  StrictOptions extends boolean = NotNever<RouteQuery<Schema, Method, Route>>,
> = Parameters<
  (
    // prettier-ignore
    ...args: StrictOptions extends true
      ? Parameters<(path: Route, options: OptionsType<Schema, Method, Route, MethodValidStatus>) => never>
      : Parameters<(path: Route, options?: OptionsType<Schema, Method, Route, MethodValidStatus>) => never>
  ) => never
>;

/**
 * @description Type definition for fetcher functions with a request body.
 * This type handles methods that require a request body (e.g., POST, PUT).
 *
 * @template Schema - The OpenAPI schema type.
 * @template Method - The HTTP method type (requiring a body).
 * @template Route - The route type within the schema.
 */
export type FetcherWithBodyParameters<
  Schema extends SchemaType,
  Method extends MethodTypeWithBody,
  Route extends RoutesForMethod<Schema, Method>,
  MethodValidStatus extends ValidStatusType | undefined = undefined,
  Body extends NotNever<RouteRequestBody<Schema, Method, Route>> extends true
    ? RouteRequestBody<Schema, Method, Route>
    : undefined = NotNever<RouteRequestBody<Schema, Method, Route>> extends true
    ? RouteRequestBody<Schema, Method, Route>
    : undefined,
  StrictBody extends boolean = NotNever<
    RouteRequestBody<Schema, Method, Route>
  >,
  StrictOptions extends boolean = NotNever<RouteQuery<Schema, Method, Route>>,
  HasBody extends boolean = StrictOptions extends true ? true : StrictBody,
> = Parameters<
  (
    // prettier-ignore
    ...args: StrictOptions extends true
    ? Parameters<(path: Route, body: Body, options: OptionsType<Schema, Method, Route, MethodValidStatus>) => never>
    : HasBody extends true
        ? Parameters<(path: Route, body: Body, options?: OptionsType<Schema, Method, Route, MethodValidStatus>) => never>
        : Parameters<(path: Route, body?: Body, options?: OptionsType<Schema, Method, Route, MethodValidStatus>) => never>
  ) => never
>;
