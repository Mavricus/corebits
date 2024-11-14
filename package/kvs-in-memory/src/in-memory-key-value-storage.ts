import {
  IKeyValueStorage,
  KvsDeleteValueError,
  KvsGetValueError,
  KvsSetValueError,
  KvsUpdateValueError,
} from '@flex/kvs-core';

export class InMemoryKeyValueStorage implements IKeyValueStorage {
  get(key: string): Promise<string | null> {
    throw new KvsGetValueError('Method get not implemented.', key);
  }

  set(key: string, value: string, ttl?: number): Promise<void> {
    throw new KvsSetValueError('Method set not implemented.', key, ttl);
  }

  delete(key: string): Promise<void> {
    throw new KvsDeleteValueError('Method delete not implemented.', key);
  }

  update(key: string, value: string, ttl?: number): Promise<void> {
    throw new KvsUpdateValueError('Method update not implemented.', key, ttl);
  }

  setValue(key: string /*, value: string*/): Promise<void> {
    throw new KvsUpdateValueError('Method setValue not implemented.', key);
  }

  setTtl(key: string, ttl: number): Promise<void> {
    throw new KvsUpdateValueError('Method setTtl not implemented.', key, ttl);
  }
}
