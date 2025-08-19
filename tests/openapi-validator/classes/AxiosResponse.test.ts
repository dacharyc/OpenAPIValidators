import AxiosResponse, {
  RawAxiosResponse,
} from 'openapi-validator/lib/classes/AxiosResponse';

describe('AxiosResponse', () => {
  it('should set status, body, req, and bodyHasNoContent correctly', () => {
    const res = {
      status: 200,
      data: { foo: 'bar' },
      request: { method: 'GET', path: '/foo' },
    } as unknown as RawAxiosResponse;
    const ar = new AxiosResponse(res);
    expect(ar.status).toBe(200);
    expect(ar.req).toEqual({ method: 'GET', path: '/foo' });
    expect(ar.getBodyForValidation()).toEqual({ foo: 'bar' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(ar.isBodyEmpty).toBe(false);
  });

  it('should set bodyHasNoContent true if body is empty string', () => {
    const res = {
      status: 204,
      data: '',
      request: { method: 'DELETE', path: '/baz' },
    } as unknown as RawAxiosResponse;
    const ar = new AxiosResponse(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(ar.isBodyEmpty).toBe(true);
    expect(ar.getBodyForValidation()).toBeNull();
  });
});
