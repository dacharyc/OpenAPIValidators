import path from 'path';
import { inspect } from 'util';

import jestOpenAPI from '../../src/jest-openapi';

const dirContainingApiSpec = path.resolve(
  path.resolve(
    process.cwd(),
    'commonTestResources/exampleOpenApiFiles/valid/bugRecreationTemplate',
  ),
);

describe('recreate bug (issue #XX)', () => {
  beforeAll(() => {
    const pathToApiSpec = path.join(dirContainingApiSpec, 'openapi.yml');
    jestOpenAPI(pathToApiSpec);
  });

  const res = {
    status: 200,
    req: {
      method: 'GET',
      path: '/recreate/bug',
    },
    body: {
      expectedProperty1: 'foo',
    },
  };

  it('passes', () => {
    expect(res).toSatisfyApiSpec();
  });

  it('fails when using .not', () => {
    const assertion = () => expect(res).not.toSatisfyApiSpec();
    expect(assertion).toThrow(
      inspect({
        body: {
          expectedProperty1: 'foo',
        },
      }),
    );
  });
});
