import SuperAgentResponse, {
  RawSuperAgentResponse,
} from '../../lib/classes/SuperAgentResponse';

describe('SuperAgentResponse', () => {
  it('should set status, body, req, and bodyHasNoContent correctly', () => {
    const res = {
      status: 200,
      body: { foo: 'bar' },
      req: { method: 'GET', path: '/foo' },
      text: '',
      accepted: false,
      badRequest: false,
      charset: '',
      clientError: false,
      files: [],
      forbidden: false,
      get: () => '',
      header: {},
      headers: {},
      info: false,
      links: {},
      noContent: false,
      notAcceptable: false,
      notFound: false,
      ok: true,
      redirect: false,
      serverError: false,
      statusType: 2,
      type: '',
      unauthorized: false,
      xhr: null,
    } as unknown as RawSuperAgentResponse;
    const sar = new SuperAgentResponse(res);
    expect(sar.status).toBe(200);
    expect(sar.req).toEqual({ method: 'GET', path: '/foo' });
    expect(sar.status).toBe(200);
    expect(sar.req).toEqual({ method: 'GET', path: '/foo' });
  });

  it('should detect isResTextPopulatedInsteadOfResBody', () => {
    const res = {
      status: 200,
      body: {},
      req: { method: 'GET', path: '/foo' },
      text: 'not-empty',
      accepted: false,
      badRequest: false,
      charset: '',
      clientError: false,
      files: [],
      forbidden: false,
      get: () => '',
      header: {},
      headers: {},
      info: false,
      links: {},
      noContent: false,
      notAcceptable: false,
      notFound: false,
      ok: true,
      redirect: false,
      serverError: false,
      statusType: 2,
      type: '',
      unauthorized: false,
      xhr: null,
    } as unknown as RawSuperAgentResponse;
    const sar = new SuperAgentResponse(res);
    expect(sar.isTextPopulatedInsteadOfBody).toBe(true);
  });

  describe('getBodyForValidation', () => {
    it('returns null if bodyHasNoContent', () => {
      const res = {
        status: 204,
        body: {},
        req: { method: 'DELETE', path: '/baz' },
        text: '',
        accepted: false,
        badRequest: false,
        charset: '',
        clientError: false,
        files: [],
        forbidden: false,
        get: () => '',
        header: {},
        headers: {},
        info: false,
        links: {},
        noContent: false,
        notAcceptable: false,
        notFound: false,
        ok: true,
        redirect: false,
        serverError: false,
        statusType: 2,
        type: '',
        unauthorized: false,
        xhr: null,
      } as unknown as RawSuperAgentResponse;
      const sar = new SuperAgentResponse(res);
      expect(sar.getBodyForValidation()).toBeNull();
    });

    it('returns res.text if isResTextPopulatedInsteadOfResBody', () => {
      const res = {
        status: 200,
        body: {},
        req: { method: 'GET', path: '/foo' },
        text: 'some text',
        accepted: false,
        badRequest: false,
        charset: '',
        clientError: false,
        files: [],
        forbidden: false,
        get: () => '',
        header: {},
        headers: {},
        info: false,
        links: {},
        noContent: false,
        notAcceptable: false,
        notFound: false,
        ok: true,
        redirect: false,
        serverError: false,
        statusType: 2,
        type: '',
        unauthorized: false,
        xhr: null,
      } as unknown as RawSuperAgentResponse;
      const sar = new SuperAgentResponse(res);
      expect(sar.getBodyForValidation()).toBe('some text');
    });

    it('returns body otherwise', () => {
      const res = {
        status: 200,
        body: { foo: 'bar' },
        req: { method: 'GET', path: '/foo' },
        text: '{}',
        accepted: false,
        badRequest: false,
        charset: '',
        clientError: false,
        files: [],
        forbidden: false,
        get: () => '',
        header: {},
        headers: {},
        info: false,
        links: {},
        noContent: false,
        notAcceptable: false,
        notFound: false,
        ok: true,
        redirect: false,
        serverError: false,
        statusType: 2,
        type: '',
        unauthorized: false,
        xhr: null,
      } as unknown as RawSuperAgentResponse;
      const sar = new SuperAgentResponse(res);
      expect(sar.getBodyForValidation()).toEqual({ foo: 'bar' });
    });
  });

  it('summary includes text if isResTextPopulatedInsteadOfResBody', () => {
    const res = {
      status: 200,
      body: {},
      req: { method: 'GET', path: '/foo' },
      text: 'summary text',
      accepted: false,
      badRequest: false,
      charset: '',
      clientError: false,
      files: [],
      forbidden: false,
      get: () => '',
      header: {},
      headers: {},
      info: false,
      links: {},
      noContent: false,
      notAcceptable: false,
      notFound: false,
      ok: true,
      redirect: false,
      serverError: false,
      statusType: 2,
      type: '',
      unauthorized: false,
      xhr: null,
    } as unknown as RawSuperAgentResponse;
    const sar = new SuperAgentResponse(res);
    const summary = sar.summary();
    expect(summary.text).toBe('summary text');
  });
});
