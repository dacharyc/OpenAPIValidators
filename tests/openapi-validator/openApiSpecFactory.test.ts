import fs from 'fs-extra';
import path from 'path';
import OpenApi2Spec from '../../src/openapi-validator/classes/OpenApi2Spec';
import OpenApi3Spec from '../../src/openapi-validator/classes/OpenApi3Spec';
import makeApiSpec from '../../src/openapi-validator/openApiSpecFactory';

describe('makeApiSpec', () => {
  it('returns OpenApi2Spec for swagger 2.0 object', () => {
    const spec = {
      swagger: '2.0',
      info: { title: 't', version: 'v' },
      paths: {},
    };
    const result = makeApiSpec(spec);
    expect(result).toBeInstanceOf(OpenApi2Spec);
  });

  it('returns OpenApi3Spec for openapi 3.x object', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 't', version: 'v' },
      paths: {},
    };
    const result = makeApiSpec(spec);
    expect(result).toBeInstanceOf(OpenApi3Spec);
  });

  it('throws for non-object, non-string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => makeApiSpec(42 as any)).toThrow(
      /must be either an absolute filepath or an object/,
    );
  });

  it('throws for relative file path', () => {
    expect(() => makeApiSpec('foo.yml')).toThrow(/not an absolute filepath/);
  });

  it('throws for invalid YAML file', () => {
    const absPath = path.join(__dirname, 'invalidYaml.yml');
    fs.writeFileSync(absPath, 'not: [valid: yaml');
    try {
      expect(() => makeApiSpec(absPath)).toThrow(/Invalid YAML or JSON/);
    } finally {
      fs.unlinkSync(absPath);
    }
  });

  it('loads and parses a valid OpenAPI 2.0 YAML file', () => {
    const absPath = path.join(__dirname, 'valid2.yml');
    fs.writeFileSync(
      absPath,
      'swagger: "2.0"\ninfo:\n  title: t\n  version: v\npaths: {}',
    );
    try {
      const result = makeApiSpec(absPath);
      expect(result).toBeInstanceOf(OpenApi2Spec);
    } finally {
      fs.unlinkSync(absPath);
    }
  });

  it('loads and parses a valid OpenAPI 3.0 YAML file', () => {
    const absPath = path.join(__dirname, 'valid3.yml');
    fs.writeFileSync(
      absPath,
      'openapi: "3.0.0"\ninfo:\n  title: t\n  version: v\npaths: {}',
    );
    try {
      const result = makeApiSpec(absPath);
      expect(result).toBeInstanceOf(OpenApi3Spec);
    } finally {
      fs.unlinkSync(absPath);
    }
  });

  it('throws for invalid OpenAPI spec', () => {
    const badSpec = { openapi: '3.0.0', info: {}, paths: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => makeApiSpec(badSpec as any)).toThrow(/Invalid OpenAPI spec/);
  });
});
