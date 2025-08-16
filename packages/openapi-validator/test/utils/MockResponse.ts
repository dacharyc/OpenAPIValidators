import AbstractResponse, {
  RawResponse,
} from '../../lib/classes/AbstractResponse';

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
    // Create a minimal RawResponse object for the mock
    const mockRawResponse: RawResponse = { status, body, req } as RawResponse;
    super(mockRawResponse);
    this.status = status;
    this.req = req;
    this.body = body;
    this.bodyHasNoContent = false;
  }

  getBodyForValidation(): unknown {
    return this.body;
  }
}
