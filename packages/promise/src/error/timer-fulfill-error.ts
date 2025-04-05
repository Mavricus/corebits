import { BaseError, IBaseErrorContext } from '@flex-platform/base-error';
import { TimerState } from '../interruptible-timer/interruptible-timer-promise.js';

export interface ITimerFulfillErrorFulfillErrorContext extends IBaseErrorContext {
  state: TimerState;
}

export class TimerFulfillError extends BaseError<ITimerFulfillErrorFulfillErrorContext> {
  constructor(message: string, state: TimerState, originalError?: Error) {
    super(message, { state }, originalError);
  }
}
