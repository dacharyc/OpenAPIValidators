import AbstractResponse from '../../../src/openapi-validator/classes/AbstractResponse';

describe('AbstractResponse', () => {
  // The 'res' parameter is typed as 'any' because this is a test mock, not a real HTTP response.
  class TestResponse extends AbstractResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(res: any) {
      super(res);
      this.status = res.status;
      this.body = res.body;
      this.req = res.req;
      this.bodyHasNoContent = false;
    }

    getBodyForValidation() {
      return this.body;
    }
  }

  it('summary returns body', () => {
    const res = {
      status: 200,
      body: { foo: 'bar' },
      req: { method: 'GET', path: '/foo' },
    };
    const tr = new TestResponse(res);
    expect(tr.summary()).toEqual({ body: { foo: 'bar' } });
  });

  it('toString returns stringified summary', () => {
    const res = {
      status: 200,
      body: { foo: 'bar' },
      req: { method: 'GET', path: '/foo' },
    };
    const tr = new TestResponse(res);
    expect(tr.toString()).toBe("{ body: { foo: 'bar' } }");
  });
});
