export interface IKeyValueStorage {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, ttl: number): Promise<void>;

  delete(key: string): Promise<void>;

  update(key: string, value: string, ttl: number): Promise<void>;

  setValue(key: string, value: string): Promise<void>;

  setTTL(key: string, ttl: number): Promise<void>;
}
