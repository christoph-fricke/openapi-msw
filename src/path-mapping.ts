/**
 * Converts a OpenAPI path fragment convention to the colon convention that is
 * commonly used in Node.js and also MSW.
 *
 * **Example:** `/users/{id} --> /users/:id`
 */
export function convertToColonPath(path: string, baseUrl?: string): string {
  const resolvedPath = path.replaceAll("{", ":").replaceAll("}", "");
  if (!baseUrl) return resolvedPath;

  return baseUrl + resolvedPath;
}
