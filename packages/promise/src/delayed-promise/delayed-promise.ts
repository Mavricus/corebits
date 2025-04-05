import { PromiseFulfillError } from '../error/promise-fulfill-error.js';

export enum DelayedPromiseState {
  PENDING = 'PENDING',
  REJECTED = 'FAILED',
  RESOLVED = 'RESOLVED',
}

export interface IDelayedPromise<T> extends Promise<T> {
  get state(): DelayedPromiseState;

  isFulfilled(): boolean;

  resolve(result: T): void;

  reject(error: Error): void;
}

export class DelayedPromise<T> extends Promise<T> implements IDelayedPromise<T> {
  private promiseState: DelayedPromiseState = DelayedPromiseState.PENDING;

  private resolvePromise: ((result: T) => void) | null = null;

  private rejectPromise: ((error: Error) => void) | null = null;

  constructor() {
    super((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  get state(): DelayedPromiseState {
    return this.promiseState;
  }

  isFulfilled(): boolean {
    return this.promiseState !== DelayedPromiseState.PENDING;
  }

  resolve(result: T): void {
    if (this.isFulfilled()) {
      throw new PromiseFulfillError('Cannot resolve, DelayedPromise is fulfilled', this.promiseState);
    }
    if (this.resolvePromise == null) {
      throw new PromiseFulfillError('Cannot resolve, DelayedPromise is not initialised', this.promiseState);
    }

    this.resolvePromise(result);
    this.promiseState = DelayedPromiseState.RESOLVED;
  }

  reject(error: Error): void {
    if (this.isFulfilled()) {
      throw new PromiseFulfillError('Cannot reject, DelayedPromise is fulfilled', this.promiseState);
    }
    if (this.rejectPromise == null) {
      throw new PromiseFulfillError('Cannot reject, DelayedPromise is not initialised', this.promiseState);
    }

    this.rejectPromise(error);
    this.promiseState = DelayedPromiseState.REJECTED;
  }
}
