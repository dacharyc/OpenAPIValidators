# OpenAPI Validators

Use Jest to assert that HTTP responses satisfy an OpenAPI spec.

## Problem 😕

If your server's behaviour doesn't match your API documentation, then you need
to correct your server, your documentation, or both. The sooner you know the better.

## Solution 😄

This test plugin lets you automatically test whether your server's behaviour
and documentation match. It extends Jest to support the
[OpenAPI standard](https://swagger.io/docs/specification/about/) for documenting
REST APIs. In your JavaScript tests, you can simply assert
`expect(responseObject).toSatisfyApiSpec()`

```javascript
// Import this plugin
import jestOpenAPI from 'jest-openapi';

// Load an OpenAPI file (YAML or JSON) into this plugin
jestOpenAPI('path/to/openapi.yml');

// Write your test
describe('GET /example/endpoint', () => {
  it('should satisfy OpenAPI spec', async () => {
    // Get an HTTP response from your server (e.g. using axios)
    const res = await axios.get('http://localhost:3000/example/endpoint');

    expect(res.status).toEqual(200);

    // Assert that the HTTP response satisfies the OpenAPI spec
    expect(res).toSatisfyApiSpec();
  });
});
```

## Origin and Changes

This package is forked from [OpenAPIValidators](https://github.com/openapi-library/OpenAPIValidators).
We have:

- Updated and removed dependencies to modern, supported tooling
- Removed support for Chai and SuperAgent

Otherwise, we have preserved the original functionality as-is. All credit to
the folks who contributed to that package!


