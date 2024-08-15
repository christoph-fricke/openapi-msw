// @REFERENCE: https://github.com/moroshko/interpolate-params
/* eslint @typescript-eslint/no-explicit-any: 0 */

const paramRegex = /{[a-zA-Z_]+}/g;

type InterpolationMap = (param: string, value: any) => any;

/**
 * @description Default mapping function used during parameter interpolation.
 * It simply returns the value provided without modification.
 *
 * @param _param - The parameter name (unused).
 * @param value - The value to map.
 * @returns The mapped value.
 */
function defaultMap(_param: string, value: any): any {
  return value;
}

/**
 * @description Creates a shallow copy of the given parameters object.
 *
 * @param params - The parameters object to copy.
 * @returns A shallow copy of the `params` object.
 */
function copyParams(params: Record<string, any>) {
  const result = {} as Record<string, any>;
  for (const param in params) {
    if (Object.prototype.hasOwnProperty.call(params, param)) {
      result[param] = params[param];
    }
  }
  return result;
}

/**
 * @description Replaces placeholders in a pattern string with corresponding values from the `params` object.
 *
 * @param pattern - The string pattern containing placeholders in the format `{paramName}`.
 * @param params - An object containing parameter values keyed by their names.
 * @param map - An optional mapping function to transform values before interpolation.
 * @returns The interpolated string with placeholders replaced by their corresponding values.
 */
export function interpolateParams(
  pattern: string,
  params: Record<string, any>,
  map?: InterpolationMap,
): string {
  const actualMap = map || defaultMap;
  const remainingParams = copyParams(params);
  const interpolatedPattern = pattern.replace(
    paramRegex,
    function (paramWithBrackets) {
      const param = paramWithBrackets.slice(1, paramWithBrackets.length - 1);
      if (param in params) {
        const value = actualMap(param, params[param]);
        if (value === null) {
          return "";
        }
        delete remainingParams[param];
        return value;
      }
    },
  );
  return interpolatedPattern;
}
