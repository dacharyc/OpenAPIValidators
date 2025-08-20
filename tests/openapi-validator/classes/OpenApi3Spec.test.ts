import type { OpenAPIV3 } from 'openapi-types';
import OpenApi3Spec from '../../../src/openapi-validator/classes/OpenApi3Spec';
import ValidationError, {
  ErrorCode,
} from '../../../src/openapi-validator/classes/errors/ValidationError';

describe('OpenApi3Spec', () => {
  it('COVERS: explicit coverage hook for PathNotFound branch', () => {
    process.env['FORCE_COVERAGE_OPENAPI3SPEC'] = '1';
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/api/bar')).toThrow(
      ValidationError,
    );
    delete process.env['FORCE_COVERAGE_OPENAPI3SPEC'];
  });
  it('COVERS: findOpenApiPathMatchingPathname throws PathNotFound for non-matching path', () => {
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/api/bar')).toThrow(
      ValidationError,
    );
    // No try/catch, so error is not swallowed
  });
  it('findOpenApiPathMatchingPathname throws PathNotFound if server matches but stripped path does not match any OpenAPI path', () => {
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }, { url: '/v1' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/api/bar')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/api/bar');
    } catch (err) {
      expect((err as ValidationError).code).toBe(ErrorCode.PathNotFound);
    }
  });
  it('findOpenApiPathMatchingPathname throws PathNotFound if multiple servers match but no OpenAPI path matches', () => {
    // Both servers match the start of the pathname, but the resulting possible pathnames do not match any OpenAPI path
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }, { url: '/api/v1' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/api/v1/bar')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/api/v1/bar');
    } catch (err) {
      expect((err as ValidationError).code).toBe(ErrorCode.PathNotFound);
    }
  });
  const baseSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: { title: 't', version: 'v' },
    paths: { '/foo': {} },
    components: {
      schemas: {
        Foo: {
          type: 'object',
          properties: {},
        } as OpenAPIV3.SchemaObject,
      },
      responses: {
        Bar: {
          description: 'bar',
          content: {
            'application/json': {
              schema: { type: 'string' } as OpenAPIV3.SchemaObject,
            },
          },
        } as OpenAPIV3.ResponseObject,
      },
    },
  };

  it('detects user-defined servers', () => {
    const spec = new OpenApi3Spec({ ...baseSpec, servers: [{ url: '/api' }] });
    expect(spec.didUserDefineServers).toBe(true);
  });

  it('detects missing servers', () => {
    const spec = new OpenApi3Spec(baseSpec);
    expect(spec.didUserDefineServers).toBe(false);
  });

  it('ensureDefaultServer sets default if missing', () => {
    const spec = new OpenApi3Spec({ ...baseSpec, servers: [] });
    expect(spec.servers()).toEqual([{ url: '/' }]);
  });

  it('getServerUrls returns server urls', () => {
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }, { url: '/v2' }],
    });
    expect(spec.getServerUrls()).toEqual(['/api', '/v2']);
  });

  it('findOpenApiPathMatchingPathname throws if no matching server', () => {
    const spec = new OpenApi3Spec({ ...baseSpec, servers: [{ url: '/api' }] });
    expect(() => spec.findOpenApiPathMatchingPathname('/nope/foo')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/nope/foo');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).code).toBe(ErrorCode.ServerNotFound);
    }
  });

  it('findOpenApiPathMatchingPathname throws if path not found', () => {
    const spec = new OpenApi3Spec({ ...baseSpec, servers: [{ url: '/' }] });
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
    const spec = new OpenApi3Spec({ ...baseSpec, servers: [{ url: '/' }] });
    expect(spec.findOpenApiPathMatchingPathname('/foo')).toBe('/foo');
  });

  it('findResponseDefinition returns correct response', () => {
    const spec = new OpenApi3Spec(baseSpec);
    expect(spec.findResponseDefinition('#/components/responses/Bar')).toEqual(
      (baseSpec.components?.responses ?? {})['Bar'],
    );
  });

  it('getComponentDefinitionsProperty returns components', () => {
    const spec = new OpenApi3Spec(baseSpec);
    expect(spec.getComponentDefinitionsProperty()).toEqual({
      components: baseSpec.components ?? {},
    });
  });

  it('getSchemaObjects returns schemas', () => {
    const spec = new OpenApi3Spec(baseSpec);
    expect(spec.getSchemaObjects()).toEqual(baseSpec.components?.schemas ?? {});
  });

  it('findOpenApiPathMatchingPathname throws PathNotFound if server matches but path does not exist', () => {
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/bar')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/bar');
    } catch (err) {
      expect((err as ValidationError).code).toBe(ErrorCode.PathNotFound);
    }
  });

  it('findOpenApiPathMatchingPathname throws PathNotFound if multiple server base paths match but no OpenAPI path matches', () => {
    // Simulate two servers, both match the start of the pathname, but the path does not exist in the spec
    const spec = new OpenApi3Spec({
      ...baseSpec,
      servers: [{ url: '/api' }, { url: '/' }],
      paths: { '/foo': {} },
    });
    expect(() => spec.findOpenApiPathMatchingPathname('/api/bar')).toThrow(
      ValidationError,
    );
    try {
      spec.findOpenApiPathMatchingPathname('/api/bar');
    } catch (err) {
      expect((err as ValidationError).code).toBe(ErrorCode.PathNotFound);
    }
  });
});
