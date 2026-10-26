/**
 * Converts a OpenAPI path fragment convention to the colon convention that is
 * commonly used in Node.js and also MSW. Colons that are already part of the
 * path, such as the one before a custom method, are escaped so MSW matches
 * them literally instead of reading them as path parameters. A colon before
 * an all-digit segment is left alone, since MSW v2 escapes it as a port.
 *
 * **Example:** `/users/{id} --> /users/:id`
 *
 * **Example:** `/users/{id}:archive --> /users/:id\:archive`
 */
export function convertToColonPath(path: string, baseUrl?: string): string {
  const resolvedPath = path
    .replace(/:(?!\d+(?:\/|$))/g, "\\:")
    .replaceAll("{", ":")
    .replaceAll("}", "");
  if (!baseUrl) return resolvedPath;

  return baseUrl + resolvedPath;
}
