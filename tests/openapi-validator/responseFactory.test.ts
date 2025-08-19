import makeResponse from '../../src/openapi-validator/responseFactory';
import AxiosResponse from '../../src/openapi-validator/classes/AxiosResponse';

describe('makeResponse', () => {
  it('throws if res is not an object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => makeResponse(null as any)).toThrow(TypeError);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => makeResponse(undefined as any)).toThrow(TypeError);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => makeResponse(42 as any)).toThrow(TypeError);
  });

  it('returns AxiosResponse if res has data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = { data: 'foo', status: 200, request: {} } as any;
    const result = makeResponse(res);
    expect(result).toBeInstanceOf(AxiosResponse);
  });

  it('throws if res is not recognized as AxiosResponse', () => {
    const res = {
      statusCode: 202,
      body: 'baz',
      req: { method: 'POST', path: '/bar' },
      request: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    expect(() => makeResponse(res)).toThrow(TypeError);
  });
});
