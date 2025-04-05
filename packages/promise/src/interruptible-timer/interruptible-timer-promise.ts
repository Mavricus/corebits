import { TimerFulfillError } from '../error/timer-fulfill-error.js';

export enum TimerState {
  WAITING = 'WAITING',
  FINISHED = 'FINISHED',
  INTERRUPTED = 'INTERRUPTED',
}

export interface IInterruptibleTimerPromise extends Promise<void> {
  get state(): TimerState;

  isFinished(): boolean;

  interrupt(): void;
}

export class InterruptibleTimerPromise extends Promise<void> implements IInterruptibleTimerPromise {
  private readonly timer: NodeJS.Timeout;

  private timerState: TimerState = TimerState.WAITING;

  private resolvePromise: (() => void) | null = null;

  constructor(timeoutMs: number) {
    super((resolve) => {
      this.resolvePromise = resolve;
    });

    this.timer = setTimeout(() => {
      if (this.timerState !== TimerState.WAITING) {
        throw new TimerFulfillError('Cannot fini, InterruptibleTimerPromise is fulfilled', this.timerState);
      }
      if (this.resolvePromise == null) {
        throw new TimerFulfillError('Cannot resolve, InterruptibleTimerPromise is not initialised', this.timerState);
      }
      this.resolvePromise();
      this.timerState = TimerState.FINISHED;
    }, timeoutMs);
  }

  get state(): TimerState {
    return this.timerState;
  }

  isFinished(): boolean {
    return this.timerState !== TimerState.WAITING;
  }

  interrupt(): void {
    if (this.isFinished()) {
      throw new TimerFulfillError('Cannot interrupt timer, InterruptibleTimerPromise is fulfilled', this.timerState);
    }

    if (this.resolvePromise == null) {
      throw new TimerFulfillError(
        'Cannot interrupt timer, InterruptibleTimerPromise is not initialised',
        this.timerState,
      );
    }

    clearTimeout(this.timer);
    this.timerState = TimerState.INTERRUPTED;
  }
}
