export type IsNullable<T> = [T] extends [NonNullable<T>] ? false : true;

export type MakeNeverEmpty<T> = {
  [K in keyof T as T[K] extends never | void ? never : K]: T[K];
} & {
  [K in keyof T as T[K] extends never | void ? K : never]?: undefined;
};
