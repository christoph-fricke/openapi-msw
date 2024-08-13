import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { defaultOptions } from "./const/defaultOptions.js";
import { interpolateParams } from "./interpolate-params.js";
import type { GetApiResponse } from "./types/response.js";
import type {
  BodyType,
  IOpenApiAxiosOptions,
  MethodType,
  OptionsType,
  OptionsTypeParams,
  RoutesType,
  SchemaType,
  StatusCodeData,
  ValidStatusType,
} from "./types/types.js";
import type { IsNullable } from "./types/utils.js";
import { convertToAll } from "./utils/response-converters/convertToAll.js";
import { convertToAxios } from "./utils/response-converters/convertToAxios.js";
import { convertToFetch } from "./utils/response-converters/convertToFetch.js";

export class OpenApiAxios<
  Schema extends SchemaType,
  ClassValidStatus extends ValidStatusType,
> {
  private axios: AxiosInstance;
  private opt: IOpenApiAxiosOptions<ClassValidStatus>;

  constructor(
    axios: AxiosInstance,
    options: IOpenApiAxiosOptions<ClassValidStatus>,
  ) {
    this.axios = axios;
    this.opt = Object.assign({}, defaultOptions, options);
  }

  public async get<
    Route extends RoutesType<Schema, "get">,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, "get", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.get(urlString, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }
  public async delete<
    Route extends RoutesType<Schema, "delete">,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, "delete", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.delete(urlString, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }
  public async options<
    Route extends RoutesType<Schema, "options">,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, "options", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.options(urlString, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }

  public async head<
    Route extends RoutesType<Schema, "head">,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, "head", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.head(urlString, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }

  public async post<
    Route extends RoutesType<Schema, "post">,
    Body extends
      | BodyType<Schema, "post", Route, "requestBody">
      | undefined = undefined,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    body?: Body,
    options?: OptionsType<Schema, "post", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.post(urlString, body, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }

  public async put<
    Route extends RoutesType<Schema, "put">,
    Body extends
      | BodyType<Schema, "put", Route, "requestBody">
      | undefined = undefined,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    body?: Body,
    options?: OptionsType<Schema, "put", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.put(urlString, body, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }

  public async patch<
    Route extends RoutesType<Schema, "patch">,
    Body extends
      | BodyType<Schema, "patch", Route, "requestBody">
      | undefined = undefined,
    MethodValidStatus extends ValidStatusType | undefined = undefined,
  >(
    path: Route,
    body?: Body,
    options?: OptionsType<Schema, "patch", Route, MethodValidStatus>,
  ) {
    const { urlString, newOptions } = this.prepareOptions(path, options);

    return this.prepareResponse(
      this.axios.patch(urlString, body, this.optionsToAxiosOptions(newOptions)),
      newOptions,
    );
  }

  private optionsToAxiosOptions<
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    MethodValidStatus extends ValidStatusType,
  >(
    options: OptionsType<Schema, Method, Route, MethodValidStatus>,
  ): AxiosRequestConfig {
    return {
      params: (
        options as never as OptionsTypeParams<Schema, Method, Route> | undefined
      )?.query,
      ...options.axios,
    };
  }

  private async prepareResponse<
    ValidStatus extends ValidStatusType,
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
    options: OptionsType<Schema, Method, Route, ValidStatus>,
  ): Promise<GetApiResponse<ValidStatus, DataByCode>> {
    switch (options.validStatus) {
      case "all":
        // @ts-expect-error @TODO: try to fix it (unlikely)
        return convertToAll<Schema, Method, Route, DataByCode>(response);
      case "fetch":
        // @ts-expect-error @TODO: try to fix it (unlikely)
        return convertToFetch<Schema, Method, Route, DataByCode>(response);
      case "axios":
      default:
        // @ts-expect-error @TODO: try to fix it (unlikely)
        return convertToAxios<Schema, Method, Route, DataByCode>(response);
    }
  }

  // @TODO: override
  // public async getUri<
  //   Method extends MethodType,
  //   Route extends RoutesType<Schema, Method>,
  // >(
  //   method: Method,
  //   path: Route,
  //   options?: Pick<
  //     OptionsType<Schema, Method, Route>,
  //     "params" | "query" | "axios"
  //   >,
  // ) {
  //   const { urlString } = this.prepareOptions<Method, Route, ClassValidStatus>(
  //     path,
  //     options,
  //   );
  //   const uri = this.axios.getUri({
  //     url: urlString,
  //     method,
  //     params: options?.query,
  //     ...options?.axios,
  //   }) as Opaque<string, [Schema, Route, Method]>;
  //   return uri;
  // }

  private prepareOptions<
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    MethodValidStatus extends ValidStatusType | undefined,
  >(
    path: Route,
    options?: OptionsType<Schema, Method, Route, MethodValidStatus>,
  ) {
    let urlString = path as string;
    const newOptions: OptionsType<
      Schema,
      Method,
      Route,
      IsNullable<MethodValidStatus> extends true
        ? ClassValidStatus
        : NonNullable<MethodValidStatus>
    > = Object.assign({}, options, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validStatus: this.opt.validStatus as any,
    });

    if (
      (
        newOptions as never as
          | OptionsTypeParams<Schema, Method, Route>
          | undefined
      )?.params
    )
      urlString = interpolateParams(
        urlString,
        (newOptions as never as OptionsTypeParams<Schema, Method, Route>)
          .params,
      );

    return {
      urlString,
      newOptions,
    };
  }
}
