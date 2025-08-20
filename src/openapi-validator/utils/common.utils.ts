import { match } from 'path-to-regexp';
import url from 'url';
import { inspect } from 'util';
import type { ActualRequest } from '../classes/AbstractResponse';

export const stringify = (obj: unknown): string =>
  inspect(obj, { depth: null });

/**
 * Excludes the query because path = pathname + query
 */
export const getPathname = (request: ActualRequest): string =>
  url.parse(request.path).pathname!;

/**
 * Converts all {foo} to :foo
 */
const convertOpenApiPathToColonForm = (openApiPath: string): string =>
  openApiPath.replace(/{/g, ':').replace(/}/g, '');

const doesColonPathMatchPathname = (
  pathInColonForm: string,
  pathname: string,
): boolean => {
  /*
   * By default, OpenAPI path parameters have `style: simple; explode: false` (https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object)
   * So array path parameters in the pathname of the actual request should be in the form: `/pathParams/a,b,c`
   * We remove the commas for compatibility with legacy behavior.
   */
  const pathWithoutCommas = pathname.replace(/,/g, '');
  // path-to-regexp expects colon-form, so this is compatible
  const matcher = match(pathInColonForm, { decode: decodeURIComponent });
  const result = matcher(pathWithoutCommas);
  return Boolean(result);
};

const doesOpenApiPathMatchPathname = (
  openApiPath: string,
  pathname: string,
): boolean => {
  const pathInColonForm = convertOpenApiPathToColonForm(openApiPath);
  return doesColonPathMatchPathname(pathInColonForm, pathname);
};

export const findOpenApiPathMatchingPossiblePathnames = (
  possiblePathnames: string[],
  OAPaths: string[],
): string | undefined => {
  let openApiPath: string | undefined;
  // eslint-disable-next-line no-restricted-syntax
  for (const pathname of possiblePathnames) {
    // eslint-disable-next-line no-restricted-syntax
    for (const OAPath of OAPaths) {
      if (OAPath === pathname) {
        return OAPath;
      }
      if (doesOpenApiPathMatchPathname(OAPath, pathname)) {
        openApiPath = OAPath;
      }
    }
  }
  return openApiPath;
};

export const defaultBasePath = '/';

export const getPathnameWithoutBasePath = (
  basePath: string,
  pathname: string,
): string =>
  basePath === defaultBasePath ? pathname : pathname.replace(basePath, '');
