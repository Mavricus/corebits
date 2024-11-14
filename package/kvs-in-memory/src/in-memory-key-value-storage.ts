import { IKeyValueStorage } from '@flex/kvs-core';

export class InMemoryKeyValueStorage implements IKeyValueStorage {
  get(key: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }

  set(key: string, value: string, ttl: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
 
  delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  update(key: string, value: string, ttl: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setValue(key: string, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setTTL(key: string, ttl: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
