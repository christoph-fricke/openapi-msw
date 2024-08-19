import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CustomParamsSerializer,
} from "axios";
import { defaultOptions } from "./const/defaultOptions.js";
import { type MethodType, type MethodTypeWithBody } from "./const/methods.js";
import { interpolateParams } from "./interpolate-params.js";
import type {
  IOpenApiAxiosOptions,
  OptionsType,
  ValidStatusType,
} from "./types/options.js";
import type {
  FetcherWithBodyParameters,
  FetcherWithoutBodyParameters,
} from "./types/requestParameters.js";
import type { GetApiResponse } from "./types/response.js";
import type {
  RouteResponsesByStatusCode,
  RoutesForMethod,
  SchemaType,
} from "./types/schemeTypes.js";
import type { IsNullable } from "./types/utils.js";
import { getQuerySerializer } from "./utils/querySerializer.js";
import { convertToAll } from "./utils/response-converters/convertToAll.js";
import { convertToAxios } from "./utils/response-converters/convertToAxios.js";
import { convertToFetch } from "./utils/response-converters/convertToFetch.js";

/**
 * @description OpenApiAxios class is a wrapper around Axios that provides methods to handle API requests
 * and responses based on OpenAPI specifications.
 *
 * @template Schema - The OpenAPI schema type.
 * @template ClassValidStatus - The type that configures the error handling strategy.
 */
export class OpenApiAxios<
  Schema extends SchemaType,
  ClassValidStatus extends ValidStatusType,
> {
  private axios: AxiosInstance;
  private opt: IOpenApiAxiosOptions<ClassValidStatus>;

  /**
   * @description Creates an instance of OpenApiAxios.
   *
   * @param axios - The Axios instance to use for requests.
   * @param options - Configuration options for the OpenApiAxios instance.
   */
  constructor(
    axios: AxiosInstance,
    options: IOpenApiAxiosOptions<ClassValidStatus>,
  ) {
    this.axios = axios;
    this.opt = Object.assign({}, defaultOptions, options);
  }

  // HTTP methods without a request body
  public get = this.factoryWithoutBody("get");
  public head = this.factoryWithoutBody("head");
  public delete = this.factoryWithoutBody("delete");
  public options = this.factoryWithoutBody("options");

  // HTTP methods with a request body
  public put = this.factoryWithBody("put");
  public post = this.factoryWithBody("post");
  public patch = this.factoryWithBody("patch");

  /**
   * @description Generates a URI for a given API endpoint, including query parameters.
   *
   * @param method - The HTTP method to use.
   * @param path - The API route.
   * @param options - Additional options for the request.
   * @returns The generated URI as a string.
   */
  public async getUri<
    Method extends MethodType,
    Route extends RoutesForMethod<Schema, Method>,
  >(method: Method, path: Route, options?: OptionsType<Schema, Method, Route>) {
    const { urlString, newOptions } = this.prepareOptions(path, options);
    const { paramsSerializer, params, ...axios } =
      this.optionsToAxiosOptions(newOptions);

    // Axios getUri doesn't support serializers
    const queryUri =
      Object.keys(params || {}).length > 0
        ? `?${(paramsSerializer as CustomParamsSerializer)(params)}`
        : "";

    return this.axios.getUri({
      url: `${urlString}${queryUri}`,
      method,
      ...axios,
    }) as string;
  }

  /**
   * @description Prepares the options and URL for an API request.
   *
   * @param path - The API route.
   * @param options - Additional options for the request.
   * @returns An object containing the prepared URL string and new options.
   */
  private prepareOptions<
    Method extends MethodType,
    Route extends RoutesForMethod<Schema, Method>,
    MethodValidStatus extends ValidStatusType | undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, Method, Route, MethodValidStatus>,
  ) {
    let urlString = path as string;

    // Assign ValidStatus from class if not provided in request options
    const newOptions: OptionsType<
      Schema,
      Method,
      Route,
      IsNullable<MethodValidStatus> extends true
        ? ClassValidStatus
        : NonNullable<MethodValidStatus>
    > = Object.assign({}, options, {
      validStatus: this.opt.validStatus,
    });

    // Create URL by interpolating parameters based on the OpenAPI pattern
    // @ts-expect-error; @TODO See issue #2 - https://github.com/web-bee-ru/openapi-axios/issues/2
    if (newOptions?.params)
      urlString = interpolateParams(
        urlString,
        // @ts-expect-error; @TODO See issue #2 - https://github.com/web-bee-ru/openapi-axios/issues/2
        newOptions.params,
      );

    // Assign query serializer to Axios
    const querySerializationParams =
      options?.querySerializationParams || this.opt.querySerializationParams;
    if (!options?.axios?.paramsSerializer && querySerializationParams) {
      newOptions.axios = Object.assign({}, newOptions.axios, {
        paramsSerializer: getQuerySerializer(querySerializationParams),
      });
    }

    return {
      urlString,
      newOptions,
    };
  }

  /**
   * @description Prepares the API response based on the valid status type.
   *
   * @param response - The Axios response promise.
   * @param options - Options for the request.
   * @returns A promise that resolves to the processed API response.
   */
  private async prepareResponse<
    ValidStatus extends ValidStatusType,
    Method extends MethodType,
    Route extends RoutesForMethod<Schema, Method>,
    DataByCode extends Record<number, unknown> = RouteResponsesByStatusCode<
      Schema,
      Method,
      Route
    >,
  >(
    response: Promise<AxiosResponse>,
    options: OptionsType<Schema, Method, Route, ValidStatus>,
  ): Promise<GetApiResponse<ValidStatus, DataByCode>> {
    switch (options.validStatus) {
      case "all":
        return convertToAll<Schema, Method, Route, DataByCode>(
          response,
        ) as Promise<GetApiResponse<ValidStatus, DataByCode>>;
      case "fetch":
        return convertToFetch<Schema, Method, Route, DataByCode>(
          response,
        ) as Promise<GetApiResponse<ValidStatus, DataByCode>>;
      case "axios":
      default:
        return convertToAxios<Schema, Method, Route, DataByCode>(
          response,
        ) as Promise<GetApiResponse<ValidStatus, DataByCode>>;
    }
  }

  /**
   * @description Converts OpenAPI options to Axios request options.
   *
   * @param options - The options to convert.
   * @returns The converted Axios request configuration.
   */
  private optionsToAxiosOptions<
    Method extends MethodType,
    Route extends RoutesForMethod<Schema, Method>,
    MethodValidStatus extends ValidStatusType,
  >(
    options: OptionsType<Schema, Method, Route, MethodValidStatus>,
  ): AxiosRequestConfig {
    return {
      // @ts-expect-error; @TODO See issue #2 - https://github.com/web-bee-ru/openapi-axios/issues/2
      params: options?.query,
      ...options.axios,
    };
  }

  /**
   * @description Creates a fetcher method for HTTP methods that do not have a request body (e.g., GET, DELETE).
   *
   * @param method - The HTTP method to create a fetcher for.
   * @returns A function that performs the API request.
   */
  private factoryWithoutBody<
    Method extends Exclude<MethodType, MethodTypeWithBody>,
  >(method: Method) {
    return <
      Route extends RoutesForMethod<Schema, Method>,
      MethodValidStatus extends ValidStatusType | undefined = undefined,
    >(
      ...args: FetcherWithoutBodyParameters<
        Schema,
        Method,
        Route,
        MethodValidStatus
      >
    ) => {
      const [path, options] = args;
      const { urlString, newOptions } = this.prepareOptions(path, options);

      return this.prepareResponse(
        this.axios[method](urlString, this.optionsToAxiosOptions(newOptions)),
        newOptions,
      );
    };
  }

  /**
   * @description Creates a fetcher method for HTTP methods that have a request body (e.g., POST, PUT).
   *
   * @param method - The HTTP method to create a fetcher for.
   * @returns A function that performs the API request.
   */
  private factoryWithBody<Method extends MethodTypeWithBody>(method: Method) {
    return <
      Route extends RoutesForMethod<Schema, Method>,
      MethodValidStatus extends ValidStatusType | undefined,
    >(
      ...args: FetcherWithBodyParameters<
        Schema,
        Method,
        Route,
        MethodValidStatus
      >
    ) => {
      const [path, body, options] = args;
      const { urlString, newOptions } = this.prepareOptions(path, options);

      return this.prepareResponse(
        this.axios[method](
          urlString,
          body,
          this.optionsToAxiosOptions(newOptions),
        ),
        newOptions,
      );
    };
  }
}
