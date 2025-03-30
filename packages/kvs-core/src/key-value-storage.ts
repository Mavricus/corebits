export interface IKeyValueStorage<T> {
  get(key: string): Promise<T | null>;

  set(key: string, value: T, ttlSec?: number): Promise<void>;

  delete(key: string): Promise<void>;

  update(key: string, value: T, ttlSec?: number): Promise<void>;

  updateValue(key: string, value: T): Promise<void>;

  updateTtl(key: string, ttlSec?: number): Promise<void>;

  setOrUpdate(key: string, value: T, ttlSec?: number): Promise<void>;
}
