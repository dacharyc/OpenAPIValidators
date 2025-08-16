import makeResponse from '../lib/responseFactory';
import AxiosResponse from '../lib/classes/AxiosResponse';
import SuperAgentResponse from '../lib/classes/SuperAgentResponse';

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
    const res = { data: 'foo', status: 200 } as any;
    const result = makeResponse(res);
    expect(result).toBeInstanceOf(AxiosResponse);
  });

  it('returns SuperAgentResponse if res has status but not data', () => {
    const res = {
      status: 201,
      body: 'bar',
      req: { method: 'GET', path: '/foo' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const result = makeResponse(res);
    expect(result).toBeInstanceOf(SuperAgentResponse);
  });

  it('throws if res is not recognized as AxiosResponse or SuperAgentResponse', () => {
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
