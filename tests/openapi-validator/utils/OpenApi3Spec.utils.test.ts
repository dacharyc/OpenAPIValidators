import {
  serversPropertyNotProvidedOrIsEmptyArray,
  getMatchingServerUrlsAndServerBasePaths,
  getBasePath,
  unique,
  getPossibleValuesOfServerVariable,
  mapServerVariablesToPossibleValues,
  convertTemplateExpressionToConcreteExpression,
  getPossibleConcreteBasePaths,
} from '../../../src/openapi-validator/utils/OpenApi3Spec.utils';
import { defaultBasePath } from '../../../src/openapi-validator/utils/common.utils';

describe('OpenApi3Spec.utils', () => {
  describe('getMatchingServerUrlsAndServerBasePaths non-null assertion edge case', () => {
    const fn = getMatchingServerUrlsAndServerBasePaths;
    it('handles case where no possibleBasePaths match (non-null assertion)', () => {
      // This should not throw, but will skip the .map and return []
      const servers = [
        {
          url: '/api/{version}',
          variables: { version: { default: 'v1', enum: ['v2'] } },
        },
      ];
      // Pathname does not start with any possible base path
      const pathname = '/no-match';
      expect(fn(servers, pathname)).toEqual([]);
    });
  });

  describe('getBasePath', () => {
    const fn = getBasePath;
    it('returns defaultBasePath if no slash in url', () => {
      expect(fn('foo')).toBe(defaultBasePath);
    });
    it('returns path from first slash if present', () => {
      expect(fn('http://example.com/api')).toBe('/api');
    });
  });

  describe('getMatchingServerUrlsAndServerBasePaths edge case', () => {
    const fn = getMatchingServerUrlsAndServerBasePaths;
    it('returns empty array if no possibleBasePaths match', () => {
      const servers = [{ url: '/api' }];
      const pathname = '/no-match';
      expect(fn(servers, pathname)).toEqual([]);
    });
  });

  describe('unique', () => {
    it('returns unique values from an array', () => {
      expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    });
  });

  describe('getPossibleValuesOfServerVariable', () => {
    const fn = getPossibleValuesOfServerVariable;
    it('returns default if no enum', () => {
      expect(fn({ default: 'foo' })).toEqual(['foo']);
    });
    it('returns default and enum values, deduped', () => {
      expect(fn({ default: 'foo', enum: ['foo', 'bar'] })).toEqual([
        'foo',
        'bar',
      ]);
    });
  });

  describe('mapServerVariablesToPossibleValues', () => {
    const fn = mapServerVariablesToPossibleValues;
    it('maps variables to possible values', () => {
      expect(
        fn({ a: { default: 'x', enum: ['x', 'y'] }, b: { default: 'z' } }),
      ).toEqual({ a: ['x', 'y'], b: ['z'] });
    });
  });

  describe('convertTemplateExpressionToConcreteExpression', () => {
    const fn = convertTemplateExpressionToConcreteExpression;
    it('replaces variables in template', () => {
      expect(fn('/api/{version}/foo/{id}', { version: 'v1', id: '123' })).toBe(
        '/api/v1/foo/123',
      );
    });
    it('returns template if no variables to replace', () => {
      expect(fn('/api/foo', {})).toBe('/api/foo');
    });
  });

  describe('getPossibleConcreteBasePaths', () => {
    const fn = getPossibleConcreteBasePaths;
    it('returns all combinations of base path variables', () => {
      const result = fn('/api/{version}', {
        version: { default: 'v1', enum: ['v2'] },
      });
      expect(result.sort()).toEqual(['/api/v1', '/api/v2'].sort());
    });
    it('returns base path if no variables', () => {
      const result = fn('/api', {});
      expect(result).toEqual(['/api']);
    });
  });
  describe('serversPropertyNotProvidedOrIsEmptyArray', () => {
    it('returns true if servers is not provided', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(serversPropertyNotProvidedOrIsEmptyArray({} as any)).toBe(true);
    });
    it('returns true if servers is an empty array', () => {
      expect(
        serversPropertyNotProvidedOrIsEmptyArray(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { servers: [] } as any,
        ),
      ).toBe(true);
    });
    it('returns false if servers is a non-empty array', () => {
      expect(
        serversPropertyNotProvidedOrIsEmptyArray({
          servers: [{ url: '/api' }],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      ).toBe(false);
    });
  });

  describe('getMatchingServerUrlsAndServerBasePaths', () => {
    it('returns matching server and base path for simple case', () => {
      const servers = [{ url: '/api' }, { url: '/v1' }];
      const pathname = '/api/foo';
      const result = getMatchingServerUrlsAndServerBasePaths(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        servers as any,
        pathname,
      );
      expect(result).toEqual([
        { concreteUrl: '/api', matchingBasePath: '/api' },
      ]);
    });
    it('returns empty array if no server matches', () => {
      const servers = [{ url: '/api' }, { url: '/v1' }];
      const pathname = '/other/foo';
      const result = getMatchingServerUrlsAndServerBasePaths(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        servers as any,
        pathname,
      );
      expect(result).toEqual([]);
    });
    it('handles defaultBasePath', () => {
      const servers = [{ url: defaultBasePath }];
      const pathname = '/foo';
      const result = getMatchingServerUrlsAndServerBasePaths(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        servers as any,
        pathname,
      );
      expect(result).toEqual([{ concreteUrl: '/', matchingBasePath: '/' }]);
    });
  });
});
