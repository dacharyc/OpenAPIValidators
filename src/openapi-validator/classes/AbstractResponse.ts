import { stringify } from '../utils/common.utils';

export type RawAxiosResponse = import('./AxiosResponse').RawAxiosResponse;
export type RawResponse = RawAxiosResponse;

export default abstract class AbstractResponse {
  public declare status: number;

  public declare req: { method: string; path: string };

  public abstract getBodyForValidation(): unknown;

  protected body: unknown;

  protected declare bodyHasNoContent: boolean;

  constructor(protected res: RawResponse) {}

  summary(): { body: unknown } {
    return {
      body: this.body,
    };
  }

  toString(): string {
    return stringify(this.summary());
  }
}

export type ActualResponse = AbstractResponse;

export type ActualRequest = AbstractResponse['req'];
