/**
 * @description Defines all possible HTTP method types as string literals.
 */
// prettier-ignore
export type MethodType = "get" | "post" | "patch" | "put" | "delete" | "head" | "options";

/**
 * @description A constant array of HTTP methods that typically include a request body.
 */
export const METHODS_WITH_BODY = ["post", "patch", "put"] as const;

/**
 * @description Type that represents any HTTP method from the METHODS_WITH_BODY array.
 */
export type MethodTypeWithBody = (typeof METHODS_WITH_BODY)[number];

/**
 * @description Function to check if a given method is one that typically includes a request body.
 * @param method - The HTTP method to check.
 * @returns A boolean indicating whether the method is one that includes a request body.
 */
export function isMethodWithBody(method: string): method is MethodTypeWithBody {
  return (METHODS_WITH_BODY as never as string[]).includes(method);
}
