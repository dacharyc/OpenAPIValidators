import { RECEIVED_COLOR as red } from 'jest-matcher-utils';
import path from 'path';

import jestOpenAPI from 'jest-openapi';
import { joinWithNewLines } from '../../../../commonTestResources/utils';

const openApiSpecsDir = path.resolve(
  path.resolve(
    process.cwd(),
    'commonTestResources/exampleOpenApiFiles/valid/noResponseComponents',
  ),
);
const openApiSpecs = [
  {
    openApiVersion: 2,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi2WithNoResponses.json'),
  },
  {
    openApiVersion: 3,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi3WithNoComponents.yml'),
  },
];

describe.each(
  openApiSpecs.map(({ openApiVersion, pathToApiSpec }) => [
    openApiVersion,
    pathToApiSpec,
  ]),
)(
  'expect(res).toSatisfyApiSpec() (using an OpenAPI %i spec with no response component definitions)',
  (_, pathToApiSpec) => {
    const res = {
      status: 204,
      req: {
        method: 'GET',
        path: '/endpointPath',
      },
    };

    beforeAll(() => {
      jestOpenAPI(pathToApiSpec);
    });

    it('fails', () => {
      const assertion = () => expect(res).toSatisfyApiSpec();
      expect(assertion).toThrow(
        // prettier-ignore
        joinWithNewLines(
          `expected ${red('received')} to satisfy a '204' response defined for endpoint 'GET /endpointPath' in your API spec`,
          `${red('received')} had status ${red('204')}, but your API spec has no ${red('204')} response defined for endpoint 'GET /endpointPath'`,
        ),
      );
    });

    it('passes when using .not', () => {
      expect(res).not.toSatisfyApiSpec();
    });
  },
);
