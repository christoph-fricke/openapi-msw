import type { OptionalKeys } from "./type-utils.js";

/** Return values for getting the first value of a query param. */
type ParamValuesGet<Params extends object> = {
  [Name in keyof Params]-?: Name extends OptionalKeys<Params>
    ? Params[Name] | null
    : Params[Name];
};

/** Return values for getting all values of a query param. */
type ParamValuesGetAll<Params extends object> = {
  [Name in keyof Params]-?: Required<Params>[Name][];
};

/**
 * Wrapper around the search params of a request that offers methods for
 * querying search params with enhanced type-safety from OpenAPI-TS.
 */
export class QueryParams<Params extends object> {
  #searchParams: URLSearchParams;
  constructor(request: Request) {
    this.#searchParams = new URL(request.url).searchParams;
  }

  /**
   * Wraps around {@link URLSearchParams.size}.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/size)
   */
  get size(): number {
    return this.#searchParams.size;
  }

  /**
   * Wraps around {@link URLSearchParams.get} with type inference from the
   * provided OpenAPI-TS `paths` definition.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get)
   */
  get<Name extends keyof Params>(name: Name): ParamValuesGet<Params>[Name] {
    const value = this.#searchParams.get(name as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value as any;
  }

  /**
   * Wraps around {@link URLSearchParams.getAll} with type inference from the
   * provided OpenAPI-TS `paths` definition.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll)
   */
  getAll<Name extends keyof Params>(
    name: Name,
  ): ParamValuesGetAll<Params>[Name] {
    const values = this.#searchParams.getAll(name as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return values as any;
  }

  /**
   * Wraps around {@link URLSearchParams.has} with type inference from the
   * provided OpenAPI-TS `paths` definition.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has)
   */
  has<Name extends keyof Params>(name: Name, value?: Params[Name]): boolean {
    return this.#searchParams.has(name as string, value as string | undefined);
  }
}
