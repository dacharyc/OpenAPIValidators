import path from 'path';

import jestOpenAPI from 'jest-openapi';

const openApiSpecsDir = path.resolve(
  path.resolve(
    process.cwd(),
    'commonTestResources/exampleOpenApiFiles/valid/preferNonTemplatedPathOverTemplatedPath',
  ),
);

const openApiVersions = [2, 3];
const specCases = [
  {
    isNonTemplatedPathFirst: true,
    dir: 'nonTemplatedPathBeforeTemplatedPath',
    label: 'before',
  },
  {
    isNonTemplatedPathFirst: false,
    dir: 'nonTemplatedPathAfterTemplatedPath',
    label: 'after',
  },
];

describe.each(openApiVersions)('openapi %i', (openApiVersion) => {
  describe.each(specCases)(
    'res.req.path matches a non-templated openapi path %s a templated openapi path',
    (specCase) => {
      const pathToApiSpec = path.join(
        openApiSpecsDir,
        specCase.dir,
        `openapi${openApiVersion}.yml`,
      );
      const res = {
        status: 200,
        req: {
          method: 'GET',
          path: '/preferNonTemplatedPathOverTemplatedPath/nonTemplatedPath',
        },
        body: 'valid body (string)',
      };

      beforeAll(() => {
        jestOpenAPI(pathToApiSpec);
      });

      it(`passes (non-templated path ${specCase.label} templated path)`, () => {
        expect(res).toSatisfyApiSpec();
      });

      it(`fails when using .not (non-templated path ${specCase.label} templated path)`, () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          "not to satisfy the '200' response defined for endpoint 'GET /preferNonTemplatedPathOverTemplatedPath/nonTemplatedPath'",
        );
      });
    },
  );
});
