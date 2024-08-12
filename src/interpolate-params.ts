// @REFERENCE: https://github.com/moroshko/interpolate-params
/* eslint @typescript-eslint/no-explicit-any: 0 */

const paramRegex = /{[a-zA-Z_]+}/g;

type InterpolationMap = (param: string, value: any) => any;

function defaultMap(_param: string, value: any): any {
  return value;
}

function copyParams(params: Record<string, any>) {
  const result = {} as Record<string, any>;
  for (const param in params) {
    if (Object.prototype.hasOwnProperty.call(params, param)) {
      result[param] = params[param];
    }
  }
  return result;
}

export function interpolateParams(pattern: string, params: Record<string, any>, map?: InterpolationMap): string {
  const actualMap = map || defaultMap;
  const remainingParams = copyParams(params);
  const interpolatedPattern = pattern.replace(paramRegex, function (paramWithBrackets) {
    const param = paramWithBrackets.slice(1, paramWithBrackets.length - 1);
    if (param in params) {
      const value = actualMap(param, params[param]);
      if (value === null) {
        return '';
      }
      delete remainingParams[param];
      return value;
    }
  });
  return interpolatedPattern;
}
