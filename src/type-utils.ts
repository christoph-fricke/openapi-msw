/** Converts a type to string while preserving string literal types. */
export type Stringify<Value> = Value extends string ? Value : string;

/** Converts a object values to their {@link Stringify} value. */
export type ConvertToStringified<Params> = {
  [Name in keyof Params]: Stringify<Required<Params>[Name]>;
};
