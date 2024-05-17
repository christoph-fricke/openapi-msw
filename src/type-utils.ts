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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof O]-?: {} extends Pick<O, K> ? K : never;
}[keyof O];

/**
 * Combines a union of objects into a single object.
 * This is useful for types like `keyof ({ a: string } | { b: string })`,
 * which is `never` without {@link ResolvedObjectUnion}.
 *
 * A use-case example of such situation is mapping different media-types that
 * split across multiple status codes.
 *
 * @see https://www.steveruiz.me/posts/smooshed-object-union
 */
export type ResolvedObjectUnion<T> = {
  [K in T extends infer P ? keyof P : never]: T extends infer P
    ? K extends keyof P
      ? P[K]
      : never
    : never;
};

/** Maps an object into a union of all its inner values. */
export type MapToValues<Obj> = Obj[keyof Obj];
