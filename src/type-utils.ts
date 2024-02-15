/**
 * Converts a type to string while preserving string literal types.
 * {@link Array}s are unboxed to their stringified value.
 */
export type Stringify<Value> = Value extends (infer Type)[]
  ? Type extends string
    ? Type
    : string
  : Value extends string
    ? Value
    : string;

/** Converts a object values to their {@link Stringify} value. */
export type ConvertToStringified<Params> = {
  [Name in keyof Params]: Stringify<Required<Params>[Name]>;
};

/** Returns a union of all property keys that are optional in the given object. */
export type OptionalKeys<O extends object> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof O]-?: {} extends Pick<O, K> ? K : never;
}[keyof O];
