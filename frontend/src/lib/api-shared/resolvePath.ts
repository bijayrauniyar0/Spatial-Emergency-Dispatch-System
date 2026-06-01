import { DynamicPath } from "./types";

type PathParams = Record<string, string | number>;

/**
 * Resolves a dynamic path with path parameters.
 * @param path - The path string, e.g. "/users/:id/posts/:postId"
 * @param pathParams - An object containing values for the dynamic segments
 * @returns The resolved path with encoded values
 */
export function resolvePath(
  path: DynamicPath,
  pathParams?: PathParams,
  rootPath?: DynamicPath,
): DynamicPath {
  if (rootPath) {
    path = `${rootPath}${path}` as DynamicPath;
  }
  if (!pathParams || !path.includes(":")) return path;

  return Object.keys(pathParams).reduce((acc, key) => {
    const value = pathParams[key];
    if (!/^[a-zA-Z0-9-_]+$/.test(String(value))) {
      throw new Error(`Invalid path param: ${key}`);
    }
    return acc.replace(`:${key}`, String(value));
  }, path) as DynamicPath;
}
