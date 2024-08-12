export type IsNullable<T> = [T] extends [NonNullable<T>] ? false : true;
