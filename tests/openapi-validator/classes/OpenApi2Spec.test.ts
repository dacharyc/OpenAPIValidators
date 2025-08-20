import OpenApi2Spec from '../../../src/openapi-validator/classes/OpenApi2Spec';
import ValidationError, {
  ErrorCode,
} from '../../../src/openapi-validator/classes/errors/ValidationError';

describe('OpenApi2Spec', () => {
  const baseSpec = {
    swagger: '2.0',
    info: { title: 't', version: 'v' },
    paths: { '/foo': {} },
    definitions: { Foo: { type: 'object' } },
    responses: { Bar: { description: 'bar', schema: { type: 'string' } } },
  };

  it('detects user-defined basePath', () => {
    const spec = new OpenApi2Spec({ ...baseSpec, basePath: '/api' });
    expect(spec.didUserDefineBasePath).toBe(true);
  });

  it('detects missing basePath', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(spec.didUserDefineBasePath).toBe(false);
  });

  it('findOpenApiPathMatchingPathname throws if basePath does not match', () => {
    const spec = new OpenApi2Spec({ ...baseSpec, basePath: '/api' });
    expect(() => spec.findOpenApiPathMatchingPathname('/nope/foo')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/nope/foo');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).code).toBe(ErrorCode.BasePathNotFound);
    }
  });

  it('findOpenApiPathMatchingPathname throws if path not found', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(() => spec.findOpenApiPathMatchingPathname('/nope')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/nope');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).code).toBe(ErrorCode.PathNotFound);
    }
  });

  it('findOpenApiPathMatchingPathname returns path if found', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(spec.findOpenApiPathMatchingPathname('/foo')).toBe('/foo');
  });

  it('findResponseDefinition returns correct response', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(spec.findResponseDefinition('#/responses/Bar')).toEqual(
      baseSpec.responses.Bar,
    );
  });

  it('findResponseDefinition returns undefined if responses is missing', () => {
    const { responses, ...specObj } = baseSpec;
    const spec = new OpenApi2Spec(specObj);
    expect(spec.findResponseDefinition('#/responses/Bar')).toBeUndefined();
  });

  it('findOpenApiPathMatchingPathname works with basePath and matching pathname', () => {
    const spec = new OpenApi2Spec({
      ...baseSpec,
      basePath: '/api',
      paths: { '/foo': {} },
    });
    // '/api/foo' should match basePath '/api' and path '/foo'
    expect(spec.findOpenApiPathMatchingPathname('/api/foo')).toBe('/foo');
  });

  it('getComponentDefinitionsProperty returns definitions', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(spec.getComponentDefinitionsProperty()).toEqual({
      definitions: baseSpec.definitions,
    });
  });

  it('getSchemaObjects returns definitions', () => {
    const spec = new OpenApi2Spec(baseSpec);
    expect(spec.getSchemaObjects()).toEqual(baseSpec.definitions);
  });
});
