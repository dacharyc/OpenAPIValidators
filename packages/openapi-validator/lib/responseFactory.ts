import AxiosResponse, { RawAxiosResponse } from './classes/AxiosResponse';
import type { RawResponse } from './classes/AbstractResponse';

export default function makeResponse(res: RawResponse): AxiosResponse {
  if (!res || typeof res !== 'object') {
    throw new TypeError('Invalid response object passed to makeResponse');
  }
  if ('data' in res) {
    return new AxiosResponse(res as RawAxiosResponse);
  }
  throw new TypeError('Unknown response object type passed to makeResponse');
}
