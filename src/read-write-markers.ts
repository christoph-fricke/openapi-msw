/** Generated marker for readOnly properties. */
interface $Read<T> {
  readonly $read: T;
}

/** Generated marker for writeOnly properties. */
interface $Write<T> {
  readonly $write: T;
}

/** Returns `never` when the property `K` is `writeOnly` in `O`. `K` otherwise. */
type ExcludeWriteKey<O extends object, K extends keyof O> =
  Required<O>[K] extends $Write<unknown> ? never : K;

/** Returns `never` when the property `K` is `readOnly` in `O`. `K` otherwise. */
type ExcludeReadKey<O extends object, K extends keyof O> =
  Required<O>[K] extends $Read<unknown> ? never : K;

/** Recursively strips all markers from a given type. `writeOnly` properties are removed. */
export type StripWriteOnly<T> =
  T extends $Write<unknown>
    ? never
    : T extends $Read<infer I>
      ? StripWriteOnly<I>
      : T extends (infer I)[]
        ? StripWriteOnly<I>[]
        : T extends object
          ? {
              [K in keyof T as ExcludeWriteKey<T, K>]: StripWriteOnly<T[K]>;
            }
          : T;

/** Recursively strips all markers from a given type. `readOnly` properties are removed. */
export type StripReadOnly<T> =
  T extends $Read<unknown>
    ? never
    : T extends $Write<infer I>
      ? StripReadOnly<I>
      : T extends (infer I)[]
        ? StripReadOnly<I>[]
        : T extends object
          ? {
              [K in keyof T as ExcludeReadKey<T, K>]: StripReadOnly<T[K]>;
            }
          : T;
