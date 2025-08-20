import { findOpenApiPathMatchingPossiblePathnames } from '../../../src/openapi-validator/utils/common.utils';

describe('findOpenApiPathMatchingPossiblePathnames', () => {
  it('returns last OAPath that matches via doesOpenApiPathMatchPathname if no exact match', () => {
    // OAPaths has a templated path, possiblePathnames has a concrete path
    const OAPaths = ['/foo/{id}'];
    const possiblePathnames = ['/foo/123'];
    // Should match via doesOpenApiPathMatchPathname, not exact
    const result = findOpenApiPathMatchingPossiblePathnames(
      possiblePathnames,
      OAPaths,
    );
    expect(result).toBe('/foo/{id}');
  });
});
