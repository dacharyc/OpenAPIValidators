import jestOpenAPI from 'jest-openapi';
import { EXPECTED_COLOR as green } from 'jest-matcher-utils';
import path from 'path';

const openApiSpecsDir = path.resolve(
  path.resolve(
    process.cwd(),
    'commonTestResources/exampleOpenApiFiles/valid/satisfySchemaInApiSpec/noSchemaComponents',
  ),
);
const openApiSpecs = [
  {
    openApiVersion: 2,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi2WithNoDefinitions.json'),
  },
  {
    openApiVersion: 3,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi3WithNoComponents.yml'),
  },
];

describe.each(openApiSpecs)(
  'expect(obj).to.satisfySchemaInApiSpec(schemaName) (using an OpenAPI %i spec with no schema definitions)',
  ({ openApiVersion, pathToApiSpec }) => {
    const obj = 'foo';

    beforeAll(() => {
      jestOpenAPI(pathToApiSpec);
    });

    it(`fails for OpenAPI v${openApiVersion}`, () => {
      const assertion = () =>
        expect(obj).toSatisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).toThrow(
        `${green('schemaName')} must match a schema in your API spec`,
      );
    });

    it(`fails when using .not for OpenAPI v${openApiVersion}`, () => {
      const assertion = () =>
        expect(obj).not.toSatisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).toThrow(
        `${green('schemaName')} must match a schema in your API spec`,
      );
    });
  },
);
