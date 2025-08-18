import AxiosResponse, { RawAxiosResponse } from './classes/AxiosResponse';
import SuperAgentResponse, {
  RawSuperAgentResponse,
} from './classes/SuperAgentResponse';
import type { RawResponse } from './classes/AbstractResponse';

export default function makeResponse(
  res: RawResponse,
): AxiosResponse | SuperAgentResponse {
  if (!res || typeof res !== 'object') {
    throw new TypeError('Invalid response object passed to makeResponse');
  }
  if ('data' in res) {
    return new AxiosResponse(res as RawAxiosResponse);
  }
  if ('status' in res) {
    return new SuperAgentResponse(res as RawSuperAgentResponse);
  }
  throw new TypeError('Unknown response object type passed to makeResponse');
}
