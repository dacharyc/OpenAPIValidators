import AxiosResponse, { RawAxiosResponse } from './classes/AxiosResponse';
import type { RawResponse } from './classes/AbstractResponse';

type PlainResponseMock = { status: number; body?: unknown; req: unknown };

export default function makeResponse(res: RawResponse): AxiosResponse {
  if (!res || typeof res !== 'object') {
    throw new TypeError('Invalid response object passed to makeResponse');
  }
  // Support Axios-style responses
  if ('data' in res && 'status' in res && 'request' in res) {
    return new AxiosResponse(res as RawAxiosResponse);
  }
  // Strictly accept any object with both 'status' and 'req' (plain object mocks)
  if (
    Object.prototype.hasOwnProperty.call(res, 'status') &&
    Object.prototype.hasOwnProperty.call(res, 'req')
  ) {
    const plain = res as unknown as PlainResponseMock;
    const axiosLike = {
      status: plain.status,
      data: plain.body,
      request: plain.req,
    };
    return new AxiosResponse(axiosLike as RawAxiosResponse);
  }
  // Only throw if truly unusable
  throw new TypeError('Unknown response object type passed to makeResponse');
}
