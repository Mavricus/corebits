import { PromiseFulfillError } from '../error/promise-fulfill-error.js';
import { DelayedPromise, IDelayedPromise } from './delayed-promise.js';

export interface IDelayedPromiseController {
  get count(): number;

  create<T>(): IDelayedPromise<T>;

  rejectAll(error: Error): void;
}

export class DelayedPromiseController implements IDelayedPromiseController {
  private readonly collection = new Set<IDelayedPromise<unknown>>();

  get count(): number {
    return this.collection.size;
  }

  create<T>(): IDelayedPromise<T> {
    const promise = new DelayedPromise<T>();

    promise
      .finally(() => this.collection.delete(promise))
      .catch((error: Error) => {
        throw new PromiseFulfillError('Cannot remove from promises collection', promise.state, error);
      });
    this.collection.add(promise);

    return promise;
  }

  rejectAll(error: Error): void {
    for (const promise of this.collection.values()) {
      promise.reject(error);
    }

    this.collection.clear();
  }
}
