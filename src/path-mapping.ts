/**
 * Converts a OpenAPI path fragment convention to the colon convention that is
 * commonly used in Node.js and also MSW. Colons that are already part of the
 * path, such as the one before a custom method, are escaped so MSW matches
 * them literally instead of reading them as path parameters.
 *
 * **Example:** `/users/{id} --> /users/:id`
 *
 * **Example:** `/users/{id}:archive --> /users/:id\:archive`
 */
export function convertToColonPath(path: string, baseUrl?: string): string {
  const resolvedPath = path
    .replaceAll(":", "\\:")
    .replaceAll("{", ":")
    .replaceAll("}", "");
  if (!baseUrl) return resolvedPath;

  return baseUrl + resolvedPath;
}
