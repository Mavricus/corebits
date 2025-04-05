import { BaseError, IBaseErrorContext } from '@corebits/base-error';
import { DelayedPromiseState } from '../delayed-promise/delayed-promise.js';

export interface IPromiseFulfillErrorContext extends IBaseErrorContext {
  state: DelayedPromiseState;
}

export class PromiseFulfillError extends BaseError<IPromiseFulfillErrorContext> {
  constructor(message: string, state: DelayedPromiseState, originalError?: Error) {
    super(message, { state }, originalError);
  }
}
