/**
 * @description Type utility to determine if a type `T` is nullable.
 * Returns `true` if `T` is `null` or `undefined`, otherwise `false`.
 *
 * @template T - The type to check for nullability.
 */
export type IsNullable<T> = [T] extends [NonNullable<T>] ? false : true;

type Empty = never | void | undefined | null;

/**
 * @description Type utility that removes properties from a type `T` where the property type is `never` or `void`.
 * Properties with type `never` or `void` are made optional and set to `undefined`.
 *
 * @template T - The type from which to remove `never` and `void` properties.
 */
export type MakeNeverEmpty<T> = {
  [K in keyof T as T[K] extends Empty ? never : K]: T[K];
} & {
  [K in keyof T as T[K] extends Empty ? K : never]?: undefined;
};

/**
 * @description Type utility to determine if a type `T` is `never`.
 * Returns `true` if `T` is not `never`, otherwise `false`.
 *
 * @template T - The type to check.
 */
export type NotNever<T> = [T] extends [never] ? false : true;

/**
 * @description Type utility to filter the key `K` from type `T`.
 * Returns the type of `T[K]` if `K` is a key of `T` and `T[K]` is not `undefined`.
 * Otherwise, returns `never`.
 *
 * @template T - The object type to check.
 * @template K - The key to filter.
 */
export type FilterKeyOrNever<T, K> = K extends keyof T
  ? T[K] extends undefined
    ? never
    : T[K]
  : never;
