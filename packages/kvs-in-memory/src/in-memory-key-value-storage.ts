import { IKeyValueStorage, KvsSetValueError, KvsUpdateValueError } from '@flex/kvs-core';

interface IStorageItem<T> {
  value: T;
  timer: NodeJS.Timeout | null;
}

export class InMemoryKeyValueStorage<T> implements IKeyValueStorage<T> {
  private readonly storage = new Map<string, IStorageItem<T>>();

  get(key: string): Promise<T | null> {
    const value = this.storage.get(key);

    if (value == null) {
      return Promise.resolve(null);
    }

    return Promise.resolve(value.value);
  }

  set(key: string, value: T, ttlSec?: number): Promise<void> {
    if (this.storage.has(key)) {
      return Promise.reject(new KvsSetValueError('The key is already defined', key, ttlSec));
    }

    this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });

    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    const item = this.storage.get(key);

    if (item == null) {
      return Promise.resolve();
    }

    this.cleanTimer(item);

    this.storage.delete(key);

    return Promise.resolve();
  }

  update(key: string, value: T, ttlSec?: number): Promise<void> {
    const item = this.storage.get(key);

    if (item == null) {
      return Promise.reject(new KvsUpdateValueError('Key is not defined', key, ttlSec));
    }

    this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });

    return Promise.resolve();
  }

  updateValue(key: string, value: T): Promise<void> {
    const item = this.storage.get(key);

    if (item == null) {
      return Promise.reject(new KvsUpdateValueError('Key is not defined', key));
    }

    item.value = value;

    return Promise.resolve();
  }

  updateTtl(key: string, ttlSec?: number): Promise<void> {
    const item = this.storage.get(key);

    if (item == null) {
      return Promise.reject(new KvsUpdateValueError('Key is not defined', key, ttlSec));
    }

    this.cleanTimer(item);

    item.timer = this.setTtl(key, ttlSec);

    return Promise.resolve();
  }

  setOrUpdate(key: string, value: T, ttlSec?: number): Promise<void> {
    const item = this.storage.get(key);

    if (item != null) {
      this.cleanTimer(item);
    }

    this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });

    return Promise.resolve();
  }

  private cleanTimer(item: IStorageItem<T>): void {
    if (item.timer != null) {
      clearTimeout(item.timer);
    }
  }

  private setTtl(key: string, ttlSec?: number): NodeJS.Timeout | null {
    if (ttlSec == null) {
      return null;
    }

    return setTimeout(() => this.storage.delete(key), ttlSec * 1000);
  }
}
