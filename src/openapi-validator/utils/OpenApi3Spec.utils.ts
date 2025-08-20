import cartesianProduct from 'cartesian-product';
import type { OpenAPIV3 } from 'openapi-types';
import { defaultBasePath } from './common.utils';

// Helper: convert {a: [1,2], b: [3,4]} to [{a:1,b:3},{a:1,b:4},{a:2,b:3},{a:2,b:4}]
function objectCartesianProduct<T extends Record<string, string[]>>(
  obj: T,
): Array<Record<keyof T, string>> {
  const keys = Object.keys(obj) as Array<keyof T>;
  if (keys.length === 0)
    return [Object.create(null) as Record<keyof T, string>];
  const values = keys.map((k) => obj[k]);
  return (cartesianProduct(values) as unknown[]).map((vals) => {
    const entry: Record<keyof T, string> = Object.create(null);
    (vals as string[]).forEach((v, i) => {
      const key = keys[i];
      if (key !== undefined) {
        entry[key] = v;
      }
    });
    return entry;
  });
}

type ServerVariables = OpenAPIV3.ServerObject['variables'];

export const unique = <T>(array: T[]): T[] => [...new Set(array)];

export const serversPropertyNotProvidedOrIsEmptyArray = (
  spec: OpenAPIV3.Document,
): boolean => !spec.servers || !spec.servers.length;

export const getBasePath = (url: string): string => {
  const basePathStartIndex = url.replace('//', '  ').indexOf('/');
  return basePathStartIndex !== -1
    ? url.slice(basePathStartIndex)
    : defaultBasePath;
};

export const getPossibleValuesOfServerVariable = ({
  default: defaultValue,
  enum: enumMembers,
}: OpenAPIV3.ServerVariableObject): string[] =>
  enumMembers ? unique([defaultValue].concat(enumMembers)) : [defaultValue];

export const mapServerVariablesToPossibleValues = (
  serverVariables: NonNullable<ServerVariables>,
): Record<string, string[]> =>
  Object.entries(serverVariables).reduce(
    (currentMap, [variableName, detailsOfPossibleValues]) => ({
      ...currentMap,
      [variableName]: getPossibleValuesOfServerVariable(
        detailsOfPossibleValues,
      ),
    }),
    {},
  );

export const convertTemplateExpressionToConcreteExpression = (
  templateExpression: string,
  mapOfVariablesToValues: Record<string, string>,
) =>
  Object.entries(mapOfVariablesToValues).reduce(
    (currentExpression, [variable, value]) =>
      currentExpression.replace(`{${variable}}`, value),
    templateExpression,
  );

export const getPossibleConcreteBasePaths = (
  basePath: string,
  serverVariables: NonNullable<ServerVariables>,
): string[] => {
  if (!serverVariables || Object.keys(serverVariables).length === 0) {
    return [basePath];
  }
  const mapOfServerVariablesToPossibleValues =
    mapServerVariablesToPossibleValues(serverVariables);
  const combinationsOfBasePathVariableValues = objectCartesianProduct(
    mapOfServerVariablesToPossibleValues,
  );
  const possibleBasePaths = combinationsOfBasePathVariableValues.map(
    (mapOfVariablesToValues) =>
      convertTemplateExpressionToConcreteExpression(
        basePath,
        mapOfVariablesToValues,
      ),
  );
  return possibleBasePaths;
};

const getPossibleBasePaths = (
  url: string,
  serverVariables: ServerVariables,
): string[] => {
  const basePath = getBasePath(url);
  return serverVariables
    ? getPossibleConcreteBasePaths(basePath, serverVariables)
    : [basePath];
};

export const getMatchingServerUrlsAndServerBasePaths = (
  servers: OpenAPIV3.ServerObject[],
  pathname: string,
): { concreteUrl: string; matchingBasePath: string }[] => {
  const matchesPathname = (basePath: string): boolean =>
    pathname.startsWith(basePath);
  return servers
    .map(({ url: templatedUrl, variables }) => ({
      templatedUrl,
      possibleBasePaths: getPossibleBasePaths(templatedUrl, variables),
    }))
    .filter(({ possibleBasePaths }) => possibleBasePaths.some(matchesPathname))
    .map(({ templatedUrl, possibleBasePaths }) => {
      const matchingBasePath = possibleBasePaths.find(matchesPathname)!;
      return {
        concreteUrl: templatedUrl.replace(
          getBasePath(templatedUrl),
          matchingBasePath,
        ),
        matchingBasePath,
      };
    });
};
