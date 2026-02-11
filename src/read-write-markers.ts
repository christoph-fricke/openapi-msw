/** Generated marker for readOnly properties. */
interface $Read<T> {
  readonly $read: T;
}

/** Generated marker for writeOnly properties. */
interface $Write<T> {
  readonly $write: T;
}

/** Recursively strips all markers from a given type. `writeOnly` properties are removed. */
export type StripWriteOnly<T> =
  T extends $Read<infer I>
    ? StripWriteOnly<I>
    : T extends (infer I)[]
      ? StripWriteOnly<I>[]
      : T extends object
        ? {
            [K in keyof T as Required<T>[K] extends $Write<unknown>
              ? never
              : K]: StripWriteOnly<T[K]>;
          }
        : T;

/** Recursively strips all markers from a given type. `readOnly` properties are removed. */
export type StripReadOnly<T> =
  T extends $Write<infer I>
    ? StripReadOnly<I>
    : T extends (infer I)[]
      ? StripReadOnly<I>[]
      : T extends object
        ? {
            [K in keyof T as Required<T>[K] extends $Read<unknown>
              ? never
              : K]: StripReadOnly<T[K]>;
          }
        : T;
