import AbstractResponse from '../../../src/openapi-validator/classes/AbstractResponse';

export default class MockResponse extends AbstractResponse {
  public override status: number;

  public override req: { method: string; path: string };

  protected override body: unknown;

  protected override bodyHasNoContent: boolean;

  constructor(
    status: number,
    req: { method: string; path: string },
    body: unknown = {},
  ) {
    // Create a minimal RawAxiosResponse-like object for the mock
    const mockRawResponse = {
      status,
      data: body,
      request: req,
      statusText: '',
      headers: {},
      config: {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(mockRawResponse as any);
    this.status = status;
    this.req = req;
    this.body = body;
    this.bodyHasNoContent = false;
  }

  getBodyForValidation(): unknown {
    return this.body;
  }
}
